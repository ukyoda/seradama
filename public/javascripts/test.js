
$(function(){

	var game = srdm.game("#game-display");
	window.game = game;
	//フィールドロード完了後の処理
	game.onCompleteGameData = function(data){
		//フィールド作成
		var world = data.world;
		var width = world.width, height = world.height, grid = world.grid;
		var map = data.mapdata;
		var name = "chip_0.png";
		map.forEach(function(val, index){
			var x = 32 * (index % width);
			var y = 32 * Math.floor(index / width);
			var sprite = game.createFieldChip("chip_"+val+".png");
			sprite.position.x=x;sprite.position.y=y;
			game.stage.addChild(sprite);
		});
	};

	game.start().then(function(){
		console.log("animation");
		game.animate();
		return $.Deferred().resolve();
	}).then(function(){
		console.log('socket');
		return game.connect();
	}).then(function(){
		console.log("controller");
		game.onController();
	});

});