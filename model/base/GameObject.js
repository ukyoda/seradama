var Model = require('./Model');
var engine = require('./../functions/gameEngine');

/**
 * ゲーム空間ないで使用可能なオブジェクト
 */
var GameObject = Model.extend({
  _engine: engine,  //ゲームエンジン
  _dataType: 'object',
  /**
   * オブジェクト初期化
   * @param  {object} manifest オブジェクトの情報が書かれたJSON (engineモジュールに渡すjsonデータ)
   * @param  {object} world Box2d世界オブジェクト
   * @param  {string} dataType オブジェクトを特定する識別文字列
   */
  initialize: function(manifest, world) {
    _create(manifest, world, this._dataType);
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
   * ボールを動かす
   */
  update: function(x, y) {
    this._engine.applyUserGravity(this._obj, x, y);
  },

  /**
   * Box2D上でのオブジェクトデータを作成 ※とりあえず静的障害物を作成するメソッドとして定義
   * 作成したオブジェクトは_objにセットすること
   * @private
   * @param {object} manifest オブジェクトの情報が書かれたjson  (engineモジュールに渡すjsonデータ)
   * @param {object} world Box2d世界オブジェクト
   * @param  {string} dataType オブジェクトを特定する識別文字列
   */
  _create:function(manifest, world) {
    this._obj = this.engine.createStaticObj(manifest, world);
  },


});