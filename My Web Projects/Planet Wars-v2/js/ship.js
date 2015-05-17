define(function (require) {
	var settings = require('settings'),
		Signal = require('libs/signals.min'),
		PIXI = require('libs/pixi.dev');

	var Ship = function( team, planetType, x, y ){
		PIXI.DisplayObjectContainer.call(this);

		this.team = team;
		this.planetType = planetType;
		// this.x = x;
		// this.y = y;

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

		this.moveAnimation = new TimelineMax();

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

	Ship.prototype.sendTo = function( destinationPlanet ){
		var that = this;
		this.circleAnimation.pause();

		var speed = 1,
			// destinationX = (distance / (this.parent.currentShape.width/2)) * this.shape.x,
			// destinationY = (distance / (this.parent.currentShape.width/2)) * this.shape.y;
			// destinationX = x + ( (this.parent.currentShape.width/2) * Math.cos(2 * Math.PI) ),
			// destinationY = y + ( (this.parent.currentShape.width/2) * Math.sin(2 * Math.PI) ),
			// shipX = Math.sqrt( Math.pow(this.shape.x - x, 2) + Math.pow(this.shape.y - y, 2) ),
			// shipY = Math.sqrt( Math.pow(this.shape.x - x, 2) + Math.pow(this.shape.y - y, 2) ),
			distance = Math.sqrt( Math.pow(this.shape.x - destinationPlanet.currentShape.x, 2) + Math.pow(this.shape.y - destinationPlanet.currentShape.y, 2) ),
			duration = (distance / 100) / speed;


		// this.shape.pivot.x = this.shape.width/2;
		// this.shape.pivot.y = this.shape.height/2;


		this.moveAnimation.to( this.shape, duration, {x: destinationPlanet.currentShape.x, y: destinationPlanet.currentShape.y, ease:Linear.easeNone} );

		TweenMax.to( this.shape.pivot, duration, {x: this.shape.width/2, y: this.shape.width/2, ease: Sine.easeInOut, onComplete: function(){
			destinationPlanet.addShip( that.team, that.planetType );
			TweenMax.to( that.shape.pivot, 0.5, {x: 0, y: 180});
			that.circleAnimation.play();
			// that.parent.removeChild(that);
			// delete that;
		}});
	};

	return Ship;
});