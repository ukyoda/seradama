Game.dialog = (function(){
	var dialog = {};
	var setModal = function(){
		var $div = $('<div/>');
		$div.addClass('gracoro modal-overlay');
		$("body").append($div);
	};
	dialog.show = function(target){
		$(target).addClass('show');
	};

	dialog.hide = function(target){
		$('.gracoro.modal-overlay').remove();
		$(target).removeClass('show');
	};

	return function(target, key, modalFlg){
		if(modalFlg) {
			setModal();
		}
		if(typeof key === "string" && dialog[key]) {
			dialog[key](target);
		}
	};

}());