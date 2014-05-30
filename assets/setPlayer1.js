
/**
 * 自プレイヤーを登録する
 */
Game.fn.setPlayer1 = function(player) {
	this.stage.addChild(player);
	this.player1 = player;
	this.players[player.id] = player;
	return this;
};