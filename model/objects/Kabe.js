var GameObject = require('../base/GameObject');

/**
 * 壁オブジェクト
 * @class Kabe
 */
var Kabe = GameObject.extend({
  _dataType: 'kabe',
  _create: function(manifest, world) {
    return this._engine.createStaticObj(manifest, world, this._dataType);
  }
});

module.exports = Kabe;