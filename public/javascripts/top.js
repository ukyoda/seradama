({
	conf:{
		msg:"aaaa, iiii, uuuu, eee",
		i:1,
		imax:2
	},
	init:function(){
		var _conf = this.conf;
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
			
			$('.leftallow').click(function(e) {
				if (_conf.i > 1) {
					_conf.i -= 1;
					this.tutorial(_conf.i);
					// $('.tutrial-img').attr('src', "/images/tutorial" + _conf.i + ".png");
					// $('#tutorial-msg').text(msg[_conf.i]);
				} else {
					_conf.i = _conf.imax;
					$('.tutrial-img').attr('src', "/images/tutorial" + _conf.i + ".png");
					$('#tutorial-msg').text(msg[_conf.i]);
				}
				return false;
			});
			$('.rightallow').click(function(e) {
				if (_conf.i < _conf.imax) {
				_conf.i += 1;
				$('.tutrial-img').attr('src', "/images/tutorial" + _conf.i + ".png");
				$('#tutorial-msg').text(msg[_conf.i]);
				} else {
					_conf.i = 1;
					$('.tutrial-img').attr('src', "/images/tutorial" + _conf.i + ".png");
				}
				return false;
			});
		});
	},
	tutorial:function(i) {
		$('.tutrial-img').attr('src', "/images/tutorial" + i + ".png");
		$('#tutorial-msg').text(this.conf.msg.split(",")[i]);
	}
}).init();