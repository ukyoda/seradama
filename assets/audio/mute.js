
GameAudio.fn.mute = function(){
	if(this.src.muted) {
		this.src.muted = false;
	} else {
		this.src.muted = true;
	}
};