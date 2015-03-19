/**
 * ベストタイムを取得する
 * @return {object} ベストタイムの情報
 */
module.exports = function() {
  return this.bestTime.get(this.stageName);
};
