var pages = [];
var index ;
var connect = require('./emulate');

for(index=0;index<50; index++) {
	pages[index] = connect();
}
