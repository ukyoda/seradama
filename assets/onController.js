
/**
 * コントローラで実行する処理
 */
Game.fn.onController = function(cursor){
	if(!this.player1) {return ;}
	var position = {
		x: this.player1.position.x,
		y: this.player1.position.y
	};
	var moveVal = 32/2;
	switch(cursor) {
	case Game.MOVE_UP:
		position.y -= moveVal;
		break;
	case Game.MOVE_LEFT:
		position.x -= moveVal;
		break;
	case Game.MOVE_RIGHT:
		position.x += moveVal;
		break;
	case Game.MOVE_BOTTOM:
		position.y += moveVal;
		break;
	default:
		return;
	}
	this.emit(position);
};