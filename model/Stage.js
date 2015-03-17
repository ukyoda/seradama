/**
 * ステージ情報管理オブジェクト
 * + ./../stage から読み込む
 * + 読み込み処理が非同期のため、注意
 */

var fs = require('fs');
var Models = require('./GameObjects');
var funcs = require('./GameFunctions');
var BestTime = require('./BestTime');
var _ = require('underscore');

var STAGE_DIR=__dirname+"/../stage";
var files = fs.readdirSync(STAGE_DIR);
var stages = [];
files.forEach(function(fileName){
  var stage = require(STAGE_DIR+'/'+fileName);
  stages.push(stage);
});
//filesは必要ないので削除する
files = null;

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

/**
 * 次のステージにする
 */
Stage.fn.nextStage = function() {
  var i;
  var stageInfo, stageObj, id, dataType;
  //次のステージにする
  if( (++this.stageIndex) > stages.length - 1) {
    this.stageIndex = 0;
  }
  stageInfo = stages[this.stageIndex];
  //ステージ初期化
  this.destroyStage();

  for(i in stageInfo) {
    stageObj = stageInfo[i];
    id = stageObj.id;
    dataType = stageObj.datatype;
    switch(dataType) {
      case 'goal':
        // ゴール配置
        this.goals[id] = new Models.Goal(id, stageObj, this.world);
        break;
      case 'kabe':
        // 障害物追加
        this.kabes[id] = new Models.Kabe(id, stageObj, this.world);
        break;
      case 'maru':
        // 丸い障害物追加
        this.kabes[id] = new Models.Maru(id, stageObj, this.world);
        break;
      case 'movable':
        this.movableKabes[id] = new Models.Movable(id, stageObj, this.world);
        break;
      case 'movableMaru':
        this.movableKabes[id] = new Models.MovableMaru(id, stageObj, this.world);
        break;
      case 'initPoint':
        // ボール初期位置設定
        this.initPoint = {x:stageObj.x, y:stageObj.y};
        break;
      case 'stageName':
        // すてーじねーむ
        this.stageName = stageObj.name;
        break;
      default:
        break;
    }
  }

  //時間を初期化
  this.startTime = new Date();
};

/**
 * ステージの障害物を削除する
 */
Stage.fn.destroyStage = function() {
  var kabes = this.kabes || {};
  var goals = this.goals || {};
  var id;
  for( id in kabes ) {
    this.world.DestroyBody(kabes[id].data);
  }
  for( id in goals ) {
    this.world.DestroyBody(goals[id].data);
  }

  //オブジェクトを初期化
  this.kabes = {};
  this.goals = {};
  this.initPoint = {x: 0, y: 0};  //初期値
  this.stageName = "stage"; //初期値

};

/**
 * クライアントに送るデータを作成
 */
Stage.fn.getSendData = function() {
  var net = funcs.net;
  var result = {};
  //_.each(this.kabes, function(data){
  //});
};

/**
 * 時間を秒単位で進める
 * @return {[type]}
 */
Stage.fn.getTime = function() {
  var currentDate = new Date();
  var sub = currentDate.getTime() - this.startTime.getTime();
  return sub / 1000;
};

Stage.fn.getBestTimeData = function() {
  return this.bestTime.get(this.stageName);
};

module.exports = Stage;
