var GameObject = require('../base/GameObject');
var player_textures = require('../../public/texture/player.json');
var player_texture_names = [];
var p_t_n_count = 0;
for(var i in player_textures.frames){
  player_texture_names[p_t_n_count] = i;
  p_t_n_count++;
}

/**
 * コロコロオブジェクト
 * @class Player
 */
var Player = GameObject.extend({
  _dataType: 'player',

  /**
   * Box2D上でのオブジェクトデータを作成 ※とりあえず静的障害物を作成するメソッドとして定義
   * 作成したオブジェクトは_objにセットすること
   * @method _create
   * @private
   * @param {object} manifest オブジェクトの情報が書かれたjson  (engineモジュールに渡すjsonデータ)
   * @param {object} world Box2d世界オブジェクト
   */
  _create:function(manifest, world) {
    return this._engine.createNewPlayer(manifest, world, this._dataType);
  }

});

module.exports = Player;