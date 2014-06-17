
TouchController.fn.animate = function() {

	var that = this;
	this.display();
	this.renderer.render(this.stage);

	window.requestAnimFrame(function(){
		that.animate();
	});


};