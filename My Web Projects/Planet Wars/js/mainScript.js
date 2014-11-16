require(["stage", "config", "markers", "destinationArrow", "singleShip", "ships", "planet" ],
	function( stage, config, markers, arrow, SingleShip, Ships, Planet ) {

	// create planes
	// set starting planet
	// set opponent(s) planets
	// start producing inhabitants
	// create functionality
	// create score and hud

	var planets = [
		new Planet( 1, 'player', 30, "#ffffff", 70, 70),
		new Planet( 2, 'opponent', 30, "#ff0000", 400, 400),
		new Planet( 3, 'empty', 30, "#C3C3C3", 200, 200)
	];
		
	planets.forEach(function(planet){
		planet.draw();
	});

	
	function findDestinationPlanet( mouseX, mouseY ){
		var isDest = {};
		planets.forEach(function(planet){
			if ( (mouseX >= (planet.x - planet.size) && mouseX <= (planet.x + planet.size)) && (mouseY >= (planet.y - planet.size) && mouseY <= (planet.y + planet.size)) ) {
				isDest = planet;
			}
		});

		return isDest;
	}

	mainStage.on('stagemouseup', function(e){
		
		mainStage.removeEventListener('stagemousemove', arrow.drawArrow);
		markers.removeTouchMarker();
		markers.removeDestinationMarker();
		config.line.graphics.clear();

		if ( config.destinationPlanet === null ) {
			config.destinationPlanet = findDestinationPlanet( e.stageX, e.stageY );
			var ships = new Ships( config.clickedPlanet, config.destinationPlanet );
			ships.sendShips();
		}

		config.clickedPlanet = null;
	});


});