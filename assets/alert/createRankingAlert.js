
GameAlert.fn.createRankingAlert = function(rankers){
	var $layout = this.createLayout();
	var $content = $layout.find('.content');

	$('<div/>').text('★ランキング★').appendTo($content);

	var $ul = $('<ul/>').addClass('ranking').appendTo($content);
	//アイコンと名前を作成する関数
	var createImgView = function(name, img){
		var $div = $('<div/>');
		$div.addClass('grid name');
		$('<img/>').attr('src', img).appendTo($div);
		$('<span>').text('@'+name).appendTo($div);
		return $div;
	};

	$.each(rankers, function(index, data){
		var rank = data.rank;
		var count = data.data.win;
		var name = data.sprite.name || data.sprite.id;
		var img = data.sprite.img || "http://127.0.0.1/images/favicon.ico";
		var $li = $('<li/>');
		$('<div/>').addClass('grid rank').addClass(GameAlert.fn.setRankimg(rank)).text(rank).appendTo($li);
		createImgView(name, img).appendTo($li);
		$('<div/>').addClass('grid-right count').text(count).appendTo($li);
		$ul.append($li);
	});

	return $layout;

};
