
Game.fn.updatePlayer = function(data){
	var id = data.id;
	var position = {
		x:window.parseFloat(data.x, 10),
		y:window.parseFloat(data.y, 10)
	};
	var textureId = data.texture;
	var datatype = data.datatype || "object";
	var angle = window.parseFloat(data.angle, 10);
	var layer = this.playerLayer, filterVal=[], sprite;
	var i, length;
	if(data.delflag) {
		this.removePlayer(id);
		return null;
	}

	if(layer.hash[id]) {
		sprite = layer.hash[id];
	} else {
		sprite = new PIXI.Sprite.fromFrame(textureId);
		sprite.id = id;	//固有ID記憶
		layer.addChild(sprite);
		layer.hash[id] = sprite; //ハッシュに登録
		sprite.width=32;sprite.height=32;
	}

	//スプライト情報を更新
	sprite.position.set(position.x,position.y);
	sprite.anchor.set(0.5,0.5);
	sprite.rotation = angle;

	//あたり判定(自分のボールのみ)
//	if(
//		this.player &&
//		this.player.id === id &&
//		data.collision) {
//		if(this.player.collision) {
//			this.audio.atack.stop().play();
//			this.player.collision = false;
//		} else {
//			this.player.collision = true;
//		}
//	}

	//自ボールの場合，プロパティに参照を追加
	if(datatype === "you") {
		this.player = sprite;
	}
	return sprite;

};