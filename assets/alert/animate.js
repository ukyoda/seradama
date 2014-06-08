
GameAlert.fn.animate = function($content){
	var deferred = $.Deferred();
	//表示されている情報をまずはいったん削除
	this.hidden();
	//アラート表示
	this.display($content).css("display", "none");
	//アニメーション設定
	$content.slideToggle("slow",function(){
		$content.delay(1000).slideToggle("slow", function(){
			deferred.resolve();
			$content.remove();
		});
	});

	return deferred;

};