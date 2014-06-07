
Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var size={x:1,y:1},scale={x:1,y:1};
	if(windowWidth < windowHeight) {
		size.x = windowWidth;
		size.y = size.x / 2 * 3;
	} else {
		size.y = windowHeight;
		size.x = size.y / 3 * 2;
	}
	size.x *= 0.8;	//0.8倍にする
	size.y *= 0.8;
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