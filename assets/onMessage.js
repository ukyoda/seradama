/**
 * サーバからデータを取得したとき
 */

Game.fn.onMessage = function(data) {
	var that = this;
	data.value.forEach(function(val, index){
		var datatype = val.datatype;

		//datatypeオーバーライド(特殊処理)
		if(val.texture === "player_1_1.png") {
			val.datatype = datatype = "you";
		} else if(val.texture.search(/player/) !== -1) {
			val.datatype = datatype = "player";
		} else {
			val.datatype = datatype = "object";
		}

		switch(datatype) {
		case "object": //障害物情報
			that.updateObject(val);
			break;
		case "you": //自プレイヤー情報
			that.updatePlayer(val);
			break;
		case "player": //プレイヤー情報
			that.updatePlayer(val);
			break;
		}
	});

};

