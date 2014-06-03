
Game.checkDeviceMotion = function(){
	if('ondevicemotion' in window) {
		return true;
	} else {
		return false;
	}
};