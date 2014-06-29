
Player.fn.removeCrown = function(){
	var crown = this.data.crown;
	if(crown) {
		this.removeChild(crown);
		this.data.crown = undefined;
	}
};