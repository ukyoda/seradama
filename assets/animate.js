
Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	//this.rescale();
	$('#current-time .timescore').text(this.timeInfo.current);
	if(this.timeInfo.nowDisplay) {
		$('#best-time .timescore').text(this.timeInfo.best);
	} else {
		$('#best-time .timescore').text(this.timeInfo.bestPlayer);
	}
	if(this.timeInfo.fps > 180) {
		this.timeInfo.nowDisplay = !this.timeInfo.nowDisplay;
		this.timeInfo.fps = 0;
	} else {
		this.timeInfo.fps++;
	}

	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate(that);
	});
};