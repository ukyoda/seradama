/**
 * ステージ情報管理オブジェクト
 * + ./../stage から読み込む
 * + 読み込み処理が非同期のため、注意
 */

var stageInfoDirectory = './../stage';
var fs = require('fs');

/**
 * ステージ情報読み込み
 * @param  {Function} callback ロード完了後に実行するコールバック関数
 */
module.exports = function(callback) {
  //ファイルfairu読み込み
  fs.readdir(stageInfoDirectory, function(err, files){
    var stages = [];
    files.forEach(function(val, index){ //ファイルをロード
      var stage = require('./../stage/' + val);
      stages.push(stage);
    });
    var iterator = createIterator(stages);
    callback(iterator);//コールバック
  });
};


/**
 * ステージデータを管理するイテレータ作成
 * @param  {Array} stages ステージJSONファイルを読み込んだ結果配列
 * @return {Object}        イテレータオブジェクト
 */
function createIterator(stages) {
  return {
    currentStageNo: 0,  //イテレータ進めるための値
    /**
     * イテレータ開始
     * @return
     */
    begin: function(){
      currentStageNo = -1;
      return this.next();
    },
    /**
     * 次のステージ情報を取得
     * @return {Object} ステージ情報(取得できない場合はnull)
     */
    next: function(){
      if(this.hasNext()) {
        return stages[++currentStageNo];
      } else {
        return null;
      }
    },
    /**
     * 最後のステージ
     * @return 次のステージ情報があればtrue, なければfalse
     */
    hasNext: function(){
      if(currentStageNo+1 < stages.length) {
        return true;
      } else {
        return false;
      }
    }
  };
}
