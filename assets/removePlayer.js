
Game.fn.removePlayer = function(id) {
	var filterSprite = this.playerLayer.children.filter(function(val){
		return (val.id === id);
	});
	if(!filterSprite.length){
		return false;
	}
	var sprite = filterSprite[0];
	this.playerLayer.removeChild(sprite);
	if(this.player === sprite) {
		this.player = undefined;
	}
	return this;
};