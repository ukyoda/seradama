
Game.fn.trigger = function() {
	if(arguments.length < 0) {
		return null;
	}
	var args = Array.prototype.slice.apply(arguments);
	var trigger = args.shift();
	var i, length;
	var events = this._events[trigger];
	if(events && events.length){
		for(i=0, length=events.length; i<length;i++){
			events[i].apply(null, args);
		}
	}
};