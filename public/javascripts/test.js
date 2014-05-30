
$(function(){
	var Game = srdm.Game;
	var game = new Game({
		target: "#game-display"
	});
	window.game = game;

	$(document).on('keydown',function(e){
		var Game = srdm.Game;
		var keyCode = e.keyCode;
		var move = -1;
		switch(keyCode) {
		case Game.CODE_UP:
			move = Game.MOVE_UP;
			break;
		case Game.CODE_RIGHT:
			move = Game.MOVE_RIGHT;
			break;
		case Game.CODE_BOTTOM:
			move = Game.MOVE_BOTTOM;
			break;
		case Game.CODE_LEFT:
			move = Game.MOVE_LEFT;
			break;
		default:
			return;
		}
		game.onController(move);
	});

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