define(function(){

	var settings = require('settings');
		// markers = require('markers'),
		// arrow = require('destinationArrow');

	var Planet = function( game, id, x, y ){
		// Phaser.Group.call(this, arguments);

		this.game = game;
		this.id = id;
		this.team = null;
		// this.isDestination = false;
		this.group = game.add.group();
		this.group.x = x;
		this.group.y = y;

		this.image = this.group.create( 0, 0, 'planetsAtlas', 'emptyPlanet.png');
		// this.add(this.image, true);
    	game.physics.enable(this.image, Phaser.Physics.ARCADE);
        // image.body.collideWorldBounds = true;
        // this.image.scale.x = 0.5;
        // this.image.scale.y = 0.5;
        // this.image.x = x;
        // this.image.y = y;
    	this.image.anchor.set(0.5, 0.5);
    	this.image.body.immovable = true;
    	this.image.inputEnabled = true;
        // this.group.add(this.image, true);

		// this.changeColor = function( color ){
		// 	this.shape.graphics.beginFill(color);
		// 	this.shape.graphics = new createjs.Graphics().beginFill(color).drawCircle(0, 0, this.scale, this.scale);
		// };
		this.shipsNum = 0;
		this.shipsNumText = new Phaser.Text(game, 0, 0, "0", { font: "40px Verdana", fill: "#ffffff", stroke: "#000000", strokeThickness: 3, align: "center" });
		this.shipsNumText.anchor.set(0.5, 0.5);
		this.group.add(this.shipsNumText);
		// this.container = new Phaser.Group(game, null, "planet", false, );
		
		// return this.container;

		this.touchMarker = new Phaser.Image(game, 0, 0, 'touchMarker');
		this.touchMarker.anchor.set(0.5, 0.5);
		this.touchMarker.visible = false;
		this.group.add(this.touchMarker);

		this.destinationMarker = new Phaser.Image(game, 0, 0, 'destinationMarker');
		this.destinationMarker.anchor.set(0.5, 0.5);
		this.destinationMarker.visible = false;
		this.group.add(this.destinationMarker);

		// this.destinationArrow = new Phaser.Line();
		this.destinationArrow = new Phaser.Graphics(game, this.group.x, this.group.y);
		this.destinationArrow.lineStyle(10, 0xffd900, 1);
		this.group.add(this.destinationArrow);

		this.events = {
			_inputUp: new Phaser.Signal(),
			_inputDown: new Phaser.Signal()
		};

		this.addListeners();
	};

	Planet.prototype.setTeam = function( team ){
		this.team = team;
	};

	Planet.prototype.changePlanet = function( type ){
		var texture = "";

		switch( type ){
			case "empty": texture = "emptyPlanet.png"; break;
		}

		this.image.loadTexture( 'planetsAtlas', texture);
	};

	// Planet.prototype = Object.create( Phaser.Group.prototype );
	
	// Planet.prototype.draw = function(){
	// 	// var graphics = new createjs.Graphics().beginFill(color).drawCircle(0, 0, this.scale, this.scale);
	// 	// this.shape = new createjs.Shape(graphics);
	// 	// this.shape.x = this.x;
	// 	// this.shape.y = this.y;

	// 	this.text.regX = 10;
	// 	this.text.regY = 10;
	// 	this.text.x = this.x;
	// 	this.text.y = this.y;

 //    	mainStage.addChild(this.shape);
 //    	mainStage.addChild(this.text);

 //    	this.addListeners();
 //    	this.startCreatingShips();
	// };

	Planet.prototype.addListeners = function(){
		this.image.events.onInputDown.add(function(e){
			if ( settings.clickedPlanet && settings.clickedPlanet.id !== this.id ) return; // in case of multitouch

			settings.clickedPlanet = this;

			// arrow.setStartPosition( this.x, this.y );
			// markers.placeTouchMarker(this.x, this.y);
			this.touchMarker.visible = true;
			this.events._inputDown.dispatch(this.group.x, this.group.y);
			// this.destinationArrow.moveTo(50,50);
			// this.destinationArrow.lineTo( this.game.input.activePointer.x, this.game.input.activePointer.y );
			
			// mainStage.addEventListener('stagemousemove', arrow.drawArrow);
		}, this);

		this.image.events.onInputOver.add(function(e){
			if ( settings.clickedPlanet === null || settings.clickedPlanet.id === this.id ) return;

			settings.destinationPlanet = this;
			this.destinationMarker.visible = true;
			// markers.placeDestinationMarker(this.x, this.y);
		}.bind(this));

		this.image.events.onInputUp.add(function(e){
			// if ( !this.isDestination ) return;

			// markers.removeDestinationMarker(this.x, this.y);
			settings.clickedPlanet = null;
			this.touchMarker.visible = false;
			this.destinationMarker.visible = false;
			this.events._inputUp.dispatch();
		}, this);

		this.image.events.onInputOut.add(function(e){

			this.destinationMarker.visible = false;
		}, this);

		// this.shape.on('pressup', function(){
		// 	// this.isDestination = true;
		// 	// thisPlanetShipsNum += settings.clickedPlanet.getShipsNum();
		// 	// this.text.text = thisPlanetShipsNum;
			
		// }.bind(this));
	};

	// Planet.prototype.startCreatingShips = function(){
	// 	setTimeout(function(){
	// 		if ( this.team !== 'empty' && thisPlanetShipsNum < 10 ) {
	// 			thisPlanetShipsNum++;
	// 			this.text.text = thisPlanetShipsNum;
	// 		}

	// 		this.startCreatingShips();
	// 	}.bind(this), 1000);
	// },

	// Planet.prototype.getShipsNum = function(){
	// 	return thisPlanetShipsNum;
	// };

	// Planet.prototype.updateShipsNum = function( num ){
	// 	thisPlanetShipsNum += num;
	// 	this.text.text = thisPlanetShipsNum;
	// };

	// Planet.prototype.setShipsNum = function( num ){
	// 	if ( num < 0 ) return;

	// 	thisPlanetShipsNum = num;
	// 	this.text.text = thisPlanetShipsNum;
	// };

	return Planet;
});