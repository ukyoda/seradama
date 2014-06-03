
/**
 * データ更新
 */
Game.fn.emit = function(data) {
	var myId = this._socket.socket.transport.sessid;
	if(!myId) {return;}
	data.id = myId;

	this._socket.emit('message', data);
};