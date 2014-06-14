(function(namespace){
var name = "srdm";

//オーディオオブジェクト読み込み

var GameAudio = function Audio(audioData){
	this.deferred  = $.Deferred();
	this.src = audioData;
	var that = this;

	//イベントをAjaxで管理
	this.src.addEventListener('ended' , function(){
		that.deferred.resolve(that);
	});

};

GameAudio.fn = GameAudio.prototype;

GameAudio.fn.play = function(){
	this.src.play();
	return this;
};

GameAudio.fn.stop = function(){
	this.src.pause();
	this.src.load();
	return this;
};

GameAudio.fn.pause = function(){
	this.src.pause();
	return this;
};

GameAudio.fn.mute = function(){
	if(this.src.muted) {
		this.src.muted = false;
	} else {
		this.src.muted = true;
	}
};

//アラートメッセージ操作オブジェクト読み込み


var GameAlert = function GameAlert(){
	this.deferred = $.Deferred();
};

GameAlert.fn = GameAlert.prototype;



GameAlert.fn.createLayout = function() {
	var $div = $('<div/>');
	//コンテント追加
	$('<div/>').addClass('content').appendTo($div);
	return $div.addClass("alert");
};

GameAlert.fn.createGoalAlert = function(winner) {
	var $layout = this.createLayout();
	var $content = $layout.find('.content');
	var $p = $('<div/>').appendTo($content);
	var name = winner.name || winner.id;
	$p.text("@"+name+" さんがクリアしました");
	return $layout;
};

GameAlert.fn.createRankingAlert = function(rankers){
	var $layout = this.createLayout();
	var $content = $layout.find('.content');

	$('<div/>').text('★ランキング★').appendTo($content);

	var $ul = $('<ul/>').addClass('ranking').appendTo($content);
	//アイコンと名前を作成する関数
	var createImgView = function(name, img){
		var $div = $('<div/>');
		$div.addClass('grid name');
		$('<img/>').attr('src', img).appendTo($div);
		$('<span>').text('@'+name).appendTo($div);
		return $div;
	};

	$.each(rankers, function(index, data){
		var rank = data.rank;
		var count = data.data.win;
		var name = data.sprite.name || data.sprite.id;
		var img = data.sprite.img || "http://127.0.0.1/images/favicon.ico";
		var $li = $('<li/>');
		$('<div/>').addClass('grid rank').text(rank).appendTo($li);
		createImgView(name, img).appendTo($li);
		$('<div/>').addClass('grid-right count').text(count).appendTo($li);
		$ul.append($li);
	});

	return $layout;

};

GameAlert.fn.createYourRankAlert = function(rankData){
	var $layout = this.createLayout();
	var $content = $layout.find('.content');
	var name = rankData.sprite.name || rankData.sprite.id;
	var img = rankData.sprite.img || "http://127.0.0.1/images/favicon.ico";
	var rank = rankData.rank;
	var count = rankData.data.win;

	$('<div/>').text('★あなたの順位★').appendTo($content);

	var $ul = $('<ul/>').addClass('ranking').appendTo($content);
	//アイコンと名前を作成する関数
	var createImgView = function(name, img){
		var $div = $('<div/>');
		$div.addClass('grid name');
		$('<img/>').attr('src', img).appendTo($div);
		$('<span>').text('@'+name).appendTo($div);
		return $div;
	};

	var $li = $('<li/>');
	$('<div/>').addClass('grid rank').text(rank).appendTo($li);
	createImgView(name, img).appendTo($li);
	$('<div/>').addClass('grid-right count').text(count).appendTo($li);
	$ul.append($li);

	return $layout;

};


GameAlert.fn.createMessageAlert = function(){
	var $layout = this.createLayout();
	var $content = $layout.find('.content');
	var $p = $('<div/>').appendTo($content);
	$p.text("1位目指して頑張ってください♪");
	return $layout;
};


GameAlert.fn.display = function($content) {
	$('body').append($content);

	return $content;
};

GameAlert.fn.hidden = function(){
	$('.alert').remove();
};

GameAlert.fn.animate = function($content){
	var deferred = $.Deferred();
	//表示されている情報をまずはいったん削除
	this.hidden();
	//アラート表示
	this.display($content).css("display", "none");
	//アニメーション設定
	$content.slideToggle("slow",function(){
		$content.delay(1000).slideToggle("slow", function(){
			deferred.resolve();
			$content.remove();
		});
	});

	return deferred;

};

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

	//ビューアサイズを登録
	this.viewerSize = {
		width: width,
		height: height
	};
	//ワールドサイズのデフォルト値
	this.worldSize = {
		width: width,
		height: height
	};

	//時間表示
	this.playTime = "";

	//メッセージ表示のインスタンスを生成する
	this.alert = new GameAlert();

	//オーディオファイルを登録
	//this.setAudio(".gameaudio");

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
	this.playerLayer.hash = {};

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

//オーディオファイル登録メソッド

Game.fn.setAudio = function(target){
	var audio = {};
	var that = this;

	$(target).find(".audio-file").each(function(){
		var val = $(this).get(0);
		var key = $(val).data().key;
		audio[key] = new GameAudio(val);
	});

	this.audio = audio;
	return this;
};

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
		case "ranking":
			that.congratulation(val);
			break;
		case "time":
			that.playTime = val.time;
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

Game.fn.emitInfo = function(data) {
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
	var sprite = this.playerLayer.hash[id];

	if(!sprite) {
		return this;
	}

	this.playerLayer.removeChild(sprite);
	delete this.playerLayer.hash[id];
	if(this.player === sprite) {
		delete this.player;
	}
	return this;
};

Game.fn.updatePlayer = function(data){
	var id = data.id;
	var name = data.name;
	var position = {
		x:window.parseFloat(data.x, 10),
		y:window.parseFloat(data.y, 10)
	};
	var textureId = data.texture;
	var picture = data.picture;
	var userType = data.userType || "guest";
	var datatype = data.datatype || "object";
	var angle = window.parseFloat(data.angle, 10);
	var layer = this.playerLayer, filterVal=[], sprite;
	var i, length;
	var ballSize = 42;
	if(data.delflag) {
		this.removePlayer(id);
		return null;
	}

	sprite = (function(){
		var sprite, mask, container;
		if(layer.hash[id]) {
			return layer.hash[id];
		}
		container = new PIXI.DisplayObjectContainer();
		if(userType === "guest") {
			sprite = new PIXI.Sprite.fromFrame(textureId);
			sprite.width=ballSize;sprite.height=ballSize;
		} else {
			try {
				//スプライト作成
				sprite = new PIXI.Sprite.fromImage(picture);
				//sprite.width=ballSize;sprite.height=ballSize;

				//マスク作成
				mask = new PIXI.Graphics();
				mask.beginFill();
				mask.drawCircle(0,0,ballSize/2);
				mask.color = 0x000000;
				mask.endFill();
				sprite.mask = mask;
				container.addChild(mask);
			} catch (e){
				sprite = new PIXI.Sprite.fromFrame(textureId);
				sprite.width=ballSize;sprite.height=ballSize;
			}
		}
		//スプライトのアンカーの位置を修正
		sprite.anchor.set(0.5,0.5);
		//スプライトをコンテナに登録
		container.addChild(sprite);
		//付加情報をコンテナにつける
		container.name = name;
		container.id = id;
		container.img = picture;
		//レイヤーにコンテナ登録
		layer.addChild(container);
		layer.hash[id] = container;
		//スプライト、コンテナのサイズ調整
		container.width=ballSize;container.height=ballSize;
		return container;
	}());

	//スプライト情報を更新
	sprite.position.set(position.x,position.y);
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
		return this;
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
	return sprite;

};

//アニメーション・描画

//全体をリスケール
Game.fn.rescale = function(){
	var windowWidth = $(".game-display").width();
	var windowHeight = $(".game-display").height();
	var worldWidth = this.worldSize.width;
	var worldHeight = this.worldSize.height;
	var size={x:1,y:1},scale={x:1,y:1};
	var scaleRate = 1.0;

	if(windowWidth/worldWidth < windowHeight/worldHeight) {
		size.x = windowWidth * scaleRate;
		size.y = size.x / worldWidth * worldHeight;
	} else {
		size.y = windowHeight * scaleRate;
		size.x = size.y / worldHeight * worldWidth;
	}
	scale.x = size.x/this.worldSize.width;
	scale.y = size.y/this.worldSize.height;

	//ウインドウサイズリサイズ
	this.renderer.resize(size.x, size.y);
	//this.$el.width(size.x).height(size.y);
	//スケール変換
	this.playerLayer.scale.set(scale.x, scale.y);
	this.fieldLayer.scale.set(scale.x, scale.y);
	this.objectLayer.scale.set(scale.x, scale.y);
	this.menuLayer.scale.set(scale.x, scale.y);
};

Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	//this.rescale();

	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate(that);
	});
};

