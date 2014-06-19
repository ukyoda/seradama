var b2d = require("box2d");
var tools = require('./tools');
var gamedata = require('../public/game/gamedata.json');

var engine = {};

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

// Box2Dオブジェクト(障害物)作成
engine.createStaticObj = function(obj, world, datatype){
  var body = new b2d.b2BodyDef();
  body.position.Set(obj.x, obj.y);
  body.angle = obj.angle;
  var b2dObj = world.CreateBody(body);
  var shape = new b2d.b2PolygonDef();
  shape.SetAsBox(obj.w, obj.h);
  b2dObj.CreateShape(shape);

  var userData = {};
  userData.id = obj.id;
  userData.texture = obj.texture;
  b2dObj.m_userData = userData;

  return b2dObj;
}

// Box2Dオブジェクト(丸)作成
engine.createNewDynamicObjCircle = function(obj, world, datatype){
  
}

// Box2Dオブジェクト(箱)作成
engine.createNewDynamicObjBox = function(obj, world, datatype){
  
}

// ころころ追加
engine.createNewCorocoro = function(obj, world, datatype){
  var corocoroDef = new b2d.b2BodyDef();
  corocoroDef.position.Set(-90.0, -90.0);
  var corocoro = world.CreateBody(corocoroDef);
  var corocoroShapeDef = new b2d.b2CircleDef();
  corocoroShapeDef.radius = 0.65625;
  corocoroShapeDef.density = 1.0;
  corocoroShapeDef.friction = 0.5;
  corocoroShapeDef.restitution = 0.7;
  corocoro.CreateShape(corocoroShapeDef);
  corocoro.SetMassFromShapes();

  var userData = {};
  userData.id = obj.id;
  userData.texture = obj.texture;
  userData.datatype = datatype;
  userData.win = 0;
  userData.name = obj.name;
  userData.picture = obj.picture;
  userData.userType = obj.userType;
  corocoro.m_userData = userData;

  return corocoro;
}

// gravity反映
engine.applyUserGravity = function(obj, x, y){
  if(x == 0 || y == 0){
    x = (Math.random() * 20.0) - 10.0;
    y = (Math.random() * 20.0) - 10.0;
  }
  var ax = (x / Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)))) * (25.0);
  var ay = (y / Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)))) * (25.0);
  obj.ApplyForce(new b2d.b2Vec2(ax, ay), obj.GetPosition());
}

module.exports = engine;
