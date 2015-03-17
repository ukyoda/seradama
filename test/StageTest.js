var funcs = require('./../model/GameFunctions');
var Stage = require('./../model/Stage');
var world = funcs.engine.createWorld(0,0,true);
var stage = new Stage(world);
var index;

console.log(process.memoryUsage());
console.log(world.DestroyBody.toString());
stage.stageIndex = 20;
//ステージを進めてもメモリリークは大丈夫そうか?
for(index=0;index<10000;index++) {
stage.nextStage();
if(index % 100 == 0) {
  stage.destroyStage();
  console.log(index,world.m_bodyCount, process.memoryUsage());
}
//console.log(stage.stageIndex, stage.stageName);
}
if(global.gc) {
  global.gc();
}
console.log(process.memoryUsage());

//時間のテスト
setTimeout(function(){
  console.log(stage.getTime());
}, 4000);