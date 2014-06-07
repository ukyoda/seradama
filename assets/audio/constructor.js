
var GameAudio = function Audio(audioData){
	this.deferred  = $.Deferred();
	this.src = audioData;
	var that = this;

	//イベントをAjaxで管理
	this.src.addEventListener('ended' , function(){
		that.deferred.resolve(that);
	});

};

GameAudio.fn = GameAudio.prototype;