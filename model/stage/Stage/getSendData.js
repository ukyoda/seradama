var _ = require('underscore');
var funcs = require('../../GameFunctions');

/**
 * ステージ情報を全て送信する
 * @return {object} 送信するデータセット
 */
module.exports = function() {
  var kabes = this.kabes || {};
  var goals = this.goals || {};
  var movableKabes = this.movableKabes || {};
  var players = this.players || {};
  var id;
  var result = [];
  var callback1 = function(memo, value, key) {
    if(!value) {
      return memo;
    }
    memo.push(funcs.net.makeSendData(value.get(), 'object'));
    return memo;
  };
  var callback2 = function(memo, value, key) {
    if(!value) {
      return memo;
    }
    memo.push(funcs.net.makeSendData(value.get(), 'object'));
    return memo;
  };

  result = _.reduce(goals, callback1, result);
  result = _.reduce(kabes, callback1, result);
  result = _.reduce(movableKabes, callback1, result);
  result = _.reduce(players, callback2, result);

  return result;
};