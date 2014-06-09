

GameApi.fn.getRanking = function(){
	return $.ajax({
		url:this.ranking,
		dataType: "json",
		type: "get"
	});
};