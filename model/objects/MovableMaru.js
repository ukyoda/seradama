
var GameObject = require('../base/GameObject');

/**
 * 動く丸
 * @class MovableMaru
 */
var MovableMaru = GameObject.extend({
  _dataType: 'movableMaru',
  _create: function(manifest, world){
    return this._engine.createNewDynamicObjCircle(manifest, world, this._dataType);
  }
});

module.exports = MovableMaru;