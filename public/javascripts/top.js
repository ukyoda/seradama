({
	conf:{
	},
	init:function(){
		$(function(){
			$('.start').click(function(e) {
				$('.login-page').show("slow");
				return false;
			});
			$('.fa-times').click(function(e) {
				$('.login-page').hide("slow");
				return false;
			});
		});
	}
}).init();