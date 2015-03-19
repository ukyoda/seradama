
/**
 * ステージの障害物を削除する
 * @return 削除フラグを立てたデータ
 */
module.exports = function() {
  var kabes = this.kabes || {};
  var goals = this.goals || {};
  var movableKabes = this.movableKabes || {};
  var id;
  var deleteData = [];
  for( id in kabes ) {
    deleteData.push(funcs.net.makeSendDeleteData(kabes[id].get(), 'object'));
    this.world.DestroyBody(kabes[id].get());
  }
  for( id in goals ) {
    deleteData.push(funcs.net.makeSendDeleteData(goals[id].get(), 'object'));
    this.world.DestroyBody(goals[id].get());
  }
  for( id in movableKabes) {
    deleteData.push(funcs.net.makeSendDeleteData(movableKabes[id].get(), 'object'));
    this.world.DestroyBody(movableKabes[id].get());
  }

  //オブジェクトを初期化
  this.kabes = {};
  this.goals = {};
  this.movableKabes = {};
  this.initPoint = {x: 0, y: 0};  //初期値
  this.stageName = "stage"; //初期値

  return deleteData;
};