define(function(require){

	var settings = require('settings'),
		Signal = require('libs/signals.min'),
		PIXI = require('libs/pixi.dev');

	var Planet = function( arrow, id, team, x, y ){
		PIXI.DisplayObjectContainer.call(this);

		this.arrow = arrow;
		this.id = id;
		this.team = team;
		this.size = 30;
		// this.isDestination = false;

		// var thisPlanetShipsNum = 0;
		this.shape = PIXI.Sprite.fromFrame("img/planetImage.png");
		this.shape.pivot.x = this.shape.width/2;
		this.shape.pivot.y = this.shape.height/2;
		this.shape.scale.x = 0.2;
		this.shape.scale.y = 0.2;
		this.shape.x = x;
		this.shape.y = y;
		this.shape.interactive = true;
		this.addChild( this.shape );

		this.touchMarker = PIXI.Sprite.fromFrame("img/touchMarker.png");
		this.touchMarker.pivot.x = this.touchMarker.width/2;
		this.touchMarker.pivot.y = this.touchMarker.height/2;
		this.touchMarker.x = x;
		this.touchMarker.y = y;
		this.touchMarker.alpha = 0;
		this.addChild( this.touchMarker );

		this.destinationMarker = PIXI.Sprite.fromFrame("img/destinationMarker.png");
		this.destinationMarker.pivot.x = this.destinationMarker.width/2;
		this.destinationMarker.pivot.y = this.destinationMarker.height/2;
		this.destinationMarker.x = x;
		this.destinationMarker.y = y;
		this.destinationMarker.alpha = 0;
		this.addChild( this.destinationMarker );

		this.rotateAnimation = new TweenMax(this.destinationMarker, 180, {regX: 50, regY:50, rotation: 360, repeat: -1, ease:Linear.easeNone});

		this.events = {
			onMouseDown: new Signal()
		};

		this.addListeners();
	};

	Planet.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Planet.prototype.addListeners = function(){
		var that = this;

		// this.shape.mousedown = function(){
		// 	that.arrow.setStartXY( that.shape.x, that.shape.y );
		// 	that.events.onMouseDown.dispatch();
			// settings.clickedPlanet = this;

			// arrow.setStartPosition( this.x, this.y );
			// markers.placeTouchMarker( this.x, this.y );
			
			// mainStage.addEventListener('stagemousemove', arrow.drawArrow);
		// };

		// this.shape.addEventListener('mouseover', function(e){
		// 	if ( settings.clickedPlanet === null || this.id === settings.clickedPlanet.id ) return;

		// 	// settings.destinationPlanet = this;
		// 	markers.placeDestinationMarker(this.x, this.y);
		// }.bind(this));

		// this.shape.addEventListener('mouseout', function(e){
		// 	// if ( !this.isDestination ) return;

		// 	markers.removeDestinationMarker(this.x, this.y);
		// }.bind(this));

		// this.shape.on('pressup', function(){
		// 	// this.isDestination = true;
		// 	// thisPlanetShipsNum += settings.clickedPlanet.getShipsNum();
		// 	// this.text.text = thisPlanetShipsNum;
			
		// }.bind(this));
	};

	Planet.prototype.showTouchMarker = function(){
		this.touchMarker.alpha = 1;
	};

	Planet.prototype.hideTouchMarker = function(){
		this.touchMarker.alpha = 0;
	};

	Planet.prototype.showDestinationMarker = function(){
		this.destinationMarker.alpha = 1;
		this.rotateAnimation.play();
	};

	Planet.prototype.hideDestinationMarker = function(){
		this.destinationMarker.alpha = 0;
		this.rotateAnimation.pause();
	};

		// this.startCreatingShips = function(){
		// 	setTimeout(function(){
		// 		if ( this.team !== 'empty' && thisPlanetShipsNum < 10 ) {
		// 			thisPlanetShipsNum++;
		// 			this.text.text = thisPlanetShipsNum;
		// 		}

		// 		this.startCreatingShips();
		// 	}.bind(this), 1000);
		// },

		// this.getShipsNum = function(){
		// 	return thisPlanetShipsNum;
		// };

		// this.updateShipsNum = function( num ){
		// 	thisPlanetShipsNum += num;
		// 	this.text.text = thisPlanetShipsNum;
		// };

		// this.setShipsNum = function( num ){
		// 	if ( num < 0 ) return;

		// 	thisPlanetShipsNum = num;
		// 	this.text.text = thisPlanetShipsNum;
		// };

		// this.changeColor = function( color ){
		// 	this.shape.graphics.beginFill(color);
		// 	this.shape.graphics = new createjs.Graphics().beginFill(color).drawCircle(0, 0, this.size, this.size);
		// };
		

	return Planet;
});