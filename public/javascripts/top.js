({
	conf:{
	},
	init:function(){
		$(function(){
			$('.start').click(function(e) {
				$('.login-page').show("slow");
				return false;
			});
			$('.login-page .fa-times').click(function(e) {
				$('.login-page').hide("slow");
				return false;
			});
			$('.tutrial').click(function(e) {
				$('.tutrial-page').show("slow");
				return false;
			});
			$('.tutrial-page .fa-times').click(function(e) {
				$('.tutrial-page').hide("slow");
				return false;
			});
			$('.guest').click(function(e) {
				if ($('.guestname').value == null) {
					$('.guestname').css("background-color","#ffffff");
					return false;
				}
				$('.login-index form').submit();
				return false;
			});
		});
	}
}).init();