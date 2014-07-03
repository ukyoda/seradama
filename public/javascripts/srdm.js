(function(namespace){
var name = "srdm";

//utilクラス
var util = {};
namespace.util = util;


util.getSprite = function(name) {
	if(PIXI.TextureCache[name]) {
		return new PIXI.Sprite.fromFrame(name);
	} else {
		return new PIXI.Sprite.fromImage(name);
	}
};


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
GameAlert.fn.setRankimg = function(rank) {
	if(rank == 1) {
		return 'gold';
	} else if (rank == 2) {
		return 'silver';
	} else if (rank == 3) {
		return 'blonze';
	} else {
		return '';
	}
};


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
		$('<div/>').addClass('grid rank').addClass(GameAlert.fn.setRankimg(rank)).text(rank).appendTo($li);
		createImgView(name, img).appendTo($li);
		$('<div/>').addClass('grid-right count').text(count).appendTo($li);
		$ul.append($li);
	});

	return $layout;

};

GameAlert.fn.createYourRankAlert = function(rankData, topCount){
	var $layout = this.createLayout();
	var $content = $layout.find('.content');
	var name = rankData.sprite.name || rankData.sprite.id;
	var img = rankData.sprite.img || "http://127.0.0.1/images/favicon.ico";
	var rank = rankData.rank;
	var count = rankData.data.win;
	var countTopDiff = count - topCount;

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
	$('<div/>').addClass('grid rank').addClass(this.setRankimg(rank)).text(rank).appendTo($li);
	createImgView(name, img).appendTo($li);
	$('<div/>').addClass('grid-right count').text(count +" (" + countTopDiff + ")").appendTo($li);
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
//プレイヤーオブジェクト


/**
 * プレイヤーオブジェクト（DisplayObjectContainerを継承する）
 * @return {[type]} [description]
 */
var Player = (function(){
	var key;
	var Parent = PIXI.DisplayObjectContainer;

	//コンストラクタ
	var Player = function(data){
		this._Parent = Parent;
		//コンストラクタ継承
		Parent.apply(this);

		this.ballSize = 42;
		this.name = data.name;
		this.id = data.id;
		this.img = data.picture;

		this.data = {
			mask: null,
			sprite: null,
			crown: null
		};
		//スプライト作成
		this._createSprite(data);
	};


	Player.fn = Player.prototype;
	//DisplayObjectContainerのプロトタイプを継承
	for(key in Parent.prototype) {
		Player.fn[key] = Parent.prototype[key];
	}

	return Player;

}());

Player.fn._createTwitter = function(data){
	var sprite, mask;
	try {
		sprite = util.getSprite(data.picture);
		mask = this._createMask();
		sprite.mask = mask;
		this.addChild(sprite);
		this.addChild(mask);
		this.data.mask = mask;
		this.data.sprite = sprite;
		sprite.anchor.set(0.5, 0.5);
	} catch(e) {
		this._createGuest(data);
	}
};

Player.fn._createGuest = function(data){
	var sprite = util.getSprite(data.texture);
	sprite.width = this.ballSize;
	sprite.height = this.ballSize;
	sprite.position.set(0,0);
	sprite.anchor.set(0.5, 0.5);
	this.addChild(sprite);
	this.data.sprite = sprite;

};

Player.fn._createMask = function(data){
	var mask = new PIXI.Graphics();
	mask.position.set(0,0);
	mask.beginFill();
	mask.drawCircle(0,0,this.ballSize/2);
	mask.color = 0xffffff;
	mask.endFill();
	return mask;
};
Player.fn._createSprite = function(data){
	switch(data.userType) {
	case 'guest':
		this._createGuest(data);
		break;
	default:
		this._createTwitter(data);
		break;
	}
};

Player.fn.setCrown = function(texture){
	var crown = util.getSprite(texture);
	crown.position.set(0, -this.ballSize);
	crown.anchor.set(0.5, 0.5);
	this.data.crown = crown;
	this.addChild(crown);
};

Player.fn.removeCrown = function(){
	var crown = this.data.crown;
	if(crown) {
		this.removeChild(crown);
		this.data.crown = undefined;
	}
};

Player.fn.updateCrown = function(rank){
	rank = window.parseInt(rank, 10);
	this.removeCrown();
	if(rank === 1) {
		this.setCrown('/texture/icons/gold.png');
	} else if(rank === 2) {
		this.setCrown('/texture/icons/silver.png');
	} else if(rank === 3) {
		this.setCrown('/texture/icons/blonze.png');
	}
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
	this.textureURLs = manifest.textureURLs || ["texture/field1.json", "texture/kabe.json", "texture/player.json", "texture/message.json"];
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
	this.timeInfo = {
		current: "",
		best: "",
		bestPlayer: "",
		fps: 0,
		nowDisplay:0
	};

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
	this._controller = null;

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
Game.dialog = (function(){
	var dialog = {};
	var setModal = function(){
		var $div = $('<div/>');
		$div.addClass('gracoro modal-overlay');
		$("body").append($div);
	};
	dialog.show = function(target){
		$(target).addClass('show');
	};

	dialog.hide = function(target){
		$('.gracoro.modal-overlay').remove();
		$(target).removeClass('show');
	};

	return function(target, key, modalFlg){
		if(modalFlg) {
			setModal();
		}
		if(typeof key === "string" && dialog[key]) {
			dialog[key](target);
		}
	};

}());

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
	var sprite = util.getSprite(this.backgroundURL);
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

	this._socket.on('message', function(){
		that.onMessage.apply(that, arguments);
	});

	this._socket.on('disconnect', function(){
		that.onDisconnected.apply(that, arguments);
	});

	return deferred;

};
/**
 * サーバからデータを取得したとき
 */
Game.fn.onMessage = function(data) {
	if(!data){return;}
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
			that.timeInfo.current = val.time;
			break;
		case "bestTime":
			that.timeInfo.best = val.time;
			that.timeInfo.bestPlayer = val.userName || "-";
			break;
		case "restrict":
		window.console.log('test');
			that.onRestrict();
		}
	});

};


