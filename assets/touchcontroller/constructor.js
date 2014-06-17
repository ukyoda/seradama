

var TouchController = function Controller (target){
	this.$el = $(target);
	this.el = this.$el.get(0);
	this.renderer = new PIXI.autoDetectRenderer(this.$el.width(), this.$el.height());
	this.stage = new PIXI.Stage(0xdddddd);
	this.$el.html(this.renderer.view);
	this.$canvas = this.$el.find('canvas');;
	this.$canvas.width(this.$el.width()).height(this.$el.height());
	this.touchFlg = false;
	this.marker = new PIXI.Graphics();
	//マーカー設定
	this.marker.beginFill();
	this.marker.drawCircle(0,0,10);
	this.marker.color = 0x111111;
	this.marker.endFill();
	this.stage.addChild(this.marker);

	//canvasサイズ
	this.size = {
		x: this.$canvas.width(),
		y: this.$canvas.height()
	};
	//原点座標
	this.origin = {
		x: this.$canvas.width()/2,
		y: this.$canvas.height()/2
	};
	//originからのレンジ
	this.range = {
		cx: [-this.origin.x, this.origin.x],
		cy: [-this.origin.y, this.origin.y],
		vx: [-5, 5],	//固定
		vy: [5, -5],	//固定
		scale: function(axis){
			var cx = this.cx, cy = this.cy;
			var vx = this.vx, vy = this.vy;
			if(axis==='x') {
				return (cx[1]-cx[0])/(vx[1]-vx[0]);
			} else {
				return (cy[1]-cy[0])/(vy[1]-vy[0]);
			}
		}
	};
	//canvasオフセット
	this.offset = {
		x: this.origin.x,
		y: this.origin.y,
		_size: this.size,
		set: function(x, y){
			this.x = this._size.x < x ? this._size.x:x;
			this.x = this.x < 0 ? 0:this.x;
			this.y = this._size.y < y ? this._size.y:y;
			this.y = this.y < 0 ? 0:this.y;
			return this;
		}
	};
	this.val = {
		x: 0,
		y: 0,
		set: function(x,y){
			this.x = x;
			this.y = y;
			return this;
		}
	};
	this.setEvent();

	this.animate();

};
TouchController.fn = TouchController.prototype;

namespace.TouchController = TouchController;