var express = require('express');
var fieldRouter = express.Router();

//API関連
module.exports = function(gameInfoData){

	var field = fieldRouter.get('/', function(req, res){
		var json = require('../stage/stage'+gameInfoData.fieldNo+".json");

		req.accepts('json, text');
		res.set({
			'Content-Type':'application/json;utf-8',
		});
		res.send(json);
	});

	return {
		field: field
	};

};