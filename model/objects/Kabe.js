var GameObject = require('./base/GameObject');

/**
 * 壁オブジェクト
 * @class Kabe
 */
var Kabe = GameObject.extend({
  _dataType: 'kabe',
  _create: function(manifest, world) {
    this._obj = this.engine.createStaticObj(manifest, world, this._dataType);
  }
});

module.exports = Kabe;