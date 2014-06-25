
/**
 * プレイヤーオブジェクト（DisplayObjectContainerを継承する）
 * @return {[type]} [description]
 */
var Player = (function(){
	var key;
	var Parent = PIXI.DisplayObjectContainer;

	//コンストラクタ
	var Player = function(data){
		this._Parent = Parent;
		//コンストラクタ継承
		Parent.apply(this);

		this.ballSize = 42;
		this.name = data.name;
		this.id = data.id;
		this.img = data.picture;

		this.data = {
			mask: null,
			sprite: null,
			crown: null
		};
		//スプライト作成
		this._createSprite(data);
	};


	Player.fn = Player.prototype;
	//DisplayObjectContainerのプロトタイプを継承
	for(key in Parent.prototype) {
		Player.fn[key] = Parent.prototype[key];
	}

	return Player;

}());