Game.fn.onDisconnected = function(){
	window.alert("セッションが切れました。ログアウトします");
	window.location.href="/logout/twitter";
};

Game.fn.onRestrict = function(){
	var that = this;
	Game.dialog('#modal-restrict', "show", true);
	window.setTimeout(function(){
		that._socket.disconnect();
		window.location.href='/logout/twitter';
	},30*1000);
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
	if(!this._controller) {
		return;
	}
	this.emit({
		gravity: this._controller.val
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

Game.fn.setController = function(type,arg) {
	switch(type) {
	case "touch":
		this._controller = new TouchController(arg);
		break;
	case "gravity":
		this._controller = new GravityController(arg);
		break;
	}
};
//タッチコントローラ



var TouchController = function Controller (target){
	this.$el = $(target);
	this.el = this.$el.get(0);
	this.renderer = new PIXI.autoDetectRenderer(this.$el.width(), this.$el.height());
	this.stage = new PIXI.Stage(0xdddddd);
	this.$el.html(this.renderer.view);
	this.$canvas = this.$el.find('canvas');;
	this.$canvas.width(this.$el.width()).height(this.$el.height());
	this.touchFlg = false;
	this.marker = new PIXI.Graphics();
	//マーカー設定
	this.marker.beginFill();
	this.marker.drawCircle(0,0,10);
	this.marker.color = 0x111111;
	this.marker.endFill();
	this.stage.addChild(this.marker);

	//canvasサイズ
	this.size = {
		x: this.$canvas.width(),
		y: this.$canvas.height()
	};
	//原点座標
	this.origin = {
		x: this.$canvas.width()/2,
		y: this.$canvas.height()/2
	};
	//originからのレンジ
	this.range = {
		cx: [-this.origin.x, this.origin.x],
		cy: [-this.origin.y, this.origin.y],
		vx: [-5, 5],	//固定
		vy: [5, -5],	//固定
		scale: function(axis){
			var cx = this.cx, cy = this.cy;
			var vx = this.vx, vy = this.vy;
			if(axis==='x') {
				return (cx[1]-cx[0])/(vx[1]-vx[0]);
			} else {
				return (cy[1]-cy[0])/(vy[1]-vy[0]);
			}
		}
	};
	//canvasオフセット
	this.offset = {
		x: this.origin.x,
		y: this.origin.y,
		_size: this.size,
		set: function(x, y){
			this.x = this._size.x < x ? this._size.x:x;
			this.x = this.x < 0 ? 0:this.x;
			this.y = this._size.y < y ? this._size.y:y;
			this.y = this.y < 0 ? 0:this.y;
			return this;
		}
	};
	this.val = {
		x: 0,
		y: 0,
		set: function(x,y){
			this.x = x;
			this.y = y;
			return this;
		}
	};
	this.setEvent();

	this.animate();

};
TouchController.fn = TouchController.prototype;

namespace.TouchController = TouchController;


TouchController.fn.onTouchStart = function(e){
	e.preventDefault();
	this.touchFlg = true;
};
TouchController.fn.onTouchEnd = function(e) {
	e.preventDefault();
	this.touchFlg = false;
	this.clear();
};
TouchController.fn.onTouch = function(e) {
	if(!this.touchFlg){return;}
	e.preventDefault();
	//座標計算
	var bound = this.$canvas.get(0).getBoundingClientRect();
	var changedTouches = e.originalEvent.changedTouches;
	var client = !changedTouches?e.originalEvent:changedTouches[0];
	//座標取得
	var x = client.clientX - bound.left, y = client.clientY - bound.top;
	//座標登録
	this.offset.set(x, y);
	//サーバーに渡す値を取得
	var cx = this.offset.x-this.origin.x, cy = this.offset.y-this.origin.y;
	this.val.set(cx/this.range.scale('x'), cy/this.range.scale('y'));

};

TouchController.fn.setEvent = function(){
	var that = this;
	this.$canvas.on('touchstart', $.proxy(this.onTouchStart, this));
	this.$canvas.on('touchend', $.proxy(this.onTouchEnd, this));
	this.$canvas.on('touchmove', $.proxy(this.onTouch, this));

	//PC対応
	this.$canvas.on('mousedown', function(){
		that.onTouchStart.apply(that, arguments);
		var args = arguments;
		//マウスアップイベントを一度だけ実行する
		$(window).one('mouseup', function(){
			that.onTouchEnd.apply(that, arguments);
		});
	});
	$(window).on('mousemove', $.proxy(this.onTouch,this));
};

TouchController.fn.clear=function(){
	this.val.set(0,0);
	this.offset.set(this.origin.x, this.origin.y);
};


TouchController.fn.display = function(){
	var offset = this.offset;
	var size = this.size;
	var radius = this.marker.radius;
	var color = this.marker.color;
	this.marker.position.set(offset.x, offset.y);

};

TouchController.fn.animate = function() {

	var that = this;
	this.display();
	this.renderer.render(this.stage);

	window.requestAnimFrame(function(){
		that.animate();
	});


};
//加速度コントローラ


GravityController = function Controller(direction){
	this.val = {
		x: 0,
		y: 0,
		set: function(x,y){
			this.x = x;
			this.y = y;
			return this;
		}
	};
	this.direction = direction;
	this.setEvent();
};

GravityController.fn = GravityController.prototype;


GravityController.fn.setEvent = function(){
	var that = this;
	$(window).on('devicemotion', function(e) {
		var x = event.accelerationIncludingGravity.x || 0;
		var y = event.accelerationIncludingGravity.y || 0;
		that.val.set(x * that.direction, y * that.direction);
	});
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
	var layer = this.playerLayer;
	var player = null;

	if(data.delflag) {
		this.removePlayer(data.id);
		return null;
	}

	if(layer.hash[data.id]) {
		player = layer.hash[data.id];
	} else {
		player = new Player(data);
		layer.addChild(player);
	}
	layer.hash[data.id] = player;

	player.data.sprite.rotation = window.parseFloat(data.angle, 10);
	player.position.set(
		window.parseFloat(data.x, 10),
		window.parseFloat(data.y, 10)
	);

	//自ボールの場合，プロパティに参照を追加
	if(data.datatype === "you") {
		this.player = player;
	}
	return player;

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
		sprite = util.getSprite(textureId);
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
	$('#current-time .timescore').text(this.timeInfo.current);
	if(this.timeInfo.nowDisplay) {
		$('#best-time .timescore').text(this.timeInfo.best);
	} else {
		$('#best-time .timescore').text(this.timeInfo.bestPlayer);
	}
	if(this.timeInfo.fps > 180) {
		this.timeInfo.nowDisplay = !this.timeInfo.nowDisplay;
		this.timeInfo.fps = 0;
	} else {
		this.timeInfo.fps++;
	}

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
			};
		}
		//王冠情報更新
		hash[data.id].updateCrown(i+1);
		//if(topRanker.length >= 3 && myRankData.rank) {
		//	break;
		//}
	}

	goalAlert = this.alert.createGoalAlert(winner);
	rankingAlert = this.alert.createRankingAlert(topRanker);
	myRankAlert = this.alert.createYourRankAlert(myRankData, topRanker[0].data.win);
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
