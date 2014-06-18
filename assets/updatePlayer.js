
Game.fn.updatePlayer = function(data){
	var id = data.id;
	var name = data.name;
	var position = {
		x:window.parseFloat(data.x, 10),
		y:window.parseFloat(data.y, 10)
	};
	var textureId = data.texture;
	var picture = data.picture;
	var userType = data.userType || "guest";
	var datatype = data.datatype || "object";
	var angle = window.parseFloat(data.angle, 10);
	var layer = this.playerLayer, filterVal=[], sprite;
	var i, length;
	var ballSize = 42;
	if(data.delflag) {
		this.removePlayer(id);
		return null;
	}

	sprite = (function(){
		var sprite, mask, container;
		if(layer.hash[id]) {
			return layer.hash[id];
		}
		container = new PIXI.DisplayObjectContainer();
		if(userType === "guest") {
			sprite = new PIXI.Sprite.fromFrame(textureId);
			sprite.width=ballSize;sprite.height=ballSize;
			sprite.position.set(0,0);
			container.addChild(sprite);
		} else {
			try {
				//スプライト作成
				sprite = new PIXI.Sprite.fromImage(picture);
				//sprite.width=ballSize;sprite.height=ballSize;

				//マスク作成
				mask = new PIXI.Graphics();
				mask.position.set(0,0);
				mask.beginFill();
				mask.drawCircle(0,0,ballSize/2);
				mask.color = 0xffffff;
				mask.endFill();
				sprite.mask = mask;
				container.addChild(sprite);
				container.addChild(mask);
			} catch (e){
				sprite = new PIXI.Sprite.fromFrame(textureId);
				sprite.width=ballSize;sprite.height=ballSize;
				sprite.position.set(0,0);
				container.addChild(sprite);
			}
		}
		//スプライトのアンカーの位置を修正
		sprite.anchor.set(0.5,0.5);
		//付加情報をコンテナにつける
		container.name = name;
		container.id = id;
		container.img = picture;
		//レイヤーにコンテナ登録
		layer.addChild(container);
		layer.hash[id] = container;
		//スプライト、コンテナのサイズ調整
		container.width=ballSize;container.height=ballSize;
		return container;
	}());

	//スプライト情報を更新
	sprite.position.set(position.x,position.y);
	sprite.rotation = angle;

	//自ボールの場合，プロパティに参照を追加
	if(datatype === "you") {
		this.player = sprite;
	}
	return sprite;

};