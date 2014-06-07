
GameAudio.fn.stop = function(){
	this.src.pause();
	this.src.load();
	return this;
};