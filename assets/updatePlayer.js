
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
		} else {
			try {
				//スプライト作成
				sprite = new PIXI.Sprite.fromImage(picture);
				//マスク作成
				mask = new PIXI.Graphics();
				mask.beginFill();
				mask.drawCircle(0,0,15);
				mask.color = 0x000000;
				mask.endFill();
				sprite.mask = mask;
				container.addChild(mask);
			} catch (e){
				window.console.log(e);
				sprite = new PIXI.Sprite.fromFrame(textureId);
			}
		}
		//スプライトのアンカーの位置を修正
		sprite.anchor.set(0.5,0.5);
		//スプライトをコンテナに登録
		container.addChild(sprite);
		//付加情報をコンテナにつける
		container.name = name;
		container.id = id;
		//レイヤーにコンテナ登録
		layer.addChild(container);
		layer.hash[id] = container;
		//スプライト、コンテナのサイズ調整
		sprite.width=32;sprite.height=32;
		container.width=32;container.height=32;
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