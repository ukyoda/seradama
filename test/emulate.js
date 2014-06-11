

module.exports = function(page) {
	//偽装関連
	var userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9B206 Safari/7534.48.3';
	page.customHeaders = {
		'Connection' : 'keep-alive',
		'Accept-Charset' : 'Shift_JIS,utf-8;q=0.7,*;q=0.3',
		'Accept-Language' : 'ja,en-US;q=0.8,en;q=0.6',
		'Cache-Control' : 'no-cache',
		'User-Agent' : userAgent
	};



	page.onResourceReceived = function(res){
	};

	page.onLoadFinished = function(){
		var id = page.evaluate(function(){
			return window.game._socket.socket.transport.sessid;
		}, false);
		console.log('エミュレート開始:'+id);
		setInterval(emulateAcceleration, 200);
	};

	page.onInitialized = function(){
		page.evaluate(function(){
			window.ondevicemotion = null;
		});
	};

	page.onAlert = function(msg) {
		console.log(msg);
	};

	var emulateAcceleration = function(){
		page.evaluate(function(){
			game._controller.gravity = {
				x: 4*Math.random()-2,
				y: 4*Math.random()-2
			};
		});
	};

	var phantomShutdown = function(msg){
		console.log(msg || "終了します");
		phantom.exit();
	};

	page.open('http://127.0.0.1/guest', function(status){
		var game;
		if(!status){
			phantomShutdown();
		}
		//phantomShutdown();
	});

};

