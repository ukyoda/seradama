
Game.fn.movePlayer = function(id, position) {
	if(this.players[id]) {
		this.players[id].position.x = position.x;
		this.players[id].position.y = position.y;
	}
	return this;
};