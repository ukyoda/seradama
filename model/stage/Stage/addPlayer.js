var _ = require('underscore');
var Models = require('../../GameObjects');
var funcs = require('../../GameFunctions');

var usercnt = 0;
//プレイヤー用のテクスチャ取得
var player_textures = require('../../../public/texture/player.json');
var player_texture_names = [];
var p_t_n_count = 0;
(function(){
  var i;
  for(i in player_textures.frames){
    player_texture_names[p_t_n_count] = i;
    p_t_n_count++;
  }
}());

// ユーザを追加する
module.exports = function(id, manifest){
  userCount++;
  //manifestにid追加
  manifest.id = "ball_"+userCount;
  manifest.texture = player_texture_names[Math.floor(Math.random() * p_t_n_count)];
  this.players[id] = new Models.Player(manifest.id, manifest, this.world);
  return this.sendData();
};