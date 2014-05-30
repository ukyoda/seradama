module.exports = function(grunt) {
	var config = {};
	config.smash = require('./grunt-tasks/smash')(grunt);
	config.watch = require('./grunt-tasks/watch')(grunt);
	config.copy = require('./grunt-tasks/copy')(grunt);

	grunt.initConfig(config);
	grunt.loadNpmTasks("grunt-smash");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-copy");

	grunt.registerTask('dev', ['smash:dev', 'copy:test', 'watch']);
};