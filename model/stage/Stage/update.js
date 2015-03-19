

/**
 * ステージを更新する(時間を進める)
 * @param {number} invFps FPS値の逆数
 * @param {number} iterations iterateの回数?
 * @return {array} 動く障害物の更新情報(差分で送信)
 */
module.exports = function(invFps, iterations){
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