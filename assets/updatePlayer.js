
Game.fn.updatePlayer = function(data){
	var layer = this.playerLayer;
	var player = null;

	if(data.delflag) {
		this.removePlayer(data.id);
		return null;
	}

	if(layer.hash[data.id]) {
		player = layer.hash[data.id];
	} else {
		player = new Player(data);
		layer.addChild(player);
	}
	layer.hash[data.id] = player;

	player.data.sprite.rotation = window.parseFloat(data.angle, 10);
	player.position.set(
		window.parseFloat(data.x, 10),
		window.parseFloat(data.y, 10)
	);

	//自ボールの場合，プロパティに参照を追加
	if(data.datatype === "you") {
		this.player = player;
	}
	return player;

};