/**
 * サーバからデータを取得したとき
 */
var flg = 0;
Game.fn.onMessage = function(data) {

	var that = this;
	data.value.forEach(function(val, index){
		var id = val.id;
		var angle = window.parseInt(val.angle, 10);
		var x = window.parseInt(val.x, 10);
		var y = window.parseInt(val.y, 10);
		var position = {x:x, y:y};
		var angle = window.parseInt(val.angle, 10);
		var sessId = that._socket.socket.transport.sessid;
		var playerType = sessId === id ? 1: 0;
		var player = that.players[id] || that.createPlayer(id, position, playerType);
		if(playerType === 1) {
			that.setPlayer1(player);
		} else {
			that.addPlayers(player);
		}
		that.movePlayer(id, position, angle);
	});
	//ユーザ追加判定

};

