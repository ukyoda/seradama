
Game.fn.onRestrict = function(){
	var that = this;
	Game.dialog('#modal-restrict', "show", true);
	window.setTimeout(function(){
		that._socket.disconnect();
		window.location.href='/logout/twitter';
	},30*1000);
};