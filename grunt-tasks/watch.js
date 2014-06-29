
module.exports = function(grunt){
	return {
		scripts: {
			"files": ['assets/**/*.js'],
			"tasks": ['smash:dev']
		},
		dist: {
			"files": ['dist/**/*.js'],
			"tasks": ['copy:test']
		}
	};
};