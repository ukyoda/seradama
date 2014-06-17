
TouchController.fn.onTouchStart = function(e){
	e.preventDefault();
	this.touchFlg = true;
};
TouchController.fn.onTouchEnd = function(e) {
	e.preventDefault();
	this.touchFlg = false;
	this.clear();
};
TouchController.fn.onTouch = function(e) {
	if(!this.touchFlg){return;}
	e.preventDefault();
	//座標計算
	var bound = this.$canvas.get(0).getBoundingClientRect();
	var changedTouches = e.originalEvent.changedTouches;
	var client = !changedTouches?e.originalEvent:changedTouches[0];
	//座標取得
	var x = client.clientX - bound.left, y = client.clientY - bound.top;
	//座標登録
	this.offset.set(x, y);
	//サーバーに渡す値を取得
	var cx = this.offset.x-this.origin.x, cy = this.offset.y-this.origin.y;
	this.val.set(cx/this.range.scale('x'), cy/this.range.scale('y'));

};