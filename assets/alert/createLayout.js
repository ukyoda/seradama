

GameAlert.fn.createLayout = function() {
	var $div = $('<div/>');
	//コンテント追加
	$('<div/>').addClass('content').appendTo($div);
	return $div.addClass("alert");
};