
GravityController = function Controller(direction){
	this.val = {
		x: 0,
		y: 0,
		set: function(x,y){
			this.x = x;
			this.y = y;
			return this;
		}
	};
	this.direction = direction;
	this.setEvent();
};

GravityController.fn = GravityController.prototype;