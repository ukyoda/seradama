(function(namespace){
var name = "srdm";

//コンストラクタ

/**
 * コンストラクタ
 * ```
 * 出力形式
 * {
 *     target: ゲームを描画する
 *     textureURLs: [...],
 *     backgroundURL: "背景画像UrL"
 *     gameInfoURL: "http://...",
 *     socketURL: ""
 * }
 * ```
 */
var Game = function Game(manifest) {

	//URL設定
	this.textureURLs = manifest.textureURLs || ["texture/field1.json", "texture/kabe.json", "texture/player.json"];
	this.backgroundURL = manifest.backgroundURL || 'texture/background/background.png';
	this.gameInfoURL = manifest.gameInfoURL || "game/gamedata.json";
	this.socketURL = manifest.socketURL || "//";
	var target = manifest.target || "body";
	var width = $(target).width();
	var height = $(target).height();
	this.viewerSize = {
		width: width,
		height: height
	};
	this.worldSize = {
		width: width,
		height: height
	};
	this.scale = {
		x:Game.scale(),
		y:Game.scale()
	};
	//ターゲットのタグ
	this.$el = $(manifest.target);
	this.el = this.$el.get(0);

	//PIXI.jsのオブジェクト
	this.stage = new PIXI.Stage(0xffffff);
	this.renderer = new PIXI.autoDetectRenderer(width, height);

	//自ボールスプライト
	this.player = null;

	this.fieldLayer = new PIXI.DisplayObjectContainer();
	this.fieldLayer.position.set(0,0);

	this.playerLayer = new PIXI.DisplayObjectContainer();
	this.playerLayer.position.set(0,0);

	this.objectLayer = new PIXI.DisplayObjectContainer();
	this.objectLayer.position.set(0,0);

	this.menuLayer = new PIXI.DisplayObjectContainer();
	this.menuLayer.position.set(0,0);

	//レイヤーをステージに登録
	this.stage.addChild(this.fieldLayer);
	this.stage.addChild(this.objectLayer);
	this.stage.addChild(this.playerLayer);
	this.stage.addChild(this.menuLayer);

	//コントローラ関連の情報を記憶する為のオブジェクト (プライベート)
	this._controller = {
		gravity:{x: 0, y:0}
	};

	//Socket.ioを記憶しておく為のメンバ
	this._socket = null;

	//canvas追加
	this.$el.append(this.renderer.view);

};
//prototypeショートカット
Game.fn = Game.prototype;

//スタティックメソッド

Game.getAgent = (function(){
	var android = 'Android';
	var ios = 'iOS';
	var windows = 'Windows';
	var other = 'Other';

	var getAgent = function(){
		var agent = window.navigator.userAgent, ua = '';
		if(agent.search(/iPhone/) != -1) {
			ua = ios;
		} else if(agent.search(/iPad/) != -1) {
			ua = ios;
		} else if(agent.search(/Android/) != -1) {
			ua = android;
		} else if(agent.search(/Windows/) != -1){
			ua = windows;
		} else {
			ua = other;
		}
		return ua;
	};
	getAgent.ios = ios;
	getAgent.android = android;
	getAgent.windows = windows;
	getAgent.other = other;

	return getAgent;

}());

Game.getGravityDirection = function(){
	var agent = Game.getAgent();
	switch(agent) {
	case Game.getAgent.ios:
		return 1;
	case Game.getAgent.android:
		return -1;
	case Game.getAgent.windows:
		return -1;
	default:
		return 1;
	}
};

Game.checkDeviceMotion = function(){
	if('ondevicemotion' in window) {
		return true;
	} else {
		return false;
	}
};
Game.scale = function(){
	var value = {};
	value.domain = [0,1];
	value.range = [0,1];

	var rescale = function(val){
		var domain = value.domain;
		var range = value.range;
		var a = (range[0]-range[1]) / (domain[0]-domain[1]);
		var b = range[0] - a*domain[0];
		return a*val + b;
	};


	rescale.domain = function(distribution) {
		value.domain = distribution;
		return rescale;
	};

	rescale.range = function(distribution) {
		value.range = distribution;
		return rescale;
	};

	return rescale;

};

//テクスチャロード

Game.fn.loadTexture = function(){
	var that = this;
	var deferred = $.Deferred();
	var loader = new PIXI.AssetLoader(that.textureURLs);
	loader.onComplete = function(){
		that.onCompleteTexture();
		deferred.resolve();
	};
	loader.load();
	return deferred;
};

Game.fn.onCompleteTexture = function(){

};

//ゲームデータロード

Game.fn.loadGameData = function(){
	var that = this;
	var ajaxObj = $.ajax({
		url: this.gameInfoURL
	}).done(function(data){
		that.onCompleteGameData(data);
	});
	return ajaxObj;
};

Game.fn.onCompleteGameData = function(data){
	var world = data.world;
	var width = world.width, height = world.height, grid = world.grid;
	var fieldSet = this.fieldLayer;
	var that = this;
	this.worldSize = {
		width: width,
		height: height
	};
	var sprite = new PIXI.Sprite.fromImage(this.backgroundURL);
	sprite.width = this.worldSize.width;
	sprite.height = this.worldSize.height;
	fieldSet.addChild(sprite);

};

//Websocket関連処理

/**
 * ソケットに接続
 */
Game.fn.socketConnect = function(socketURL) {
	var deferred = $.Deferred();
	var that = this;

	this._socket = io.connect(socketURL);
	this._socket.on('connect', function(){
		deferred.resolve();
	});

	this._socket.on('message', function(data){
		that.onMessage.call(that, data);
	});

	return deferred;

};
/**
 * サーバからデータを取得したとき
 */

Game.fn.onMessage = function(data) {
	var that = this;
	data.value.forEach(function(val, index){
		var datatype = val.datatype || 'object';

		//datatypeオーバーライド(特殊処理)

		switch(datatype) {
		case "object": //障害物情報
			that.updateObject(val);
			break;
		case "you": //自プレイヤー情報
			that.updatePlayer(val);
			break;
		case "player": //プレイヤー情報
			that.updatePlayer(val);
			break;
		}
	});

};


Game.fn.onDisconnected = function(){

};

/**
 * データ更新
 */
Game.fn.emit = function(data) {
	//var _socket = this._socket || {};
	//var socket = _socket.socket || {};
	//var transport = socket.transport || {};
	//var myId = transport.sessid;
	var player = this.player || {};
	var myId = player.id;
	//プレイヤーデータが出来ていないならemitしない
	if(!myId) {return;}
	data.id = myId;
	this._socket.emit('message', data);
};

//コントローラ
/**
 * コントローラで実行する処理
 */
Game.fn.onController = function(){
	//if(!this.player) {return ;}
	var gravity = this._controller.gravity;
	this.emit({
		gravity: gravity
	});
};
Game.fn.setDeviceMotion = function(gravity){
	if(typeof gravity !== "object") {
		gravity = {};
	}
	gravity.x = gravity.x || 0;
	gravity.y = gravity.y || 0;
	this._controller.gravity = gravity;
};

//プレイヤー関連

Game.fn.removePlayer = function(id) {
	var filterSprite = this.playerLayer.children.filter(function(val){
		return (val.id === id);
	});
	if(!filterSprite.length){
		return false;
	}
	var sprite = filterSprite[0];
	this.playerLayer.removeChild(sprite);
	if(this.player === sprite) {
		this.player = undefined;
	}
	return this;
};

Game.fn.updatePlayer = function(data){
	var id = data.id;
	var position = {
		x:window.parseFloat(data.x, 10),
		y:window.parseFloat(data.y, 10)
	};
	var textureId = data.texture;
	var datatype = data.datatype || "object";
	var angle = window.parseFloat(data.angle, 10);
	var layer = this.playerLayer, filterVal=[], sprite;
	var i, length;
	if(data.delflag) {
		this.removePlayer(data.id);
		return null;
	}

	filterVal = layer.children.filter(function(val){
		return (val.id === id);
	});
	if(filterVal.length) {
		sprite = filterVal[0];
	} else {
		sprite = new PIXI.Sprite.fromFrame(textureId);
		sprite.id = id;	//固有ID記憶
		layer.addChild(sprite);
		sprite.width=32;sprite.height=32;
	}
	//子スプライト削除
	for(i = 0, length = sprite.children.length; i<length; i++) {
		sprite.removeChild(sprite.children[i]);
	}


	//スプライト情報を更新
	sprite.prevPosition = sprite.position.clone();	//前の位置情報を記憶
	sprite.position.set(position.x,position.y);
	sprite.anchor.set(0.5,0.5);
	sprite.prevRotation = sprite.rotation;
	sprite.rotation = angle;



	//自ボールの場合，プロパティに参照を追加
	if(datatype === "you") {
		this.player = sprite;
	}
	return sprite;

};

//障害物関連

Game.fn.removeObject = function(id) {
	var filterSprite = this.objectLayer.children.filter(function(val){
		return (val.id === id);
	});
	if(!filterSprite.length){
		return false;
	}
	var sprite = filterSprite[0];
	this.objectLayer.removeChild(sprite);
	return this;
};

Game.fn.updateObject = function(data){
	var id = data.id;
	var position = {
		x:window.parseFloat(data.x, 10),
		y:window.parseFloat(data.y, 10)
	};
	var textureId = data.texture;
	var datatype = data.datatype || "object";
	var angle = window.parseFloat(data.angle, 10);
	var layer = this.objectLayer, filterVal=[], sprite;
	if(data.delflag) {
		this.removeObject(data.id);
	}
	filterVal = layer.children.filter(function(val){
		return (val.id === id);
	});
	if(filterVal.length) {
		sprite = filterVal[0];
	} else {
		sprite = new PIXI.Sprite.fromFrame(textureId);
		sprite.id = id;	//固有ID記憶
		layer.addChild(sprite);
	}

	//スプライト情報を更新
	sprite.position.set(position.x,position.y);
	sprite.anchor.set(0.5,0.5);
	sprite.rotation = angle;
	return sprite;

};

//フィールド関連

Game.fn.createFieldChip = function(name) {
	return PIXI.Sprite.fromFrame(name);
};

//アニメーション・描画

//全体をリスケール
Game.fn.rescale = function(){
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var worldWidth = this.worldSize.width;
	var worldHeight = this.worldSize.height;
	var size={x:1,y:1},scale={x:1,y:1};

	if(windowWidth < windowHeight) {
		size.x = windowWidth * 0.8;
		size.y = size.x / worldWidth * worldHeight;
	} else {
		size.y = windowHeight * 0.8;
		size.x = size.y / worldHeight * worldWidth;
	}
	scale.x = size.x/this.worldSize.width;
	scale.y = size.y/this.worldSize.height;

	//ウインドウサイズリサイズ
	this.renderer.resize(size.x, size.y);
	this.$el.width(size.x).height(size.y);
	//スケール変換
	this.playerLayer.scale.set(scale.x, scale.y);
	this.fieldLayer.scale.set(scale.x, scale.y);
	this.objectLayer.scale.set(scale.x, scale.y);
	this.menuLayer.scale.set(scale.x, scale.y);
};

Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	this.rescale();

	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate(that);
	});
};

//ゲームスタート

Game.fn.start = function(){
	var that = this;
	var load = that.loadTexture();
	return load.then(function(){
		return that.loadGameData();
	});
};

namespace.Game = Game;

if(typeof define === "function" && define.amd){
	define(name,namespace);
} else if (typeof module === "object" && module.exports) {
	module.exports = namespace;
} else {
	this[name] = namespace;
}

}({}));
