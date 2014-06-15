
Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	//this.rescale();
	$('#current-time .timescore').text(this.timeInfo.current);
	$('#best-time .timescore').text(this.timeInfo.best);

	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate(that);
	});
};