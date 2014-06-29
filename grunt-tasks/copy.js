
module.exports = function(grunt){
	return {
		test: {
			files: [{
				expand: true,
				cwd: "dist/",
				src: ['srdm.js', 'top.js', 'start.js'],
				dest: 'public/javascripts/',
				isFile: true
			}]
		}
	};
};