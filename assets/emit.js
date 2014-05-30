
/**
 * データ更新
 */
Game.fn.emit = function(data) {
	this._socket.emit('message', {
		data: data
	});
};