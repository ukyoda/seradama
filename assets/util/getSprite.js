
util.getSprite = function(name) {
	if(PIXI.TextureCache[name]) {
		return new PIXI.Sprite.fromFrame(name);
	} else {
		return new PIXI.Sprite.fromImage(name);
	}
};