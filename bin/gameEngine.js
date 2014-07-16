var b2d = require("box2d");
var tools = require('./tools');
var gamedata = require('../public/game/gamedata.json');

var engine = {};

// 精度
var iterations = 10;
var fps = 15;
var interval;

// コールバック関数
var functions = [];  

// 世界
engine.createWorld = function (x, y, doSleep){
  var worldAABB = new b2d.b2AABB();
  worldAABB.lowerBound.Set(-100.0, -100.0);
  worldAABB.upperBound.Set(100.0, 100.0);
  var gravity = new b2d.b2Vec2(x, y);
  var world = new b2d.b2World(worldAABB, gravity, doSleep);
  return world;
};

// Box2Dオブジェクト(障害物箱)作成
engine.createStaticObj = function(json, world, datatype){
  var body = new b2d.b2BodyDef();
  body.position.Set(json.x, json.y);
  body.angle = json.angle;
  var b2dObj = world.CreateBody(body);
  var shape = new b2d.b2PolygonDef();
  shape.SetAsBox(json.w, json.h);
  b2dObj.CreateShape(shape);

  var userData = {};
  userData.id = json.id;
  userData.texture = json.texture;
  b2dObj.m_userData = userData;

  return b2dObj;
};

// Box2Dオブジェクト(障害物丸)作成
engine.createStaticObjCircle = function(json, world, datatype){
  var body = new b2d.b2BodyDef();
  body.position.Set(json.x, json.y);
  body.angle = json.angle;
  var b2dObj = world.CreateBody(body);
  var shape = new b2d.b2CircleDef();
  shape.radius = json.h;
  b2dObj.CreateShape(shape);

  var userData = {};
  userData.id = json.id;
  userData.texture = json.texture;
  b2dObj.m_userData = userData;

  return b2dObj;
};

// Box2Dオブジェクト(丸)作成
engine.createNewDynamicObjCircle = function(json, world, datatype){
  var body = new b2d.b2BodyDef();
  body.position.Set(json.x, json.y);
  body.angle = json.angle;
  var b2dObj = world.CreateBody(body);
  var shape = new b2d.b2CircleDef();
  shape.radius = json.h;
  shape.density = 1.0;
  shape.friction = 0.5;
  shape.restitution = 0.7;
  b2dObj.CreateShape(shape);
  b2dObj.SetMassFromShapes();

  var userData = {};
  userData.id = json.id;
  userData.texture = json.texture;
  b2dObj.m_userData = userData;

  return b2dObj;
};

// Box2Dオブジェクト(箱)作成
engine.createNewDynamicObjBox = function(json, world, datatype){
  var body = new b2d.b2BodyDef();
  body.position.Set(json.x, json.y);
  body.angle = json.angle;
  var b2dObj = world.CreateBody(body);
  var shape = new b2d.b2PolygonDef();
  shape.SetAsBox(json.w, json.h);
  shape.density = 1.0;
  shape.friction = 0.5;
  shape.restitution = 0.7;
  b2dObj.CreateShape(shape);
  b2dObj.SetMassFromShapes();

  var userData = {};
  userData.id = json.id;
  userData.texture = json.texture;
  userData.datatype = datatype;
  b2dObj.m_userData = userData;

  return b2dObj;
};

// ころころ追加
engine.createNewCorocoro = function(json, world, datatype){
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
  userData.id = json.id;
  userData.texture = json.texture;
  userData.datatype = datatype;
  userData.win = 0;
  userData.name = json.name;
  userData.picture = json.picture;
  userData.userType = json.userType;
  corocoro.m_userData = userData;

  return corocoro;
};

// gravity反映
engine.applyUserGravity = function(obj, x, y){
  if(x === 0 || y === 0){
    x = (Math.random() * 20.0) - 10.0;
    y = (Math.random() * 20.0) - 10.0;
  }
  var ax = (x / Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)))) * (25.0);
  var ay = (y / Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2)))) * (25.0);
  obj.ApplyForce(new b2d.b2Vec2(ax, ay), obj.GetPosition());
};

// プレイヤー位置設定
engine.setPlayerPositionWithRandom = function(obj, x, y){
  obj.SetXForm(new b2d.b2Vec2(x + Math.random() - 0.5, y + Math.random() - 0.5), 0.0);
  obj.SetLinearVelocity(new b2d.b2Vec2(0.0, 0,0));
  obj.SetAngularVelocity(0.0);
};

// オブジェクト位置初期化
engine.setObjectPosition = function(obj, x, y, angle){
  obj.SetXForm(new b2d.b2Vec2(x, y), angle);
  obj.SetLinearVelocity(new b2d.b2Vec2(0.0, 0,0));
  obj.SetAngularVelocity(0.0);
};

// あれをいい感じにする
engine.collapseObjects = function(obj){
  var x = ((Math.random() * 500.0) - 250.0) * (obj.m_mass);
  var y = ((Math.random() * 500.0) - 250.0) * (obj.m_mass);
  var center = obj.GetPosition();
  var x2 = center.x + (Math.random() * 1.0) - 0.5;
  var y2 = center.y + (Math.random() * 1.0) - 0.5;
  obj.ApplyForce(new b2d.b2Vec2(x, y), new b2d.b2Vec2(x2, y2));
};

module.exports = engine;
