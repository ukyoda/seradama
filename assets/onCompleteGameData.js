
Game.fn.onCompleteGameData = function(data){
	var world = data.world;
	var width = world.width, height = world.height, grid = world.grid;
	var map = data.mapdata;
	var name = "chip_0.png";
	var fieldSet = this.fieldLayer;
	var that = this;
	this.worldSize = {
		width: width*grid,
		height: height*grid,
		grid: grid
	};
	//
	map.forEach(function(val, index){
		var x = 32 * (index % width);
		var y = 32 * Math.floor(index / width);
		var sprite = that.createFieldChip("chip_"+val+".png");
		sprite.position.x=x;sprite.position.y=y;
		fieldSet.addChild(sprite);
	});
};