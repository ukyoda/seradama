module.exports = function(grunt) {
	var config = {};
	config.smash = require('./grunt-tasks/smash')(grunt);
	config.watch = require('./grunt-tasks/watch')(grunt);
	config.copy = require('./grunt-tasks/copy')(grunt);
	config.uglify = require('./grunt-tasks/uglify')(grunt);

	grunt.initConfig(config);
	grunt.loadNpmTasks("grunt-smash");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask('dev', ['smash:dev', 'copy:test', 'watch']);
	grunt.registerTask('default', ['smash:dev', 'uglify:build']);
	grunt.registerTask('debug', ['smash:dev', 'copy:test']);

};