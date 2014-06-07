(function(namespace){
var name = "srdm";

//コンストラクタ
import "constructor";

//スタティックメソッド
import "static/getAgent";
import "static/getGravityDirection";
import "static/checkDeviceMotion";
import "static/scale";

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
import "setDeviceMotion";

//プレイヤー関連
import "removePlayer";
import "updatePlayer";

//障害物関連
import "removeObject";
import "updateObject";

//フィールド関連
import "createFieldChip";

//アニメーション・描画
import "rescale";
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