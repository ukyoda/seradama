
Game.fn.updatePlayer = function(data){
	var id = data.id;
	var name = data.name;
	var position = {
		x:window.parseFloat(data.x, 10),
		y:window.parseFloat(data.y, 10)
	};
	var textureId = data.texture;
	var picture = data.picture;
	var userType = data.userType || "guest";
	var datatype = data.datatype || "object";
	var angle = window.parseFloat(data.angle, 10);
	var layer = this.playerLayer, filterVal=[], sprite;
	var i, length;
	if(data.delflag) {
		this.removePlayer(id);
		return null;
	}

	sprite = (function(){
		var img, canvas, ctx, texture;
		if(layer.hash[id]) {
			return layer.hash[id];
		}
		if(userType === "guest") {
			sprite = new PIXI.Sprite.fromFrame(textureId);
		} else {
			sprite = new PIXI.Sprite.fromFrame(textureId);

			canvas = document.createElement('canvas');
			ctx = canvas.getContext('2d');
			img = new Image();
			img.src=picture;
			img.onload = function(){
				canvas.width = img.width;canvas.height = img.height;
				ctx.drawImage(img, 0,0);
				$('body').append(canvas);
				texture = PIXI.Texture.fromCanvas(canvas);
				sprite.setTexture(texture);
			};
		}
		sprite.name = name;
		sprite.id = id;
		layer.addChild(sprite);
		layer.hash[id] = sprite;
		sprite.width=32;sprite.height=32;
		return sprite;
	}());

	//スプライト情報を更新
	sprite.position.set(position.x,position.y);
	sprite.anchor.set(0.5,0.5);
	sprite.rotation = angle;

	//自ボールの場合，プロパティに参照を追加
	if(datatype === "you") {
		this.player = sprite;
	}
	return sprite;

};