
Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var worldWidth = this.worldSize.width;
	var worldHeight = this.worldSize.height;
	var size={x:1,y:1},scale={x:1,y:1};

	if(windowWidth < windowHeight) {
		size.x = windowWidth * 0.8;
		size.y = size.x / worldWidth * worldHeight;
	} else {
		size.y = windowHeight * 0.8;
		size.x = size.y / worldHeight * worldWidth;
	}
	scale.x = size.x/this.worldSize.width;
	scale.y = size.y/this.worldSize.height;

	//ウインドウサイズリサイズ
	this.renderer.resize(size.x, size.y);
	this.$el.width(size.x).height(size.y);
	//スケール変換
	this.playerLayer.scale.set(scale.x, scale.y);
	this.fieldLayer.scale.set(scale.x, scale.y);
	this.objectLayer.scale.set(scale.x, scale.y);

	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate.call(that);
	});
};