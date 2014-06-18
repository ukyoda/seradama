var b2d = require("box2d");
var gamedata = require('../public/game/gamedata.json');

var engine = {};
var scale = 32;

// 世界
engine.createWorld = function (){
  var worldAABB = new b2d.b2AABB();
  worldAABB.lowerBound.Set(-100.0, -100.0);
  worldAABB.upperBound.Set(100.0, 100.0);
  var gravity = new b2d.b2Vec2(0.0, 0.0);
  var doSleep = true;
  var world = new b2d.b2World(worldAABB, gravity, doSleep);
  return world;
}

module.exports = engine;
