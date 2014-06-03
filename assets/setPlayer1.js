
/**
 * 自プレイヤーを登録する
 */
Game.fn.setPlayer1 = function(player) {
	this.playerLayer.addChild(player);
	this.player1 = player;
	this.players[player.id] = player;
	return this;
};