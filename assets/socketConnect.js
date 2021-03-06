
/**
 * ソケットに接続
 */
Game.fn.socketConnect = function(socketURL) {
	var deferred = $.Deferred();
	var that = this;

	this._socket = io.connect(socketURL);
	this._socket.on('connect', function(){
		deferred.resolve();
	});

	this._socket.on('message', function(){
		that.onMessage.apply(that, arguments);
	});

	this._socket.on('disconnect', function(){
		that.onDisconnected.apply(that, arguments);
	});

	return deferred;

};
