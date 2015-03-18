var _ = require('underscore');
var MessageDot = require('../GameObjects').MessageDot;
var stageInfo = require('../../message/time_up.json');

/**
 * タイムアウト表示用のステージ
 */
var TimeoutStage = function(world){
  this.startTime;
  this.world = world;
  this.dots = {};
  this.stageName = 'TimeoutStage';
};

TimeoutStage.fn = TimeoutStage.prototype;

/**
 * ステージを作成する(メッセージを表示する)
 */
TimeoutStage.fn.nextStage = function() {
  var i;
  var id, dataType;
  this.destroyStage();
  for(i in StageInfo) {
    stageObj = stageInfo[i];
    id = stageObj.id;
    dataType = stageObj.datatype;
    this.dots[id] = new MessageDot(id, stageObj, this.world);
  }
  this.startTime = new Date();
};

/**
 * ステージから障害物を削除する
 * @return {[type]}
 */
TimeoutStage.fn.destroyStage = function(){
  var dots = this.dots || {};
  for(id in dots) {
    this.world.DestroyBody(dots[id].data);
  }
  this.dots = {};
};

/**
 * ステージを更新する(時間を進める)
 */
TimeoutStage.fn.update = function(invFps, iterations) {
  this.world.Step(invFps, iterations);
};

/**
 * クライアントに送るデータを作成
 */

module.exports = TimeoutStage;