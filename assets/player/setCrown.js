
Player.fn.setCrown = function(texture){
	var crown = new PIXI.Sprite.fromImage(texture);
	crown.position.set(0, -this.ballSize);
	crown.anchor.set(0.5, 0.5);
	this.data.crown = crown;
	this.addChild(crown);
};