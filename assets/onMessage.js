/**
 * サーバからデータを取得したとき
 */
Game.fn.onMessage = function(data) {
	//ユーザ追加判定
	var id = this._socket.socket.transport.sessid;
	if(!this.players[id]) {
		this.players[id] = this.createPlayer(id, data, 2);
	} else {
		this.movePlayer(id, data);
	}
	window.console.log(this._socket.socket.transport.sessid);
	window.console.log(this._socket.socket.sessionid);
	window.console.log(data);
};