
$(function(){

	//ウインドウサイズ最適化
	var gameDisplayRescale = function(){
		var $header = $('#game-header');
		var $display = $('#game-display');
		var $window = $(window);
		var displayPadding = 15;	//game-displayのpadding
		var padding = $header.height() + displayPadding;	//html的なpadding
		var height = $window.height() - padding - displayPadding;	//padding算出
		//サイズ調整
		$display.height(height).css({
			"padding-top":padding,
			"padding-bottom": displayPadding
		});
	};
	gameDisplayRescale();

	var Game = srdm.Game;

	var game = new Game({
		target: "#game-display"
	});

	var gravityDirection = Game.getGravityDirection();
	//即時関数とDeferredを用いてコントローラを決定する
	(function(){
		var deferred = $.Deferred();
		if(!Game.checkDeviceMotion()) {
			deferred.reject();
			return deferred;
		}
		$(window).one('devicemotion',function(){
			if(event.accelerationIncludingGravity.x === null) {
				deferred.reject();
			} else {
				deferred.resolve();
			}
		});
		return deferred;
	}()).done(function(){
		//加速度が利用可能なら重力コントローラを使う
		game.setController('gravity', gravityDirection);
	}).fail(function(){
		window.alert('ご利用の端末では加速度を利用する事が出来ません。画面下のタッチコントローラを使って操作してください');
		//加速度が利用できないならタッチコントローラを使う
		$('#game-controller').css('display','block');
		game.setController('touch', "#game-controller");
	});

	window.setInterval(function(){
		game.onController.call(game, -1);
	}, 200);

	//画面サイズが変わったらリスケールする
	$(window).on('resize',function(){
		gameDisplayRescale();
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
		var userType = $('#player-type').val();
		game.emitInfo({
			picture: picture,
			name:name,
			userType: userType
		});
		//非同期で読み込むデータを全て読み込んだらプレイ
		game.rescale.call(game);
	});

	window.game = game;
	//delete srdm;


});