
Player.fn._createMask = function(data){
	var mask = new PIXI.Graphics();
	mask.position.set(0,0);
	mask.beginFill();
	mask.drawCircle(0,0,this.ballSize/2);
	mask.color = 0xffffff;
	mask.endFill();
	return mask;
};