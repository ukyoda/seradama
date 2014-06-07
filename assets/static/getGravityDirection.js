
Game.getGravityDirection = function(){
	var agent = Game.getAgent();
	switch(agent) {
	case Game.getAgent.ios:
		return 1;
	case Game.getAgent.android:
		return -1;
	case Game.getAgent.windows:
		return -1;
	default:
		return 1;
	}
};