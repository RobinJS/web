define(function(){
	var config = require('config'),
		SingleShip = require('singleShip');
	
	var Ships = function( startPlanet, destinationPlanet ){
		this.startPlanet = startPlanet;
		this.destinationPlanet = destinationPlanet;
		this.ships = {};
	};

	$.extend(Ships.prototype, {
		sendShips: function() {
			this.createShipsToSend();

			this.ships.forEach(function(ship){
				ship.send();
			});

			this.animateShips(function(){
				config.destinationPlanet.updateShipsNum( config.clickedPlanet.getShipsNum() );
				config.clickedPlanet.setShipsNum( 0 );
				config.clickedPlanet = null;
				config.destinationPlanet = null;
			});
		},

		createShipsToSend: function(){
			var shipsToSendNum = config.clickedPlanet.getShipsNum();
			for (var i = 0; i < shipsToSendNum; i++) {
				this.ships.push(new SingleShip( config.clickedPlanet, config.destinationPlanet ));
			}
		},

		animateShips: function( callback ){
			var idx = 0;

			

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
	});

	return Ships;
});