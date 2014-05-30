
module.exports = function(grunt){
	return {
		test: {
			files: [
				{
					expand: true,
					src: ['dist/**'],
					dest: 'public/javascripts/',
					isFile: true
				}
			]
		}
	};
};