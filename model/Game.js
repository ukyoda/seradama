var util = require('util');
var Emitter = require('events').EventEmitter;

// Box2D関連
var engine = require('./functions/gameEngine');
var net = require('./functions/gameInterface');
var tools = require('./functions/tools');

// ゲームに必要なクラス関連
var Models = require('./GameObjects');
var Stage = require('./Stage');

//Game.js構築

var Game = function(){
  EventEmitter.call(this);  //イベント処理
  this.initialize(arguments);
};

//EventEmitterの機能をprototype継承
util.inherits(Game, EventEmitter);

//機能実装／共通固定値追加
Game.fn = Game.prototype;

// ============================================
// 共通プロパティ
// ============================================

// イベントラベル
Game.ev = require('./game/EVENT_LABELS');

// グラコロ関連のオブジェクト
Game._iterations = 10;
Game._invFps = 1/15;
Game._intervalTime = Game._invFps * 1000;


// ============================================
// 各種機能
// ============================================

// クライアントに送信するオブジェクトデータ作成
Game.fn.getMessageObject = require('./game/getMessageObject');
// プレイヤー追加
Game.fn.addPlayer = require('./game/addPlayer');
// プレイヤーの状態を更新する
Game.fn.playerUpdate = require('./game/playerUpdate');
// プレイヤーを削除する
Game.fn.removePlayer = require('./game/removePlayer');
// 次のステージに進める
Game.fn.nextStage = require('./game/nextStage');
// ループ
Game.fn._loop = require('./game/_loop');

// ゲーム初期化処理 ※コンストラクタで呼び出す
Game.fn.initialize = function(){
  var that = this;
  //プレイヤー管理
  this.players = {};
  this.playersCount = 0;
  //Box2d
  this.world = engine.createWorld(0.0, 0.0, true);
  this.funnyWorld = engine.createWorld(0.0, -20.0, true);
  this.funnyWorldIsAlive = false;
  this.stage = new Stage(this.world);

  //ステージを初期化
  this.stage.nextStage();
  //ループ
  this.interval = setInterval(function(){
    that._loop.apply(that, arguments);
  }, Game._intervalTime);
};
