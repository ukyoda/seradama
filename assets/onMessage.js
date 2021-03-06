/**
 * サーバからデータを取得したとき
 */
Game.fn.onMessage = function(data) {
	if(!data){return;}
	var that = this;
	data.value.forEach(function(val, index){
		var datatype = val.datatype || 'object';

		//datatypeオーバーライド(特殊処理)

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
		case "ranking":
			that.congratulation(val);
			break;
		case "time":
			that.timeInfo.current = val.time;
			break;
		case "bestTime":
			that.timeInfo.best = val.time;
			that.timeInfo.bestPlayer = val.userName || "-";
			break;
		case "restrict":
		window.console.log('test');
			that.onRestrict();
		}
	});

};

