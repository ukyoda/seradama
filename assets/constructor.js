
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
	this.textureURLs = manifest.textureURLs || ["texture/field1.json", "texture/kabe.json", "texture/player.json", "texture/message.json", "texture/fruits-lime.json", "texture/fruits-orange.json", "texture/fruits-pink.json", "texture/fruits-skyblue.json", "texture/miki.json"];
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
