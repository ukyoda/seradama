

TouchController.fn.display = function(){
	var offset = this.offset;
	var size = this.size;
	var radius = this.marker.radius;
	var color = this.marker.color;
	this.marker.position.set(offset.x, offset.y);

};
