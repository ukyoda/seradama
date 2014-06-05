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
 *     gameInfoURL: "http://...",
 *     socketURL: ""
 * }
 * ```
 */
var Game = function Game(manifest) {

	//URL設定
	this.textureURLs = manifest.textureURLs || ["texture/field1.json", "texture/kabe.json", "texture/player.json"];
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
	this.fieldLayer.position.x = 0;
	this.fieldLayer.position.y = 0;

	this.playerLayer = new PIXI.DisplayObjectContainer();
	this.playerLayer.position.x = 0;
	this.playerLayer.position.y = 0;

	this.objectLayer = new PIXI.DisplayObjectContainer();
	this.objectLayer.position.x = 0;
	this.objectLayer.position.y = 0;

	//レイヤーをステージに登録
	this.stage.addChild(this.fieldLayer);
	this.stage.addChild(this.objectLayer);
	this.stage.addChild(this.playerLayer);

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

Game.MOVE_UP = 1;
Game.MOVE_RIGHT = 2;
Game.MOVE_BOTTOM = 3;
Game.MOVE_LEFT = 4;

Game.CODE_UP = 38;
Game.CODE_RIGHT = 39;
Game.CODE_BOTTOM = 40;
Game.CODE_LEFT = 37;

//スタティックメソッド

Game.getAgent = (function(){
	var android = 'Android';
	var ios = 'iOS';
	var other = 'Other';

	var getAgent = function(){
		var agent = window.navigator.userAgent, ua = '';
		if(agent.search(/iPhone/) != -1) {
			ua = ios;
		} else if(agent.search(/iPad/) != -1) {
			ua = ios;
		} else if(agent.search(/Android/) != -1) {
			ua = android;
		} else {
			ua = other;
		}
		return ua;
	};
	getAgent.ios = ios;
	getAgent.android = android;
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
	var map = data.mapdata;
	var name = "chip_0.png";
	var fieldSet = this.fieldLayer;
	var that = this;
	this.worldSize = {
		width: width*grid,
		height: height*grid,
		grid: grid
	};
	//
	map.forEach(function(val, index){
		var x = 32 * (index % width);
		var y = 32 * Math.floor(index / width);
		var sprite = that.createFieldChip("chip_"+val+".png");
		sprite.position.x=x;sprite.position.y=y;
		fieldSet.addChild(sprite);
	});
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
	}

	//スプライト情報を更新
	sprite.position.set(position.x,position.y);
	sprite.anchor.set(0.5,0.5);
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

//アニメーション

Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var size, scale;
	if(windowWidth < windowHeight) {
		size = windowWidth;
	} else {
		size = windowHeight;
	}
	size *= 0.8;	//0.8倍にする
	scale = size/800;
	size = 800*scale;
	//ウインドウサイズリサイズ
	this.renderer.resize(size, size);
	this.$el.width(size).height(size);
	//スケール変換
	this.playerLayer.scale.set(scale,scale);
	this.fieldLayer.scale.set(scale, scale);
	this.objectLayer.scale.set(scale, scale);

	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate.call(that);
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
