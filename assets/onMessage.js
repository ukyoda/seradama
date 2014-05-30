/**
 * サーバからデータを取得したとき
 */
Game.fn.onMessage = function(data) {
	//ユーザ追加判定
	var id = data.id;
	var position = data.position;
	if(!this.players[id]) {
		this.addPlayers(this.createPlayer(id, position, 2));
	} else {
		this.movePlayer(id, position);
	}
	window.console.log(this._socket.socket.transport.sessid);
	window.console.log(this._socket.socket.sessionid);
	window.console.log(data);
};