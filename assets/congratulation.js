
Game.fn.congratulation = function(rankData){
	var hash = this.playerLayer.hash;
	var winner = hash[rankData.win_id];
	var topRanker = [];
	var myRankData = {};
	var i, length, data;
	var goalAlert, rankingAlert, myRankAlert, messageAlert;
	var deferred = $.Deferred(), that = this;

	for(i=0, length=rankData.data.length;i<length;i++) {
		data=rankData.data[i];
		if(topRanker.length < 3) {
			topRanker.push({
				rank: i+1,
				data: data,
				sprite: hash[data.id]
			});
		}
		if(this.player.id === data.id) {
			myRankData = {
				rank: i+1,
				data: data,
				sprite: this.player
			}
		}
		if(topRanker.length >= 3 && myRankData.rank) {
			break;
		}
	}

	goalAlert = this.alert.createGoalAlert(winner);
	rankingAlert = this.alert.createRankingAlert(topRanker);
	myRankAlert = this.alert.createYourRankAlert(myRankData);
	messageAlert = this.alert.createMessageAlert();

	deferred.then(function(){
		return that.alert.animate(goalAlert);
	}).then(function(){
		return that.alert.animate(rankingAlert);
	}).then(function(){
		return that.alert.animate(myRankAlert);
	}).then(function(){
		return that.alert.animate(messageAlert);
	});

	deferred.resolve();

};