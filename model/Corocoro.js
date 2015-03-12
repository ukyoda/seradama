/**
 * Corocoroクラス
 */

var GameObject = require('./base/GameObject');
var player_textures = require('../public/texture/player.json');
var player_texture_names = [];
var p_t_n_count = 0;
for(var i in player_textures.frames){
  player_texture_names[p_t_n_count] = i;
  p_t_n_count++;
}

var seqID = 0;

/**
 * コロコロオブジェクト
 * @class Corocoro
 */
var Corocoro = GameObject.extend({
  _dataType: 'player',
  /**
   * コロコロオブジェクト初期化処理
   * @method initialize
   * @param  {object} manifest
   * @param {object} manifest オブジェクトの情報が書かれたjson  (engineモジュールに渡すjsonデータ)
   * @param {object} world Box2d世界オブジェクト
   */
  initialize: function(manifest, world) {
    GameObject.prototype.initialize.apply(this, arguments);
  },
  /**
   * Box2D上でのオブジェクトデータを作成 ※とりあえず静的障害物を作成するメソッドとして定義
   * 作成したオブジェクトは_objにセットすること
   * @method _create
   * @private
   * @param {object} manifest オブジェクトの情報が書かれたjson  (engineモジュールに渡すjsonデータ)
   * @param {object} world Box2d世界オブジェクト
   * @param  {string} dataType オブジェクトを特定する識別文字列
   */
  _create:function(manifest, world) {
    this._obj = this.engine.createNewCorocoro(manifest, world, );
  },

  /**
   * オブジェクト位置を初期化する  ※とりあえず静的障害物を作成するメソッドとして定義
   */
  initPosition: function(x, y) {
    this._engine.setPlayerPositionWithRandom(this._obj, x, y);
  },

  /**
   * ボール位置変更
   */


});

module.exports = User;

/**
 * ユーザクラス
 * @class User
 * @param {Object} userBaseInfo ユーザ情報
 */
User = function(userBaseInfo){
  // イベントリスナー
  this._events = new _Emitter();
  this.id = 'ball_'+seqID;
  data.texture = player_texture_names[Math.floor(Math.random() * p_t_n_count)];
};

/**
 * @property {Object} fn プロトタイプショートカット
 */
User.fn = User.prototype;

/**
 * 出力データに変換する
 */
User.fn.toData = function(){

};