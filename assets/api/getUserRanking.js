
GameApi.fn.getUserRanking = function(){
	return $.ajax({
		url:this.userRanking,
		dataType: "json",
		type: "get"
	});
};