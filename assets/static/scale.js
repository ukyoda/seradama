Game.scale = function(){
	var value = {};
	value.domain = [0,1];
	value.range = [0,1];

	var rescale = function(val){
		var domain = value.domain;
		var range = value.range;
		var a = (range[0]-range[1]) / (domain[0]-domain[1]);
		var b = range[0] - a*domain[0];
		return a*val + b;
	};


	rescale.domain = function(distribution) {
		value.domain = distribution;
		return rescale;
	};

	rescale.range = function(distribution) {
		value.range = distribution;
		return rescale;
	};

	return rescale;

};