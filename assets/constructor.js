
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
	this.backgroundURL = manifest.backgroundURL || 'texture/background/background.jpg';
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

Game.MOVE_UP = 1;
Game.MOVE_RIGHT = 2;
Game.MOVE_BOTTOM = 3;
Game.MOVE_LEFT = 4;

Game.CODE_UP = 38;
Game.CODE_RIGHT = 39;
Game.CODE_BOTTOM = 40;
Game.CODE_LEFT = 37;