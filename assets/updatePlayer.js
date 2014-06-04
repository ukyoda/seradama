
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
	if(data.delflag) {
		that.removePlayer(data.id);
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
	}

	//スプライト情報を更新
	sprite.position.set(position.x,position.y);
	sprite.anchor.set(0.5,0.5);
	sprite.rotation = angle;
	//自ボールの場合，プロパティに参照を追加
	if(datatype === "you") {
		this.player = sprite;
	}
	return sprite;

};