
Game.fn.animate = function(){
	var that = this;
	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate.call(that);
	});
};