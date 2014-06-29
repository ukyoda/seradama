
Player.fn.updateCrown = function(rank){
	rank = window.parseInt(rank, 10);
	this.removeCrown();
	if(rank === 1) {
		this.setCrown('/texture/icons/gold.png');
	} else if(rank === 2) {
		this.setCrown('/texture/icons/silver.png');
	} else if(rank === 3) {
		this.setCrown('/texture/icons/blonze.png');
	}
};