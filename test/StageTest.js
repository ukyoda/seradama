/**
 * ステージモデルテスト
 */
var async = require('async');
var stageLoader = require('./../model/Stage');

//ステージモデル読み込みテスト(非同期なのでasyncを使ってスケジューリング)
async.series([
  function(callback) {  //ステージJSON読み込み
    stageLoader(function(iterator){
      callback(null, iterator);
    });
  }
], function(err, results){
  var stage = results[0];
  var data = {};
  for(data = stage.begin();stage.hasNext();data = stage.next()) {
    console.log(data[0]);
  }
});
