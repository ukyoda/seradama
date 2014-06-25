
Player.fn._createTwitter = function(data){
	var sprite, mask;
	try {
		sprite = new PIXI.Sprite.fromImage(data.picture);
		mask = this._createMask();
		sprite.mask = mask;
		this.addChild(sprite);
		this.addChild(mask);
		this.data.mask = mask;
		this.data.sprite = sprite;
		sprite.anchor.set(0.5, 0.5);
	} catch(e) {
		this._createGuest(data);
	}
};