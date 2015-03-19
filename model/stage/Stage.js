var BestTime = require('../BestTime');


//ステージ読み込み ※非同期なんでそれなりの対応しないと・・・
// fs.readdir(STAGE_DIR+'/stage', function(err, files){
//   stages = [];
//   for(var i in files){
//     var stage = require(STAGE_DIR + files[i]);
//     stages.push(stage);
//   }
// });

//ベストタイム ※全体共通にする
var bestTime = new BestTime();

var Stage = function(world){
  this.startTime;
  this.stageIndex = -1;
  this.bestTime = bestTime;
  this.world = world;
  this.kabes = {};
  this.goals = {};
  this.movableKabes = {};
  this.initPoint;
  this.stageName;
};

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

module.exports = Stage;
