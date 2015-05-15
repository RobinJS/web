define(function (require) {
	var settings = require('settings'),
		PIXI = require('libs/pixi.dev');

	var DestinationArrow = function(){
		PIXI.DisplayObjectContainer.call(this);

		this.arrowStartX = 0;
		this.arrowStartY = 0;

		this.line = new PIXI.Graphics();
		this.addChild(this.line);
	};

	DestinationArrow.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	DestinationArrow.prototype.draw = function(event){
		this.line.clear();
		this.line.lineStyle(4, 0xffd900, 1);
		this.line.moveTo(this.arrowStartX, this.arrowStartY);
		this.line.lineTo(event.originalEvent.offsetX, event.originalEvent.offsetY);
		this.line.endFill();
	};

	DestinationArrow.prototype.setStartXY = function(x, y){
		this.arrowStartX = x;
		this.arrowStartY = y;
	};

	DestinationArrow.prototype.clear = function(){
		this.line.clear();
	};
	
	return DestinationArrow;
});