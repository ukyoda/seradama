
var GameObject = require('../base/GameObject');

/**
 * ゴールオブジェクト
 * @class Goal
 */
var Goal = GameObject.extend({
  _dataType: 'goal',
  _create: function(manifest, world){
    this._obj = this.engine.createStaticObj(menifest, world, this._dataType);
  }
});