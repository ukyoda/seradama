
/**
 * プレイヤー追加
 */
Game.fn.addPlayers = function(player) {
	//ステージに追加する
	this.playerLayer.addChild(player);
	//プレイヤー一覧コンテナに追加する（参照用）
	this.players[player.id] = player;
	return this;
};