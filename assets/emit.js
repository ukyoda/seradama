
/**
 * データ更新
 */
Game.fn.emit = function(position) {
	var myId = this._socket.socket.transport.sessid;
	var gravity = this._controller.gravity;
	this._socket.emit('message', {
		id: myId,
		gravity: gravity,
		position: position
	});
};