
Game.fn.movePlayer = function(id, position, angle) {
	if(this.players[id]) {
		this.players[id].position.x = position.x;
		this.players[id].position.y = position.y;
		this.players[id].rotation = angle;
	}
	return this;
};