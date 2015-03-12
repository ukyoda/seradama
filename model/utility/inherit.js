var _ = require('underscore');

var createObject;
if(　typeof Object.create === 'function'){
  createObject = function(prototype){
      return Object.create(prototype);
  }
}else{
  createObject = function(prototype){
      var Temp = function(){};
      Temp.prototype = prototype;
      return new Temp();
  }
}

/**
 * 継承するやつ
 * @param  {Object} parent 親クラス
 * @param  {Object} properties インスタンスプロパティ
 * @return {Object} サブクラス
 */
var inherit = function(parent, properties){
  var child;
  if(properties && properties.hasOwnProperty('constructor')) {
    child = properties.constructor;
  } else {
    child = function(){
      parent.apply(this, arguments);
    };
  }

  //親クラスのメソッドをchildに追加
  _.extend(child, parent);

  //親クラスのメソッドをコピー
  child.prototype = createObject(parent.prototype);

  //プロパティを追加する
  if(properties) {
    _.extend(child.prototype, properties);
  }
  child.prototype.constructor = child;
  child.__super__ = parent.prototype;
  return child;
};

module.exports = inherit;