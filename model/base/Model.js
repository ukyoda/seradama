var inherit = require('./../utility/inherit');


/**
 * モデルクラス
 */
var Model = function Model (){
  this.data = {};
  if(this.initialize && typeof this.initialize === 'function') {
    this.initialize.apply(this,arguments);
  }
};

Model.prototype.get = function(key) {
  return this.data[key];
};
Model.prototype.set = function(key, value) {
  this.data[key] = value;
  return this;
};

/**
 * 継承用パターンメソッド
 * @param  {Parent} properties prototype継承するメソッドを定義
 * @return {Child} サブクラスオブジェクト
 */
Model.extend = function(properties) {
  var child = inherit(this, properties);
  child.extend = this.extend;
  return child;
};


//エクスポート
module.exports = Model;