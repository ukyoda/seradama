
Game.fn.onCompleteGameData = function(data){
	var world = data.world;
	var width = world.width, height = world.height, grid = world.grid;
	var map = data.mapdata;
	var name = "chip_0.png";
	var fieldSet = this.fieldLayer;
	var that = this;
	this.worldSize = {
		width: width,
		height: height
	};
	var sprite = new PIXI.Sprite.fromImage('texture/background/background.jpg');
	sprite.width = this.worldSize.width;
	sprite.height = this.worldSize.height;
	fieldSet.addChild(sprite);

};