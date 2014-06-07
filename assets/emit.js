
/**
 * データ更新
 */
Game.fn.emit = function(data) {
	//var _socket = this._socket || {};
	//var socket = _socket.socket || {};
	//var transport = socket.transport || {};
	//var myId = transport.sessid;
	var player = this.player || {};
	var myId = player.id;
	//プレイヤーデータが出来ていないならemitしない
	if(!myId) {return;}
	data.id = myId;
	this._socket.emit('message', data);
};