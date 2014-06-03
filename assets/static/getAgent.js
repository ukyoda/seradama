
Game.getAgent = (function(){
	var android = 'Android';
	var ios = 'iOS';
	var other = 'Other';

	var getAgent = function(){
		var agent = window.navigator.userAgent, ua = '';
		if(agent.search(/iPhone/) != -1) {
			ua = ios;
		} else if(agent.search(/iPad/) != -1) {
			ua = ios;
		} else if(agent.search(/Android/) != -1) {
			ua = android;
		} else {
			ua = other;
		}
		return ua;
	};
	getAgent.ios = ios;
	getAgent.android = android;
	getAgent.other = other;

	return getAgent;

}());