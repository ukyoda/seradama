var funcs = require('./../model/GameFunctions');
var Stage = require('./../model/Stage');

//console.log(Stage);
//console.log(funcs);

//ダミーのワールド作成

var world = funcs.engine.createWorld(0,0,true);

// ステージ作成してみる
var stage = new Stage(world);

stage.nextStage();

// ステージができているか確認
//console.log(stage.kabes);

// ステージを進める
console.log(stage.stageIndex, stage.stageName);
stage.nextStage();
console.log(stage.stageIndex, stage.stageName);