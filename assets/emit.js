
/**
 * データ更新
 */
Game.fn.emit = function(position) {
	var myId = this._socket.socket.transport.sessid;
	this._socket.emit('message', {
		id: myId,
		position: position
	});
};