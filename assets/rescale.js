
//全体をリスケール
Game.fn.rescale = function(){
	var windowWidth = $(".game-display").width();
	var windowHeight = $(".game-display").height();
	var worldWidth = this.worldSize.width;
	var worldHeight = this.worldSize.height;
	var size={x:1,y:1},scale={x:1,y:1};
	var scaleRate = 1.0;

	if(windowWidth/worldWidth < windowHeight/worldHeight) {
		size.x = windowWidth * scaleRate;
		size.y = size.x / worldWidth * worldHeight;
	} else {
		size.y = windowHeight * scaleRate;
		size.x = size.y / worldHeight * worldWidth;
	}
	scale.x = size.x/this.worldSize.width;
	scale.y = size.y/this.worldSize.height;

	//ウインドウサイズリサイズ
	this.renderer.resize(size.x, size.y);
	//this.$el.width(size.x).height(size.y);
	//スケール変換
	this.playerLayer.scale.set(scale.x, scale.y);
	this.fieldLayer.scale.set(scale.x, scale.y);
	this.objectLayer.scale.set(scale.x, scale.y);
	this.menuLayer.scale.set(scale.x, scale.y);
};