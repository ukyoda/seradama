
Game.fn.congratulation = (function(){
	//内部変数(表示状態管理)
	var displayFlg = false;

	//メッセージの基本レイアウト生成
	var createLayout = function(){
		var $div = $('<div/>');
		return $div.addClass("alert");
	};

	//ゴール通知
	var createGoalAlert = function(content){
		var $layout = createLayout();

		return $layout;
	};

	//ランキング通知
	var createRankingAlert = function(msg){
		var $layout = createLayout();

		return $layout;
	};

	//プレイヤーの順位表示
	var createYourRankAlert = function(msg){
		var $layout = createLayout();

		return $layout;
	};

	//システムから一言
	var createMessageAlert = function(msg){
		var $layout = createLayout();

		return $layout;
	};

	//表示
	var display = function(content) {
		$('body').append(content);
	};

	//クリア
	var hidden = function(){
		$('.alert').remove();
	};

	return function(sprite) {
		var $deferred = $.Deferred();



	};

}());