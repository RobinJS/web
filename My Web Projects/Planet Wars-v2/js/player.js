define(function (require) {

	var settings = require('settings'),
		Signal = require('libs/signals.min'),
		PIXI = require('libs/pixi.dev');

	var Player = function( id, type, planetType ){
		PIXI.DisplayObjectContainer.call(this);

		this.id = id;
		this.type = type;
		this.planetType = planetType;
	};

	Player.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	
	return Player;
});