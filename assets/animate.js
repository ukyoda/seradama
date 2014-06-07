
Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	//this.rescale();

	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate(that);
	});
};