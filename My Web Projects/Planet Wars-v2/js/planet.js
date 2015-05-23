define(function(require){

	var settings = require('settings'),
		Signal = require('libs/signals.min'),
		PIXI = require('libs/pixi.dev'),
		Ship = require('ship');

		function newSprite( frameId, x, y ){
			var sprite = PIXI.Sprite.fromFrame(frameId);
			sprite.pivot.x = (sprite.getBounds().width)/2;
			sprite.pivot.y = (sprite.getBounds().height)/2;
			sprite.scale.x = 0.5;
			sprite.scale.y = 0.5;
			sprite.x = x;
			sprite.y = y;
			sprite.visible = false;
			sprite.interactive = false;
			return sprite;
		}

	var Planet = function( game, player, id, x, y ){
		PIXI.DisplayObjectContainer.call(this);

		this.game = game;
		this.player = player;
		this.id = id;
		this.team = this.player ? this.player.team : "empty";
		this.planetType = this.player ? this.player.planetType : "emptyPlanet";
		this.creationInterval = null;
		this.shipsAutoCreated = 0;
		this.shipsContainer = new PIXI.DisplayObjectContainer();
		this.addChild(this.shipsContainer);
		this.shipsCount = 0;

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

		this.currentShape = this.addChild(newSprite('emptyPlanet.png', x, y));
		this.currentShape.setTexture(this.textures[this.planetType]);

		this.currentShape.pivot.x = this.currentShape.texture.width / 2;
		this.currentShape.pivot.y = this.currentShape.texture.height / 2;
		this.currentShape.visible = true;
		this.currentShape.interactive = true;

		this.touchMarker = PIXI.Sprite.fromFrame("img/touchMarker.png");
		this.touchMarker.pivot.x = (this.touchMarker.getBounds().width)/2;
		this.touchMarker.pivot.y = (this.touchMarker.getBounds().height)/2;
		this.touchMarker.scale.x = 0.5;
		this.touchMarker.scale.y = 0.5;
		this.touchMarker.x = x;
		this.touchMarker.y = y;
		this.touchMarker.alpha = 0;
		this.addChild( this.touchMarker );

		this.destinationMarker = PIXI.Sprite.fromFrame("img/destinationMarker.png");
		this.destinationMarker.pivot.x = (this.destinationMarker.getBounds().width)/2;
		this.destinationMarker.pivot.y = (this.destinationMarker.getBounds().height)/2;
		this.destinationMarker.scale.x = 0.5;
		this.destinationMarker.scale.y = 0.5;
		this.destinationMarker.x = x;
		this.destinationMarker.y = y;
		this.destinationMarker.alpha = 0;
		this.addChild( this.destinationMarker );

		this.shipsCountText = new PIXI.Text("", { font: 'bold 26px Arial', fill: '#ffffff', align: 'center', stroke: '#000000', strokeThickness: 2 });
		this.shipsCountText.x = x;
		this.shipsCountText.y = y;
		this.addChild(this.shipsCountText);

		this.rotateAnimation = new TweenMax(this.destinationMarker, 210, {regX: 50, regY:50, rotation: 360, repeat: -1, ease:Linear.easeNone});

		this.events = {
			onMouseDown: new Signal()
		};

		this.addListeners();
	};

	Planet.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Planet.prototype.addListeners = function(){
		var that = this;

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

	Planet.prototype.setProps = function( player ){
		this.player = player;
		this.team = player.team;
		this.planetType = player.planetType;
		this.currentShape.setTexture(this.textures[this.planetType]);
		this.currentShape.pivot.x = this.currentShape.texture.width / 2;
		this.currentShape.pivot.y = this.currentShape.texture.height / 2;
	};

	Planet.prototype.startCreatingShips = function(){
		if ( this.team === "empty" ) { return; }

		var that = this;
		this.creationInterval = setInterval(function(){
			if ( that.shipsAutoCreated < settings.maxNumOfShips) {
				that.createShip();
				that.shipsAutoCreated++;
			}
		}, 1000);
	};

	Planet.prototype.createShip = function(){
		var newShip = new Ship( this.player, this, this.game.getNewId, this.currentShape.x, this.currentShape.y );
		this.shipsContainer.addChild( newShip );

		var levels = [ 120, 150, 180 ],
			level = levels[Math.floor(Math.random() * levels.length)];

		TweenMax.to(newShip.shape.pivot, 0.5, {x: 0, y: level});

		this.shipsCount++;
		this.updateShipsCountText();
	};

	Planet.prototype.killAShip = function( ship ){
		if ( ship ) {
			this.shipsContainer.removeChild( ship );
		} else {
			this.shipsContainer.removeChildAt( 0 );
			this.shipsCount--;
			this.shipsAutoCreated--;
		}
		this.updateShipsCountText();
	};

	Planet.prototype.updateShipsCountText = function(){
		this.shipsCountText.setText( this.shipsCount.toString() );
		this.shipsCountText.updateTransform();
		var bounds = this.shipsCountText.getBounds();
		this.shipsCountText.pivot = new PIXI.Point(bounds.width / 2, bounds.height / 2);
	};

	Planet.prototype.sendShipsTo = function( destinationPlanet ){
		if ( this.shipsContainer.children.length === 0 || this.shipsCount === 0 ) { return; }

		var that = this,
			shipsToSend = this.shipsContainer.children.slice(0, this.shipsContainer.children.length);

		function send(){
			if ( shipsToSend.length > 0 ) {
				setTimeout(function(){
					var ship = shipsToSend.splice(0,1)[0];
					ship.sendTo( destinationPlanet );
					that.shipsCount--;
					that.shipsAutoCreated--;

					if ( that.shipsAutoCreated < 0 ) { that.shipsAutoCreated = 0; }
					if ( that.shipsCount < 0 ) { that.shipsCount = 0; }

					that.updateShipsCountText();
					send();
				}, 100);
			}
		}

		send();
	};

	return Planet;
});