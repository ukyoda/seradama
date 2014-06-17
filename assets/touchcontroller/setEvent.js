
TouchController.fn.setEvent = function(){
	var that = this;
	this.$canvas.on('touchstart', $.proxy(this.onTouchStart, this));
	this.$canvas.on('touchend', $.proxy(this.onTouchEnd, this));
	this.$canvas.on('touchmove', $.proxy(this.onTouch, this));

	//PC対応
	this.$canvas.on('mousedown', function(){
		that.onTouchStart.apply(that, arguments);
		var args = arguments;
		//マウスアップイベントを一度だけ実行する
		$(window).one('mouseup', function(){
			that.onTouchEnd.apply(that, arguments);
		});
	});
	this.$canvas.on('mousemove', $.proxy(this.onTouch,this));
};