
var GameObject = require('../base/GameObject');

/**
 * ゴールオブジェクト
 * @class Goal
 */
var Goal = GameObject.extend({
  _dataType: 'goal',
  _create: function(manifest, world){
    return this._engine.createStaticObj(manifest, world, this._dataType);
  }
});

module.exports = Goal;