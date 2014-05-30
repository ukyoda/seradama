
module.exports = function(grunt){
	return {
		scripts: {
			"files": ['assets/**/*.js'],
			"tasks": ['smash:dev', 'copy:test']
		}
	};
};