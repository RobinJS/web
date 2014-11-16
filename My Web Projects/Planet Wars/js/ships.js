define(function(){
	var config = require('config'),
		SingleShip = require('singleShip');
	
	var ships = [];

	return {
		sendShips: function() {
			this.animateShips(function(){
				config.destinationPlanet.updateShipsNum( config.clickedPlanet.getShipsNum() );
				config.clickedPlanet.setShipsNum( 0 );
				config.clickedPlanet = null;
				config.destinationPlanet = null;
			});
		},

		animateShips: function( callback ){
			var shipsToSendNum = config.clickedPlanet.getShipsNum();
			var idx = 0;

			for (var i = 0; i < shipsToSendNum; i++) {
				ships.push(new SingleShip( config.clickedPlanet, config.destinationPlanet ));
			}

			function loop(){
				if ( idx >= ships.length ) return;

				setTimeout(function(){
					ships[idx].move();
					idx++;
					loop();
				}, 500);
			}

			loop();
		}
	}
});