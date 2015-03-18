var GameObject = require('../base/GameObject');

var MessageDot = GameObject.extend({
  _dataType: 'object',
  _create: function(manifest, world) {
    return this._engine.createNewDynamicObjBox(manifest, world, this._dataType);
  }
});