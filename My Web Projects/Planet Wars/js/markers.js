define(function(){
	var config = require('config');

	var destinationMarkerAnimIsLooping = false;

	config.touchMarker = new createjs.Bitmap("./img/touchMarker.png");
	config.touchMarker.regX = 100 / 2;
	config.touchMarker.regY = 100 / 2;
	config.touchMarker.visible = false;
	config.destinationMarker = new createjs.Bitmap("./img/destinationMarker.png");
	config.destinationMarker.regX = 100 / 2;
	config.destinationMarker.regY = 100 / 2;
	config.destinationMarker.visible = false;

	mainStage.addChild(config.touchMarker);
	mainStage.addChild(config.destinationMarker);

	var anim = new TweenMax(config.destinationMarker, 5, {regX: 50, regY:50, rotation: 360, repeat: -1, ease:Linear.easeNone});

	return {
		placeTouchMarker: function( x, y ) {
			config.touchMarker.x = x;
			config.touchMarker.y = y;
			config.touchMarker.regX = 100 / 2;
			config.touchMarker.regY = 100 / 2;
			config.touchMarker.visible = true;
		},

		removeTouchMarker: function(){
			config.touchMarker.visible = false;
		},

		placeDestinationMarker: function( x, y ) {
			config.destinationMarker.x = x;
			config.destinationMarker.y = y;
			config.destinationMarker.visible = true;

			destinationMarkerAnimIsLooping = true;
			this.animateDestinationMarker();
		},

		animateDestinationMarker: function () {
			if ( !destinationMarkerAnimIsLooping ) return;

			anim.play();
		},

		removeDestinationMarker: function(){
			config.destinationMarker.visible = false;
			destinationMarkerAnimIsLooping = false;
			anim.pause();
		}
	}
});