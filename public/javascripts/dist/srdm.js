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
	this.textureURLs = manifest.textureURLs || ["texture/field1.json", "texture/player.json"];
	this.gameInfoURL = manifest.gameInfoURL || "game/gamedata.json";
	this.socketURL = manifest.socketURL || "//";
	var target = manifest.target || "body";
	var width = $(target).width();
	var height = $(target).height();
	//ターゲットのタグ
	this.$el = $(manifest.target);
	this.el = this.$el.get(0);

	//PIXI.jsのオブジェクト
	this.stage = new PIXI.Stage('black');
	this.renderer = new PIXI.autoDetectRenderer(width, height);

	//プレイヤー情報コンテナ
	this.player1 = null;
	this.players = {};	//IDをキーとしたオブジェクトで管理

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
	//
	map.forEach(function(val, index){
		var x = 32 * (index % width);
		var y = 32 * Math.floor(index / width);
		var sprite = game.createFieldChip("chip_"+val+".png");
		sprite.position.x=x;sprite.position.y=y;
		game.stage.addChild(sprite);
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
		var id = that._socket.socket.sessionid;
		var player1 = that.createPlayer(id, {x: 32, y: 32}, 1);
		that.setPlayer1(player1);
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
var flg = 0;
Game.fn.onMessage = function(data) {

	var that = this;
	data.value.forEach(function(val, index){
		var id = val.id;
		var x = window.parseFloat(val.x, 10);
		var y = window.parseFloat(val.y, 10);
		var position = {x:x, y:y};
		var angle = window.parseFloat(val.angle, 10);
		var sessId = that._socket.socket.transport.sessid;
		var playerType = sessId === id ? 1: 0;
		var player = that.players[id] || that.createPlayer(id, position, playerType);
		if(playerType === 1) {
			that.setPlayer1(player);
		} else {
			that.addPlayers(player);
		}
		that.movePlayer(id, position, angle);
	});
	//ユーザ追加判定

};


Game.fn.onDisconnected = function(){

};

/**
 * データ更新
 */
Game.fn.emit = function(position) {
	var myId = this._socket.socket.transport.sessid;
	var gravity = this._controller.gravity;
	this._socket.emit('message', {
		id: myId,
		gravity: gravity,
		position: position
	});
};

//コントローラ
//import "onController";

Game.fn.setDeviceMotion = function(gravity){
	if(typeof gravity !== "object") {
		gravity = {};
	}
	gravity.x = gravity.x || 0;
	gravity.y = gravity.y || 0;
	this._controller.gravity = gravity;
};

/**
 * コントローラで実行する処理
 */
Game.fn.onController = function(cursor){
	if(!this.player1) {return ;}
	var position = {
		x: this.player1.position.x,
		y: this.player1.position.y
	};
	var gravity = this._controller.gravity;
	var moveVal = 32/2;

	switch(cursor) {
	case Game.MOVE_UP:
		position.y -= moveVal;
		break;
	case Game.MOVE_LEFT:
		position.x -= moveVal;
		break;
	case Game.MOVE_RIGHT:
		position.x += moveVal;
		break;
	case Game.MOVE_BOTTOM:
		position.y += moveVal;
		break;
	default:
		break;
		//rturn;
	}

	this.emit(position);
};

//プレイヤー操作

/**
 * プレイヤー追加
 */
Game.fn.addPlayers = function(player) {
	//ステージに追加する
	this.stage.addChild(player);
	//プレイヤー一覧コンテナに追加する（参照用）
	this.players[player.id] = player;
	return this;
};

/**
 * 自プレイヤーを登録する
 */
Game.fn.setPlayer1 = function(player) {
	this.stage.addChild(player);
	this.player1 = player;
	this.players[player.id] = player;
	return this;
};

Game.fn.removePlayer = function(id) {
	this.stage.removeChild(this.players[id]);
	this.players[id] = undefined;
	if(this.player1.id === id) {
		this.player1 = undefined;
	}
	return this;
};

Game.fn.movePlayer = function(id, position, angle) {
	if(this.players[id]) {
		this.players[id].position.x = position.x;
		this.players[id].position.y = position.y;
		this.players[id].rotation = angle;
	}
	return this;
};

//スプライト作成

Game.fn.createFieldChip = function(name) {
	return PIXI.Sprite.fromFrame(name);
};

Game.fn.createPlayer = function(id, position, type) {
	if(this.players[id]) {
		return this.players.id;
	}
	var name, sprite;
	switch(type) {
	case 1:
		name = "player_3_1.png";
		break;
	default:
		name = "player_1_1.png";
		break;
	}
	sprite = PIXI.Sprite.fromFrame(name);
	sprite.id = id;
	sprite.position.x = position.x;
	sprite.position.y = position.y;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	return sprite;
};

//アニメーション

Game.fn.animate = function(){
	var that = this;
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
