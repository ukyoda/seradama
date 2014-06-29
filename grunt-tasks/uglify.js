
module.exports = function(grunt){
	return {
		build:{
			files: {
				"public/javascripts/srdm.js": ["dist/srdm.js"],
				"public/javascripts/start.js": ["dist/start.js"],
				"public/javascripts/top.js": ["dist/top.js"]
			}
		}
	};
};