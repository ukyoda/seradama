
$(function(){
	var Game = srdm.Game;
	if(!Game.checkDeviceMotion()) {
		window.alert('このゲームは加速度センサを使用します。\nご利用の端末では動作させる事が出来ません');
		return;
	}
	var game = new Game({
		target: "#game-display"
	});

	window.game = game;


	var gravityDirection = Game.getGravityDirection();
	$(window).on('devicemotion', function(e) {
		var x = event.accelerationIncludingGravity.x || 0;
		var y = event.accelerationIncludingGravity.y || 0;
		game.setDeviceMotion({x: x * gravityDirection, y: y * gravityDirection});
	});

	window.setInterval(function(){
		game.onController.call(game, -1);
	}, 200);

	//画面サイズが変わったらリスケールする
	$(window).on('resize',function(){
		game.rescale.call(game);
	});

	game.start().then(function(){
		console.log("animation");
		game.animate();
		return $.Deferred().resolve();
	}).then(function(){
		console.log('socket');
		return game.socketConnect();
	}).done(function(){
		//画像と名前を送信
		var picture = $('#player-picture').val();
		var name = $('#player-name').val();
		game.emit({
			picture: picture,
			name:name
		});
		//非同期で読み込むデータを全て読み込んだらプレイ
		game.rescale.call(game);
	});

});