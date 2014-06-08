

GameAlert.fn.createMessageAlert = function(){
	var $layout = this.createLayout();
	var $content = $layout.find('.content');
	var $p = $('<div/>').appendTo($content);
	$p.text("1位目指して頑張ってください♪");
	return $layout;
};