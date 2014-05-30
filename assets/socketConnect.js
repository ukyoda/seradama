
/**
 * ソケットに接続
 */
Game.fn.socketConnect = function(socketURL) {
	var deferred = $.Deferred();
	var that = this;

	this._socket = io.connect(socketURL);
	this._socket.on('connect', function(){
		var id = that._socket.socket.sessionid;
		var player1 = that.createPlayer(id, {x: 32, y: 32}, 1);
		that.setPlayer1(player1);
		that.emit(player1.position);
		deferred.resolve();
	});

	this._socket.on('message', function(data){
		that.onMessage.call(that, data);
	});

	return deferred;

};