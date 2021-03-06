({
	conf: {},
	tutorial:{
		//画像の枚数分メッセージを表示して下さい。
		msgs:[
			"玉を転がしてゴールを目指せ",
			"スマホを傾けると玉が転がります",	//画像１番目のメッセージ
			"複数人で遊べます",
			"画面を固定して遊んでください",
			"ランキング上位を目指しましょう"
		],
		current:0,
		set: function(){
			$('.tutrial-img').attr('src', this.getImgUrl());
			$('.tutorial-page').text(this.getPageNo());
			$('#tutorial-msg').text(this.getMsg());
			return this;
		},
		begin: function(){
			this.current = 0;
			return this;
		},
		prev: function(){
			this.current = this.current < 1 ?this.msgs.length-1:--this.current;
			return this;
		},
		next: function(){
			this.current = this.current < (this.msgs.length-1) ?++this.current:0;
			return this;
		},
		getMsg: function(){
			return this.msgs[this.current];
		},
		getImgUrl: function(){
			return "/images/tutorial_" + (this.current+1) + ".png";
		},
		getPageNo: function(){
			return (this.current+1)+"/"+this.msgs.length;
		},
		init:function(){
			//画像読めなかったとき
			$('.tutrial-img').get(0).onload=function(){
				$(this).css('display', 'block');
			};
			//画像読めたとき
			$('.tutrial-img').get(0).onerror=function(){
				$(this).css('display', 'none');
			};
		}
	},
	init:function(){
		var that = this;
		var _tutorial = this.tutorial;
		$(function(){
			_tutorial.init();
			$('#tutorial-img').load(function(){});
			$('.start').click(function(e) {
				$('.login-page').show("slow");
				return false;
			});
			$('.login-page .fa-times').click(function(e) {
				$('.login-page').hide("slow");
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

			$('.tutrial').click(function(e) {
				e.preventDefault();
				$('.tutrial-page').show("slow");
				_tutorial.begin().set();
			});
			$('.tutrial-page .fa-times').click(function(e) {
				e.preventDefault();
				$('.tutrial-page').hide("slow");
				return false;
			});
			$('.leftallow').click(function(e) {
				e.preventDefault();
				_tutorial.prev().set();
			});
			$('.rightallow').click(function(e) {
				e.preventDefault();
				_tutorial.next().set();
			});
		});
	}
}).init();
