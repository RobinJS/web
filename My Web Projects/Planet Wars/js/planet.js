define(function(){

	var config = require('config'),
		markers = require('markers'),
		arrow = require('destinationArrow');

	var Planet = function( id, team, size, color, x, y ){
		this.id = id;
		this.team = team;
		this.teamColor = color;
		this.size = size;
		this.color = color;
		this.x = x;
		this.y = y;
		this.isDestination = false;

		var thisPlanetShipsNum = 0;
		this.text = new createjs.Text(thisPlanetShipsNum, "20px Arial", "#0000ff");

		this.draw = function(){
			var graphics = new createjs.Graphics().beginFill(color).drawCircle(this.x, this.y, this.size, this.size);
			var shape = new createjs.Shape(graphics);

			graphics.regX = this.size / 2;
			graphics.regY = this.size / 2;

			this.text.regX = 10;
			this.text.regY = 10;
			this.text.x = this.x;
			this.text.y = this.y;

			shape.on('mousedown', function(e){
				config.clickedPlanet = this;

				arrow.setStartPosition( this.x, this.y );
				markers.placeTouchMarker(this.x, this.y);
				
				mainStage.addEventListener('stagemousemove', arrow.drawArrow);
			}.bind(this));

			shape.addEventListener('mouseover', function(e){
				if ( config.clickedPlanet === null || this.id === config.clickedPlanet.id ) return;

				config.destinationPlanet = this;
				markers.placeDestinationMarker(this.x, this.y);
			}.bind(this));

			shape.addEventListener('mouseout', function(e){
				// if ( !this.isDestination ) return;

				markers.removeDestinationMarker(this.x, this.y);
			}.bind(this));

			shape.on('pressup', function(){
				// this.isDestination = true;
				// thisPlanetShipsNum += config.clickedPlanet.getShipsNum();
				// this.text.text = thisPlanetShipsNum;
				
			}.bind(this));

				// checK for planet under cursor data
				// send points
				// countdown points
				// countup points

	    	mainStage.addChild(shape);
	    	mainStage.addChild(this.text);

	    	this.startCreatingShips();
		};

		this.startCreatingShips = function(){
			setTimeout(function(){
				if ( this.team !== 'empty' && thisPlanetShipsNum < 10 ) {
					thisPlanetShipsNum++;
					this.text.text = thisPlanetShipsNum;
				}

				this.startCreatingShips();
			}.bind(this), 1000);
		},

		this.getShipsNum = function(){
			return thisPlanetShipsNum;
		};

		this.updateShipsNum = function( num ){
			thisPlanetShipsNum += num;
			this.text.text = thisPlanetShipsNum;
		};

		this.setShipsNum = function( num ){
			if ( num < 0 ) return;

			thisPlanetShipsNum = num;
			this.text.text = thisPlanetShipsNum;
		};
		
	};

	return Planet;
});