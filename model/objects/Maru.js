var GameObject = require('../base/GameObject');

/**
 * 丸い障害物オブジェクト
 * @class Maru
 */
var Maru = GameObject.extend({
  dataType: 'maru',

  /**
   * Box2D上でのオブジェクトデータを作成 ※とりあえず静的障害物を作成するメソッドとして定義
   * 作成したオブジェクトは_objにセットすること
   * @private
   * @param {object} manifest オブジェクトの情報が書かれたjson  (engineモジュールに渡すjsonデータ)
   * @param {object} world Box2d世界オブジェクト
   * @param  {string} dataType オブジェクトを特定する識別文字列
   */
  _create:function(manifest, world) {
    return this._engine.createStaticObjCircle(manifest, world, this._dataType);
  }
});

module.exports = Maru;