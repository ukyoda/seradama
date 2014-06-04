/**
 * コントローラで実行する処理
 */
Game.fn.onController = function(){
	//if(!this.player) {return ;}
	var gravity = this._controller.gravity;
	this.emit({
		gravity: gravity
	});
};