
Game.fn.setController = function(type,arg) {
	switch(type) {
	case "touch":
		this._controller = new TouchController(arg);
		break;
	case "gravity":
		this._controller = new GravityController(arg);
		break;
	}
};