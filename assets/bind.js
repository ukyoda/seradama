
Game.fn.bind = function(trigger,callback, context){
	if(typeof callback !== "function") {
		return null;
	}
	var events = this._events[trigger];
	if(!events){
		events = [];
	}
	events.push(function(){
		if(!context){context = this;}
		callback.apply(context, arguments);
	});
	this._events[trigger] = events;
	return this;
};