
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
		this.removePlayer(data.id);
		return null;
	}

	filterVal = layer.children.filter(function(val){
		return (val.id === id);
	});
	if(filterVal.length) {
		sprite = filterVal[0];
	} else {
		sprite = new PIXI.Sprite.fromFrame(textureId);
		sprite.id = id;	//固有ID記憶
		layer.addChild(sprite);
		sprite.width=32;sprite.height=32;
	}
	//子スプライト削除
	for(i = 0, length = sprite.children.length; i<length; i++) {
		sprite.removeChild(sprite.children[i]);
	}


	//スプライト情報を更新
	sprite.prevPosition = sprite.position.clone();	//前の位置情報を記憶
	sprite.position.set(position.x,position.y);
	sprite.anchor.set(0.5,0.5);
	sprite.prevRotation = sprite.rotation;
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