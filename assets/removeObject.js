
Game.fn.removeObject = function(id) {
	var filterSprite = this.objectLayer.children.filter(function(val){
		return (val.id === id);
	});
	if(!filterSprite.length){
		return this;
	}
	var sprite = filterSprite[0];
	this.objectLayer.removeChild(sprite);
	return this;
};