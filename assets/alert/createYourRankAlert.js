
GameAlert.fn.createYourRankAlert = function(rankData){
	var $layout = this.createLayout();
	var $content = $layout.find('.content');
	var name = rankData.sprite.name || rankData.sprite.id;
	var img = rankData.sprite.img || "http://127.0.0.1/images/favicon.ico";
	var rank = rankData.rank;
	var count = rankData.data.win;

	$('<div/>').text('★あなたの順位★').appendTo($content);

	var $ul = $('<ul/>').addClass('ranking').appendTo($content);
	//アイコンと名前を作成する関数
	var createImgView = function(name, img){
		var $div = $('<div/>');
		$div.addClass('grid name');
		$('<img/>').attr('src', img).appendTo($div);
		$('<span>').text('@'+name).appendTo($div);
		return $div;
	};

	var $li = $('<li/>');
	$('<div/>').addClass('grid rank').text(rank).appendTo($li);
	createImgView(name, img).appendTo($li);
	$('<div/>').addClass('grid-right count').text(count).appendTo($li);
	$ul.append($li);

	return $layout;

};
