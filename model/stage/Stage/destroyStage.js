var _ = require('underscore');
var funcs = require('../../GameFunctions');

/**
 * ステージの障害物を削除する
 * @return 削除フラグを立てたデータ
 */
module.exports = function() {
  var kabes = this.kabes || {};
  var goals = this.goals || {};
  var movableKabes = this.movableKabes || {};
  var id;
  var result = [];
  var world = this.world;
  var callback1 = function(memo, value, key) {
    if(!value) {
      return memo;
    }
    memo.push(funcs.net.makeSendDeleteData(value.get(), 'object'));
    world.DestroyBody(value.get());
    return memo;
  };
  result = _.reduce(kabes, callback1, result);
  result = _.reduce(goals, callback1, result);
  result = _.reduce(movableKabes, callback1, result);

  //オブジェクトを初期化
  this.kabes = {};
  this.goals = {};
  this.movableKabes = {};
  this.initPoint = {x: 0, y: 0};  //初期値
  this.stageName = "stage"; //初期値

  return result;
};