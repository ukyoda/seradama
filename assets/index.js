(function(namespace){
var name = "srdm";

//コンストラクタ
import "constructor";


//テクスチャロード
import "loadTexture";
import "onCompleteTexture";

//ゲームデータロード
import "loadGameData";
import "onCompleteGameData";

//Websocket関連処理
import "socketConnect";
import "onMessage";
import "onDisconnected";
import "emit";

//コントローラ
import "onController";

//プレイヤー操作
import "addPlayers";
import "setPlayer1";
import "removePlayer";
import "movePlayer";

//スプライト作成
import "createFieldChip";
import "createPlayer";

//アニメーション
import "animate";

//ゲームスタート
import "start";

namespace.Game = Game;

if(typeof define === "function" && define.amd){
	define(name,namespace);
} else if (typeof module === "object" && module.exports) {
	module.exports = namespace;
} else {
	this[name] = namespace;
}

}({}));