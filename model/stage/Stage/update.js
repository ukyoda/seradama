var funcs = require('../../GameFunctions');
var _ = require('underscore');


/**
 * ステージを更新する(時間を進める)
 * @param {number} invFps FPS値の逆数
 * @param {number} iterations iterateの回数?
 * @return {array} プレイヤーの位置情報，動く障害物の更新情報(差分で送信)
 */
module.exports = function(invFps, iterations){
  this.world.Step(invFps, iterations);
  var net = funcs.net;
  var result = [];

  result = _.reduce(movableKabes, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);

  result = _.reduce(players, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);

  this.emit('update', result);
};