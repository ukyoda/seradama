(function(namespace){
var name = "srdm";

//オーディオオブジェクト読み込み
import "audio/";
//アラートメッセージ操作オブジェクト読み込み
import "alert/";
//プレイヤーオブジェクト
import "player/";

//コンストラクタ
import "constructor";

//オーディオファイル登録メソッド
import "setAudio";

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
import "setController";
//タッチコントローラ
import "touchcontroller/";
//加速度コントローラ
import "gravitycontroller/";

//プレイヤー関連
import "removePlayer";
import "updatePlayer";

//障害物関連
import "removeObject";
import "updateObject";

//アニメーション・描画
import "rescale";
import "animate";

//ゲームクリア時の処理
import "congratulation";

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