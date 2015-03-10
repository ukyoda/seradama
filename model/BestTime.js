var Model = require('./base/Model');

//ベストタイム用のjsonがなければ新規作成
var fs = require('fs');
var bestTimeFilePath = './../best_time.json';

var BestTime = Model.extend({
  /**
   * 初期化
   * @return {[type]}
   */
  initialize: function(){
    if(fs.existsSync(bestTimeFilePath)) {
      console.log("ベストタイムセット");
      this.set(require(bestTimeFilePath));
    }
  },
  /**
   * ベストタイム更新
   * @param  {string} stageNo ステージNO
   * @param  {number} time 時間
   * @param  {string} userName
   * @param  {string} userType guest or not guest
   * @return {boolean} 更新したらtrue
   */
  update: function(stageNo, time, userName, userType) {
    var newData = {
      time: time,
      userName: userName,
      userType: userType
    };
    var currentBestTime = this.get(stageNo);
    if(newData.time >= currentBestTime.time) {
      this.set(newData);
      //JSONとしてファイルに保存
      this.save();
      return true;
    } else {
      return false;
    }
  },

  save: function() {  //ファイルを保存する
    var jsonStr = JSON.stringify(this.data, null, '  ');
    fs.writeFile(bestTimeFilePath, jsonStr);
  }

});

module.exports = new BestTime();