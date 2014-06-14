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
				if ($('.guestname').val() == "") {
					$('.guestname').css("background-color","pink");
					return true;
				}
				$('.login-index form').submit();
				return false;
			});
		});
	}
}).init();