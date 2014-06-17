

GravityController.fn.setEvent = function(){
	var that = this;
	$(window).on('devicemotion', function(e) {
		var x = event.accelerationIncludingGravity.x || 0;
		var y = event.accelerationIncludingGravity.y || 0;
		that.val.set(x * that.direction, y * that.direction);
	});
};