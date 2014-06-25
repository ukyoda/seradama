
Player.fn._createGuest = function(data){
	var sprite = new PIXI.Sprite.fromFrame(data.texture);
	sprite.width = this.ballSize;
	sprite.height = this.ballSize;
	sprite.position.set(0,0);
	sprite.anchor.set(0.5, 0.5);
	this.addChild(sprite);
	this.data.sprite = sprite;

};