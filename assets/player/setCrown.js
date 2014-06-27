
Player.fn.setCrown = function(texture){
	var crown = util.getSprite(texture);
	crown.position.set(0, -this.ballSize);
	crown.anchor.set(0.5, 0.5);
	this.data.crown = crown;
	this.addChild(crown);
};