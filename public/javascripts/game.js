
if(!srdm) {
	var srdm = {};
}

srdm.game = (function(){
	var $ = jQuery;
	var gameData = "game/gamedata.json";
	var socketURL = "//";
	var textureDataSets = [
		"texture/field1.json",
		"texture/player.json"
	];

	//ゲームオブジェクト
	var Game = function Game(target){
		var width = $(target).width();
		var height = $(target).height();

		this.$el = $(target);
		this.el = this.$el.get(0);
		this.stage = new PIXI.Stage('black');
		this.renderer = new PIXI.autoDetectRenderer(width, height);
		this.$el.append(this.renderer.view);
		this.player1 = null;	//自プレイヤーを記憶
		this.players = {};
		this.socket = null;
		this.rotationRate = {};
	};
	Game.fn = Game.prototype;

	Game.fn.loadTexture = function(){
		var that = this;
		var deferred = $.Deferred();
		var loader = new PIXI.AssetLoader(textureDataSets);

		loader.onComplete = function(){
			that.onCompleteTexture();
			deferred.resolve();
		};
		loader.load();
		return deferred;
	};
	Game.fn.onCompleteTexture = function(){};

	Game.fn.loadGameData = function(){
		var that = this;
		var ajaxObj = $.ajax({
			url:gameData
		}).done(function(data){
			that.onCompleteGameData(data);
		});
		return ajaxObj;
	};
	Game.fn.onCompleteGameData = function(){};

	Game.fn.connect = function(socket){
		var deferred = $.Deferred();
		var that = this;

		this.socket = io.connect(socketURL);
		//とりあえずユーザをセット
		this.socket.on("connect",function(){
			var id = that.socket.socket.sessionid;
			var player1 = that.createPlayer(id, {x: 32, y: 32}, 1);
			console.log(player1);
			that.setPlayer1(player1);
			deferred.resolve();
		});
		this.socket.on('message', function(data){
			that.onMessage.call(that,data);
		});
		return deferred;
	};

	Game.fn.onController = function(){
		var filter = function(now, prev) {
			var data = {};
			data.alpha = 0.1*now.alpha + 0.9*prev.alpha;
			data.beta = 0.1*now.beta + 0.9*prev.beta;
			data.gamma = 0.1*now.gamma + 0.9*prev.gamma;
			data.alpha = Math.floor(data.alpha);
			data.beta = Math.floor(data.beta);
			data.gamma = Math.floor(data.gamma);
			return data;
		};

		var prev = this.rotationRate;
		var that = this;

		window.addEventListener('devicemotion',function(event){
			var rotationRate = event.rotationRate;
			rotationRate.alpha = rotationRate.alpha || 0;
			rotationRate.beta = rotationRate.beta || 0;
			rotationRate.gamma = rotationRate.gamma || 0;
			//データがあればフィルタ適用

			if(that.rotationRate.alpha) {
				rotationRate = filter(rotationRate, that.rotationRate);
			}
			if(rotationRate.alpha && rotationRate.beta && rotationRate.gamma) {
				that.onEmit.call(that, {
					alpha: rotationRate.alpha - (that.rotationRate.alpha || rotationRate.alpha),
					beta: rotationRate.beta - (that.rotationRate.beta || rotationRate.beta),
					gamma: rotationRate.gamma - (that.rotationRate.gamma || rotationRate.gamma)
				});
			}
			that.rotationRate = rotationRate;

		});
	};

	Game.fn.onEmit = function(data) {
		console.log(data);
		this.socket.emit('message', {
			data: data
		});
	};

	Game.fn.onMessage = function(data) {

	};

	//プレイヤーを追加する
	Game.fn.addPlayers = function(player){
		this.stage.addChild(player);
		this.players[player.id] = player;
		return this;
	};

	//プレイヤー1をセットする
	Game.fn.setPlayer1 = function(player) {
		this.stage.addChild(player);
		this.player1 = player;
		this.players[player.id] = player;
		return this;
	};

	//プレイヤーを取り除く
	Game.fn.removePlayer = function(id) {
		this.stage.removeChild(this.players[id]);
		this.players[id] = undefined;	//参照を削除する
		if(this.player1.id === id) {	//削除するユーザが自分ならplayer1の参照を削除
			this.player1 = undefined;	//参照を削除する
		}
		return this;
	};

	//フィールドのチップを作成
	Game.fn.createFieldChip = function(name) {
		return PIXI.Sprite.fromFrame(name);
	};

	//プレイヤーオブジェクトを作成する
	Game.fn.createPlayer = function(id, position, type){
		//既に存在しているプレイヤーならそのオブジェクトを出力
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
		return sprite;
	};

	//指定したスプライトを動かす
	Game.fn.movePlayer = function(id, position){
		if(this.players[id]){
			this.players[id].position.x = position.x;
			this.players[id].position.y = position.y;
		}
		return this;
	};

	Game.fn.animate = function() {
		var that = this;
		this.renderer.render(this.stage);
		window.requestAnimFrame(function(){
			that.animate.call(that);
		});
	};

	//ゲームを開始する
	Game.fn.start = function(){
		var that = this;
		return that.loadTexture().then(function(){
			return that.loadGameData();
		});
	};

	return function(target){
		return new Game(target);
	};

}());