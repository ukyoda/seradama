
Game.fn.onCompleteGameData = function(data){
	var world = data.world;
	var width = world.width, height = world.height, grid = world.grid;
	var map = data.mapdata;
	var name = "chip_0.png";
	//
	map.forEach(function(val, index){
		var x = 32 * (index % width);
			var y = 32 * Math.floor(index / width);
			var sprite = game.createFieldChip("chip_"+val+".png");
			sprite.position.x=x;sprite.position.y=y;
			game.stage.addChild(sprite);
	});
};