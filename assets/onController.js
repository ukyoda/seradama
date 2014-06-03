/**
 * コントローラで実行する処理
 */
Game.fn.onController = function(){
	if(!this.player1) {return ;}
	var gravity = this._controller.gravity;
	this.emit({
		gravity: gravity
	});
};