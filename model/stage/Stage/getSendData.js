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

  //壁追加
  result = _.reduce(goals, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);

  result = _.reduce(kabes, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);

  result = _.reduce(movableKabes, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);

  result = _.reduce(players, function(memo, data, id) {
    result.push(funcs.net.makeSendData(data.data, 'object'));
    return result;
  }, result, this);

  return result;
};