define(function(require){

	var settings = require('settings'),
		Signal = require('libs/signals.min'),
		PIXI = require('libs/pixi.dev'),
		Ship = require('ship');

		function newSprite( frameId, x, y ){
			var sprite = PIXI.Sprite.fromFrame(frameId);
			sprite.pivot.x = sprite.width/2;
			sprite.pivot.y = sprite.height/2;
			sprite.scale.x = 0.5;
			sprite.scale.y = 0.5;
			sprite.x = x;
			sprite.y = y;
			sprite.visible = false;
			sprite.interactive = false;
			return sprite;
		}

	var Planet = function( game, arrow, id, x, y, team, planetType ){
		PIXI.DisplayObjectContainer.call(this);

		this.game = game;
		this.arrow = arrow;
		this.id = id;
		this.team = team;
		this.planetType = planetType;
		this.creationInterval = null;
		this.shipsAutoCreated = 0;
		this.ships = [];
		// this.isDestination = false;

		// var thisPlanetShipsNum = 0;
		this.textures = {
			bluePlanet: new PIXI.Texture.fromFrame('bluePlanet.png'),
			emptyPlanet: new PIXI.Texture.fromFrame('emptyPlanet.png'),
			greenPlanet: new PIXI.Texture.fromFrame('greenPlanet.png'),
			orangePlanet: new PIXI.Texture.fromFrame('orangePlanet.png'),
			purplePlanet: new PIXI.Texture.fromFrame('purplePlanet.png'),
			redPlanet: new PIXI.Texture.fromFrame('redPlanet.png'),
			yellowPlanet: new PIXI.Texture.fromFrame('yellowPlanet.png')
		};

		this.currentShape =  this.addChild(newSprite('emptyPlanet.png', x, y));
		this.currentShape.setTexture(this.textures[this.planetType]);
		this.currentShape.visible = true;
		this.currentShape.interactive = true;

		this.touchMarker = PIXI.Sprite.fromFrame("img/touchMarker.png");
		this.touchMarker.pivot.x = this.touchMarker.width/2;
		this.touchMarker.pivot.y = this.touchMarker.height/2;
		this.touchMarker.scale.x = 0.5;
		this.touchMarker.scale.y = 0.5;
		this.touchMarker.x = x;
		this.touchMarker.y = y;
		this.touchMarker.alpha = 0;
		this.addChild( this.touchMarker );

		this.destinationMarker = PIXI.Sprite.fromFrame("img/destinationMarker.png");
		this.destinationMarker.pivot.x = this.destinationMarker.width/2;
		this.destinationMarker.pivot.y = this.destinationMarker.height/2;
		this.destinationMarker.scale.x = 0.5;
		this.destinationMarker.scale.y = 0.5;
		this.destinationMarker.x = x;
		this.destinationMarker.y = y;
		this.destinationMarker.alpha = 0;
		this.addChild( this.destinationMarker );

		this.shipsCount = new PIXI.Text("", { font: 'bold 26px Arial', fill: '#ffffff', align: 'center', stroke: '#000000', strokeThickness: 2 });
		this.shipsCount.x = x;
		this.shipsCount.y = y;
		this.addChild(this.shipsCount);

		this.rotateAnimation = new TweenMax(this.destinationMarker, 210, {regX: 50, regY:50, rotation: 360, repeat: -1, ease:Linear.easeNone});

		this.events = {
			onMouseDown: new Signal()
		};

		this.addListeners();
	};

	Planet.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Planet.prototype.addListeners = function(){
		var that = this;

	// this.currentShape.mousedown = function(){
		// 	that.arrow.setStartXY( that.currentShape.x, that.currentShape.y );
		// 	that.events.onMouseDown.dispatch();
			// settings.clickedPlanet = this;

			// arrow.setStartPosition( this.x, this.y );
			// markers.placeTouchMarker( this.x, this.y );
			
			// mainStage.addEventListener('stagemousemove', arrow.drawArrow);
		// };

		// this.currentShape.addEventListener('mouseover', function(e){
		// 	if ( settings.clickedPlanet === null || this.id === settings.clickedPlanet.id ) return;

		// 	// settings.destinationPlanet = this;
		// 	markers.placeDestinationMarker(this.x, this.y);
		// }.bind(this));

		// this.currentShape.addEventListener('mouseout', function(e){
		// 	// if ( !this.isDestination ) return;

		// 	markers.removeDestinationMarker(this.x, this.y);
		// }.bind(this));

		// this.currentShape.on('pressup', function(){
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

	Planet.prototype.setTeam = function( team, planetType ){
		this.team = team;
		this.planetType = planetType;
		this.currentShape.setTexture(this.textures[planetType]);
	};

	Planet.prototype.startCreatingShips = function( team, planetType ){
		if ( this.team === "empty" ) { return; }

		var that = this;
		this.creationInterval = setInterval(function(){
			if ( that.shipsAutoCreated < settings.maxNumOfShips) {
				var newShip = new Ship( that.team, that.planetType, that.currentShape.x, that.currentShape.y);
				that.game.addChild( newShip )
				that.ships.push( newShip );

				that.shipsAutoCreated++;
				that.updateShipsCount();


				// clearInterval(that.creationInterval);
			}
		}, 1000);
	};

	Planet.prototype.updateShipsCount = function(){
		this.shipsCount.setText( this.ships.length.toString() );
		this.shipsCount.updateTransform();
		var bounds = this.shipsCount.getBounds();
		this.shipsCount.pivot = new PIXI.Point(bounds.width / 2, bounds.height / 2);
	};

	Planet.prototype.sendShipsTo = function( destinationPlanet ){
		if ( this.ships.length === 0 ) { return; }

		var that = this,
			shipsToSend = this.ships.length;

		function send(){
			if ( shipsToSend > 0 ) {
				setTimeout(function(){
					var ship = that.ships.splice(0,1)[0];
					ship.sendTo( destinationPlanet );
					that.game.shipsInSpace.push( ship );
					that.shipsAutoCreated--;
					if ( that.shipsAutoCreated < 0 ) {
						that.shipsAutoCreated = 0;
					}
					that.updateShipsCount();
					shipsToSend--;
					send();
				}, 100);
			}
		}

		send();
	};

	Planet.prototype.addShip = function( team, planetType ){
		if ( this.team === "empty" ) {
			this.setTeam( team, planetType );
			this.startCreatingShips( team, planetType );
		}
		
		var ship = this.game.shipsInSpace.splice(0,1)[0];
		this.ships.push( ship );
		this.updateShipsCount();
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
		

	return Planet;
});