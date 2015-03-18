var inherit = require('./../utility/inherit');
var util = require('util');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

/**
 * モデルクラス
 */
var Model = function Model () {
  this.data = {};
  EventEmitter.call(this);  //EventEmitterのコンストラクタを呼び出し
  if(this.initialize && typeof this.initialize === 'function') {
    this.initialize.apply(this,arguments);
  }
};

//util.inheritsでEmitterをprototypeチェーンで継承する
util.inherits(Model, EventEmitter);

/**
 * モデルからデータを取得する
 * @param  {string} キー
 * @return {object} データ
 */
Model.prototype.get = function(key) {
  if(typeof key === 'undefined') {
    return this.data;
  } else {
    return this.data[key];
  }
};

/**
 * モデルにデータをセットする。
 * <pre>
 * 引数にオブジェクトをセットした場合はそのオブジェクトをModelのデータとして取り扱う。
 * </pre>
 * @param {mixed} キー
 * @param {object}
 */
Model.prototype.set = function(key, value) {
  if(arguments.length > 1) {
    this.data[key] = value;
  } else if(typeof key === 'object'){
    this.data = key;
  } else {
    throw Error("Arguments Error");
  }
  return this;
};

/**
 * 指定したオブジェクトをモデルのデータにマージする
 * @param {mixed} キー
 * @param {object} コンテキスト
 */
Model.prototype.merge = function(obj) {
  _.extend(this.data, obj);
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