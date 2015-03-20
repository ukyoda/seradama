var funcs = require('./../model/GameFunctions');
var Stage = require('./../model/stage/Stage');
var world = funcs.engine.createWorld(0,0,true);
var stage = new Stage(world);
var index;

stage.nextStage();
console.log(stage.getSendData());

console.log(process.memoryUsage());

//ステージを進めてもメモリリークは大丈夫そうか?
for(index=0;index<100000;index++) {
  var data = stage.nextStage();
  if(index % 1000 == 0) {
    console.log(index,world.m_bodyCount, process.memoryUsage());
    if(global.gc) {
      global.gc();
    }
  }
  //console.log(stage.stageIndex, stage.stageName);
}
console.log(process.memoryUsage());

//時間のテスト
setTimeout(function(){
  console.log(stage.getTime());
}, 4000);
console.log('Plesase wait 4000 ms...');