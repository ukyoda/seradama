
Game.fn.animate = function(){
	var that = this;

	//ウインドウサイズ取得
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var size, scale;
	if(windowWidth < windowHeight) {
		size = windowWidth;
	} else {
		size = windowHeight;
	}
	size *= 0.8;	//0.8倍にする
	scale = size/800;
	size = 800*scale;
	//ウインドウサイズリサイズ
	this.renderer.resize(size, size);
	this.$el.width(size).height(size);
	//スケール変換
	this.playerLayer.scale.set(scale,scale);
	this.fieldLayer.scale.set(scale, scale);

	this.renderer.render(this.stage);
	window.requestAnimFrame(function(){
		that.animate.call(that);
	});
};