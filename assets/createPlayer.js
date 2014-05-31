
Game.fn.createPlayer = function(id, position, type) {
	if(this.players[id]) {
		return this.players.id;
	}
	var name, sprite;
	switch(type) {
	case 1:
		name = "player_3_1.png";
		break;
	default:
		name = "player_1_1.png";
		break;
	}
	sprite = PIXI.Sprite.fromFrame(name);
	sprite.id = id;
	sprite.position.x = position.x;
	sprite.position.y = position.y;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	return sprite;
};