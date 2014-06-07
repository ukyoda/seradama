
Game.fn.setAudio = function(target){
	var audio = {};
	var that = this;

	$(target).find(".audio-file").each(function(){
		var val = $(this).get(0);
		var key = $(val).data().key;
		audio[key] = new GameAudio(val);
	});

	this.audio = audio;
	return this;
};