
/**
 * 時間を秒単位で取得する
 * @return {[type]}
 */
module.exports = function(){
  var currentDate = new Date();
  var sub = currentDate.getTime() - this.startTime.getTime();
  return sub / 1000;
};