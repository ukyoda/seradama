
GameAlert.fn.createRankingALert = function(players){
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

	$.each(players, function(index, data){
		var $li = $('<li/>');
		$('<div/>').addClass('grid rank').text(index+1).appendTo($li);
		createImgView(data.name, data.img).appendTo($li);
		$('<div/>').addClass('grid-right count').text(data.count).appendTo($li);
		$ul.append($li);
	});

	return $layout;

};
