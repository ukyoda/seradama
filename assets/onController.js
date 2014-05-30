
/**
 * コントローラで実行する処理
 */
Game.fn.onController = function(cursor){
	if(!this.player1) {return ;}
	var position = {
		x: this.player1.position.x,
		y: this.player1.position.y
	};
	switch(cursor) {
	case Game.MOVE_UP:
		position.y -= 32;
		break;
	case Game.MOVE_LEFT:
		position.x -=32;
		break;
	case Game.MOVE_RIGHT:
		position.x += 32;
		break;
	case Game.MOVE_BOTTOM:
		position.y += 32;
		break;
	default:
		return;
	}
	this.emit(position);
};