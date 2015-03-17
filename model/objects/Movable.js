
var GameObject = require('../base/GameObject');

/**
 * 動く壁
 * @class Movable
 */
var Movable = GameObject.extend({
  _dataType: 'movable',
  _create: function(manifest, world){
    return this._engine.createNewDynamicObjBox(manifest, world, this._dataType);
  }
});

module.exports = Movable;