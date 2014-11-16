require(["stage", "config", "markers", "destinationArrow", "singleShip", "ships", "planet" ],
	function( stage, config, markers, arrow, SingleShip, ships, Planet ) {

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
		var isDest = false;
		planets.forEach(function(planet){
			if ( (mouseX >= (planet.x - planet.size) && mouseX <= (planet.x + planet.size)) && (mouseY >= (planet.y - planet.size) && mouseY <= (planet.y + planet.size)) ) {
				isDest = true;
			}
		});

		return isDest;
	}

	mainStage.on('stagemouseup', function(e){
		config.clickedPlanet = null;
		mainStage.removeEventListener('stagemousemove', arrow.drawArrow);
		markers.removeTouchMarker();
		markers.removeDestinationMarker();

		if ( config.destinationPlanet === null ) {
			config.destinationPlanet.isDestination = findDestinationPlanet( e.stageX, e.stageY );

			if ( config.destinationPlanet.isDestination ) {
				ships.sendShips();
			}
		}

		config.line.graphics.clear();

	});


});