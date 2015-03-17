var Model = require('./Model');
var engine = require('./../GameFunctions').engine;

/**
 * ゲーム空間ないで使用可能なオブジェクト
 */
var GameObject = Model.extend({
  _engine: engine,  //ゲームエンジン
  _dataType: 'object',
  /**
   * オブジェクト初期化
   * @param {string} id モデルを識別するためのID
   * @param  {object} manifest オブジェクトの情報が書かれたJSON (engineモジュールに渡すjsonデータ)
   * @param  {object} world Box2d世界オブジェクト
   * @param  {string} dataType オブジェクトを特定する識別文字列
   */
  initialize: function(id, manifest, world) {
    this._id = id;
    this.set(this._create(manifest, world, this._dataType));
  },

  /**
   * オブジェクト位置を初期化する  ※とりあえず静的障害物を作成するメソッドとして定義
   @param {object} x 横方向位置
   @param {object} y 縦方向位置
   @param {object} angle 角度
   */
  initPosition: function(x, y, angle) {
    this._engine.setObjectPosition(this._obj, x, y, angle);
  },

  /**
   * データタイプ取得
   */
  getDataType: function(){
    return this._dataType;
  },

  /**
   * Box2D上でのオブジェクトデータを作成 ※とりあえず静的障害物を作成するメソッドとして定義
   * 作成したオブジェクトは_objにセットすること
   * @private
   * @param {object} manifest オブジェクトの情報が書かれたjson  (engineモジュールに渡すjsonデータ)
   * @param {object} world Box2d世界オブジェクト
   * @param  {string} dataType オブジェクトを特定する識別文字列
   * @return 作成したオブジェクト
   */
  _create:function(manifest, world) {
    return this.engine.createStaticObj(manifest, world, this._dataType);
  }
});

module.exports = GameObject;