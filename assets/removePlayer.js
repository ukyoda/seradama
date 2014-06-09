
Game.fn.removePlayer = function(id) {
	var sprite = this.playerLayer.hash[id];

	if(!sprite) {
		return this;
	}

	this.playerLayer.removeChild(sprite);
	delete this.playerLayer.hash[id];
	if(this.player === sprite) {
		delete this.player;
	}
	return this;
};