define(function(){
	var settings = require('settings'),
		Signal = require('libs/signals.min'),
		PIXI = require('libs/pixi.dev');

	var Ship = function( planetType, x, y ){
		PIXI.DisplayObjectContainer.call(this);

		this.shape = PIXI.Sprite.fromFrame(planetType + 'Ship.png');
		this.shape.pivot.x = 0;
		this.shape.pivot.y = 180;
		this.shape.scale.x = 0.5;
		this.shape.scale.y = 0.5;
		this.shape.x = x;
		this.shape.y = y;
		this.shape.visible = true;
		this.shape.interactive = false;
		this.addChild(this.shape);

		var speeds = [ 150, 180, 210 ],
			speed = speeds[Math.floor(Math.random() * speeds.length)];

		this.circleAnimation = new TweenMax(this.shape, speed, { rotation: 360, repeat: -1, ease:Linear.easeNone});
		this.circleAnimation.play();

		// var team = homePlanet.team;
		// var color = homePlanet.teamColor;
		// var graphics = new createjs.Graphics().beginFill(color).drawCircle(0, 0, 5, 5);
		// var shape = new createjs.Shape(graphics);

		// graphics.regX = 5 / 2;
		// graphics.regY = 5 / 2;
		// graphics.x = homePlanet.x;
		// graphics.y = homePlanet.y;

  //   	mainStage.addChild(shape);

		// this.send = function(){
		// 	homePlanet.setShipsNum( homePlanet.getShipsNum() - 1);
		// 	TweenMax.fromTo( shape, 5, { x: homePlanet.x, y: homePlanet.y }, { x: destinationPlanet.x, y: destinationPlanet.y, ease:Linear.easeNone, onComplete: function(){
		// 		destinationPlanet.updateShipsNum(1);
		// 		destinationPlanet.team = homePlanet.team;
		// 		destinationPlanet.changeColor(homePlanet.color);
		// 		mainStage.removeChild(shape);
		// 	}});
		// };
	};

	Ship.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	return Ship;
});