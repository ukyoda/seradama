
$(function(){
	var Game = srdm.Game;
	var game = new Game({
		target: "#game-display"
	});
	window.game = game;

	$(window).on('devicemotion', function(e) {
		var x = event.accelerationIncludingGravity.x || 0;
		var y = event.accelerationIncludingGravity.y || 0;
		game.setDeviceMotion({x: x, y: y});
	});

	window.setInterval(function(){
		game.onController.call(game, -1);
	}, 200);

	var nowAngle = 0;
	game.rotate = function(angle) {
		nowAngle +=angle;
		nowAngle = nowAngle < 2*Math.PI? nowAngle: nowAngle-2*Math.PI;
		game.stage.worldTransform.a = -Math.sin(nowAngle);
		game.stage.worldTransform.b = Math.cos(nowAngle);
		game.stage.worldTransform.c = Math.cos(nowAngle);
		game.stage.worldTransform.d = Math.sin(nowAngle);
		game.stage.worldTransform.tx += 400;
		game.stage.worldTransform.ty += 400;
	};

	game.start().then(function(){
		console.log("animation");
		game.animate();
		return $.Deferred().resolve();
	}).then(function(){
		console.log('socket');
		return game.socketConnect();
	}).then(function(){
		console.log("controller");
		game.onController();
	});

});