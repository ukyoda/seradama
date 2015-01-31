/**
 * PIXI.jsのTextureを管理
 * @param  {String} jsonFileName Texture Json ファイルパス
 * @return {String}              Texture情報
 */
module.exports = function(jsonFileName) {
  var textures = require(jsonFileName);
  var textureNames = [];
  textures.foreach(val, textureName) {
    textureNames.push(textureName);
  };

  return {
    textures: textures,
    textureNames: textureNames,
    getTextureByIndex: function(index) {
      var textureName = this.textureNames[index];
      return textures[textureName];
    }
  };
};