/**
 * ステージ情報管理オブジェクト
 * + ./../stage から読み込む
 * + 読み込み処理が非同期のため、注意
 */

var fs = require('fs');
var Models = require('../GameObjects');
var funcs = require('../GameFunctions');
var BestTime = require('../BestTime');
var _ = require('underscore');

var STAGE_DIR=__dirname+"/../../stage";
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
 * @return {array} 更新データ ※初回なので全データセットを送る
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
  var sendData = this.destroyStage();

  for(i in stageInfo) {
    stageObj = stageInfo[i];
    id = stageObj.id;
    dataType = stageObj.datatype;
    switch(dataType) {
      case 'goal':
        // ゴール配置
        this.goals[id] = new Models.Goal(id, stageObj, this.world);
        sendData.push(funcs.net.makeSendData(this.goals[id].get(), 'object'));
        break;
      case 'kabe':
        // 障害物追加
        this.kabes[id] = new Models.Kabe(id, stageObj, this.world);
        sendData.push(funcs.net.makeSendData(this.kabes[id].get(), 'object'));
        break;
      case 'maru':
        // 丸い障害物追加
        this.kabes[id] = new Models.Maru(id, stageObj, this.world);
        sendData.push(funcs.net.makeSendData(this.kabes[id].get(), 'object'));
        break;
      case 'movable':
        this.movableKabes[id] = new Models.Movable(id, stageObj, this.world);
        sendData.push(funcs.net.makeSendData(this.movableKabes[id].get(), 'object'));
        break;
      case 'movableMaru':
        this.movableKabes[id] = new Models.MovableMaru(id, stageObj, this.world);
        sendData.push(funcs.net.makeSendData(this.movableKabes[id].get(), 'object'));
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
  return sendData;
};

/**
 * ステージの障害物を削除する
 * @return 削除フラグを立てたデータ
 */
Stage.fn.destroyStage = function() {
  var kabes = this.kabes || {};
  var goals = this.goals || {};
  var movableKabes = this.movableKabes || {};
  var id;
  var deleteData = [];
  for( id in kabes ) {
    deleteData.push(funcs.net.makeSendDeleteData(kabes[id].get(), 'object'));
    this.world.DestroyBody(kabes[id].get());
  }
  for( id in goals ) {
    deleteData.push(funcs.net.makeSendDeleteData(goals[id].get(), 'object'));
    this.world.DestroyBody(goals[id].get());
  }
  for( id in movableKabes) {
    deleteData.push(funcs.net.makeSendDeleteData(movableKabes[id].get(), 'object'));
    this.world.DestroyBody(movableKabes[id].get());
  }

  //オブジェクトを初期化
  this.kabes = {};
  this.goals = {};
  this.movableKabes = {};
  this.initPoint = {x: 0, y: 0};  //初期値
  this.stageName = "stage"; //初期値

  return deleteData;
};

/**
 * ステージを更新する(時間を進める)
 * @param {number} invFps FPS値の逆数
 * @param {number} iterations iterateの回数?
 * @return {array} 動く障害物の更新情報(差分で送信)
 */
Stage.fn.update = function(invFps, iterations){
  this.world.Step(invFps, iterations);
  var net = funcs.net;
  var result = [];
  //壁追加
  var result = _.reduce(this.kabes, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);
  var result = _.reduce(this.kabes, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);
  var result = _.reduce(this.kabes, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);
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

/**
 * ベストタイムを取得する
 * @return {object} ベストタイムの情報
 */
Stage.fn.getBestTimeData = function() {
  return this.bestTime.get(this.stageName);
};

module.exports = Stage;
