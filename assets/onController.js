/**
 * コントローラで実行する処理
 */
Game.fn.onController = function(){
	if(!this._controller) {
		return;
	}
	this.emit({
		gravity: this._controller.val
	});
};