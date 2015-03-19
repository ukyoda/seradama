var fs = require('fs');
var Models = require('../../GameObjects');
var funcs = require('../../GameFunctions');
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

/**
 * 次のステージにする
 * @return {array} 更新データ ※初回なので全データセットを送る
 */
module.exports = function() {
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