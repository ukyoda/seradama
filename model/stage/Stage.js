var util = require('util');
var Emitter = require('events').EventEmitter;
var BestTime = require('../BestTime');

//ベストタイム ※全体共通にする
var bestTime = new BestTime();

var Stage = function(world){
  this.stageIndex = -1;
  this.world = world;
  this.startTime;
  this.bestTime = bestTime;
  this.initPoint = {};
  this.stageName = 'stage';

  this.kabes = {};
  this.goals = {};
  this.movableKabes = {};
  this.players = {};

};

//EventEmitter を継承
util.inherits(Stage, Emitter);

Stage.fn = Stage.prototype;

//次のステージにする
Stage.fn.nextStage = require('./Stage/nextStage');

//ステージを削除
Stage.fn.destroyStage = require('./Stage/destroyStage');

//ステージ更新
Stage.fn.update = require('./Stage/update');

//現在の経過時間を秒単位で取得
Stage.fn.getTime = require('./Stage/getTime');

//ベストタイムを取得する
Stage.fn.getBestTimeData = require('./Stage/getBestTimeData');

//現在のステージの情報を取得する
Stage.fn.getSendData = require('./Stage/getSendData');

module.exports = Stage;
