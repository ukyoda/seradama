
Game.fn.removePlayer = function(id) {
	this.playerLayer.removeChild(this.players[id]);
	this.players[id] = undefined;
	if(this.player1.id === id) {
		this.player1 = undefined;
	}
	return this;
};