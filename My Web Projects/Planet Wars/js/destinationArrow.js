define(function(){

	var config = require('config');

	config.line = new createjs.Shape();

	mainStage.addChild(config.line);

	return {

		drawArrow: function(){
			config.line.graphics.clear();
			config.line.graphics.setStrokeStyle(3).beginStroke("#FFD800");
			config.line.graphics.moveTo(config.arrowStartX, config.arrowStartY);
			config.line.graphics.lineTo(event.x, event.y);
		},

		setStartPosition: function( x, y ){
			config.arrowStartX = x;
			config.arrowStartY = y;
		}
	}
});