//ゲームクリア時の処理

Game.fn.congratulation = function(rankData){
	var hash = this.playerLayer.hash;
	var winner = hash[rankData.win_id];
	var topRanker = [];
	var myRankData = {};
	var i, length, data;
	var goalAlert, rankingAlert, myRankAlert, messageAlert;
	var deferred = $.Deferred(), that = this;

	for(i=0, length=rankData.data.length;i<length;i++) {
		data=rankData.data[i];
		if(topRanker.length < 3) {
			topRanker.push({
				rank: i+1,
				data: data,
				sprite: hash[data.id]
			});
		}
		if(this.player.id === data.id) {
			myRankData = {
				rank: i+1,
				data: data,
				sprite: this.player
			}
		}
		if(topRanker.length >= 3 && myRankData.rank) {
			break;
		}
	}

	goalAlert = this.alert.createGoalAlert(winner);
	rankingAlert = this.alert.createRankingAlert(topRanker);
	myRankAlert = this.alert.createYourRankAlert(myRankData);
	messageAlert = this.alert.createMessageAlert();

	deferred.then(function(){
		return that.alert.animate(goalAlert);
	}).then(function(){
		return that.alert.animate(rankingAlert);
	}).then(function(){
		return that.alert.animate(myRankAlert);
	}).then(function(){
		return that.alert.animate(messageAlert);
	});

	deferred.resolve();

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
