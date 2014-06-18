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

module.exports = tools;
