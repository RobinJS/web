define(function (require) {

	var settings = require('settings'),
		Signal = require('libs/signals.min'),
		PIXI = require('libs/pixi.dev');

	var Player = function( id, team, planetType ){
		PIXI.DisplayObjectContainer.call(this);

		this.id = id;
		this.team = team;
		this.planetType = planetType;
		this.ships = [];
	};

	Player.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	
	return Player;
});