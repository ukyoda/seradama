
GameAlert.fn.createGoalAlert = function(winner) {
	var $layout = this.createLayout();
	var $content = $layout.find('.content');
	var $p = $('<div/>').appendTo($content);
	var name = winner.name || 'Unknown';
	$p.text("@"+name+" さんがクリアしました");
	return $layout;
};