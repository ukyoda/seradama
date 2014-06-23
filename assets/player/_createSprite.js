Player.fn._createSprite = function(data){
	switch(data.userType) {
	case 'guest':
		this._createGuest(data);
		break;
	default:
		this._createTwitter(data);
		break;
	}
};