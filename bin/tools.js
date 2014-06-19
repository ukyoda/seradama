var gamedata = require('../public/game/gamedata.json');

var tools = {};
var scale = 32;

// view形式に座標変換
tools.coordinateTransformToView = function(x, y, angle){
  var point = {};
  point.x = (x * scale) + (gamedata.world.width / 2.0);
  point.y = (y * scale * -1) + (gamedata.world.height / 2.0);
  point.angle = angle * -1;
  return point;
}
tools.b2v = tools.coordinateTransformToView;

// 時間を表示形式に変換
tools.getFormattedTime = function(time){
  var hour = Math.floor(time/(60*60*1000));  // '時間'取得
  time = time-(hour*60*60*1000); 
  var minutes = Math.floor(time/(60*1000)); // '分'取得
  time = time-(minutes*60*1000);  
  var second = Math.floor(time/1000);  // '秒'取得
  time = time%1000; // 'ミリ秒'取得
  var sTime = ("00" + hour).slice(-2) + ":" + ("00" + minutes).slice(-2) + ":" + ("00" + second).slice(-2) + "." + ("000" + time).slice(-3);
  return sTime;
} 

// 経過時間
tools.getPastTime = function(startTime){
  var pastTime = new Date() - startTime;
  return pastTime;
} 

module.exports = tools;
