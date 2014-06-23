
Player.fn.removeCrown = function(){
	var crown = this.data.crown;
	if(crown) {
		this.removeCrown(crown);
		this.data.crown = undefined;
	}
};