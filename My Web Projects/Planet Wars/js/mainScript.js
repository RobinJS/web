require(["stage", "config", "markers", "destinationArrow", "singleShip", "ships", "planet" ],
	function( stage, config, markers, arrow, SingleShip, Ships, Planet ) {

	// create planes
	// set starting planet
	// set opponent(s) planets
	// start producing inhabitants
	// create functionality
	// create score and hud

	window.planets = [
		new Planet( 1, 'player', 30, "#ffffff", 70, 70),
		new Planet( 2, 'empty', 30, "#C3C3C3", 200, 200),
		new Planet( 3, 'opponent', 30, "#ff0000", 400, 400)
	];
		
	planets.forEach(function(planet){
		planet.draw();
	});

	
	function findDestinationPlanet( mouseX, mouseY ){
		var destPlanet = false;
		planets.forEach(function(planet){
			if ( (mouseX >= (planet.x - planet.size) && mouseX <= (planet.x + planet.size)) && (mouseY >= (planet.y - planet.size) && mouseY <= (planet.y + planet.size)) ) {
				destPlanet = planet;
			}
		});

		return destPlanet;
	}

	mainStage.on('stagemouseup', function(e){
		
		mainStage.removeEventListener('stagemousemove', arrow.drawArrow);
		markers.removeTouchMarker();
		markers.removeDestinationMarker();
		config.line.graphics.clear();

		if ( config.destinationPlanet = findDestinationPlanet( e.stageX, e.stageY ) ) {
			
			window.newGroupOfShips = new Ships( config.clickedPlanet, config.destinationPlanet );
			window.newGroupOfShips.sendShips();
		}

		config.clickedPlanet = null;
	});


});