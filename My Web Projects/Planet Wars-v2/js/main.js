require(["libs/pixi.dev", "libs/TweenMax.min", "stage", "settings", "game"],
	function( PIXI, TweenMax, stage, settings, Game ) {

	var loader = new PIXI.AssetLoader(settings.assets);
	loader.onComplete = function(){
		var game = new Game(stage);
		stage.addChild(game);
		stage.interactive = true;

		// game.events.assetsReady.addOnce(function(){
		// 	game.start();
		// });
	}
	
	loader.load();

	// to fix: move ships to planet b, then back to a, check shipsAutoCreated
	

	// create planes
	// set starting planet
	// set opponent(s) planets
	// start producing inhabitants
	// create functionality
	// create score and hud

	// window.planets = [
	// 	new Planet( 1, 'player', 30, "#ffffff", 70, 70),
	// 	new Planet( 2, 'empty', 30, "#C3C3C3", 200, 200),
	// 	new Planet( 3, 'opponent', 30, "#ff0000", 400, 400)
	// ];
		
	// planets.forEach(function(planet){
	// 	planet.draw();
	// });

	
	// function findDestinationPlanet( mouseX, mouseY ){
	// 	var destPlanet = false;
	// 	planets.forEach(function(planet){
	// 		if ( (mouseX >= (planet.x - planet.size) && mouseX <= (planet.x + planet.size)) && (mouseY >= (planet.y - planet.size) && mouseY <= (planet.y + planet.size)) ) {
	// 			destPlanet = planet;
	// 		}
	// 	});

	// 	return destPlanet;
	// }

	// mainStage.on('stagemouseup', function(e){
		
	// 	mainStage.removeEventListener('stagemousemove', arrow.drawArrow);
	// 	markers.removeTouchMarker();
	// 	markers.removeDestinationMarker();
	// 	config.line.graphics.clear();

	// 	if ( config.destinationPlanet = findDestinationPlanet( e.stageX, e.stageY ) ) {
			
	// 		window.newGroupOfShips = new Ships( config.clickedPlanet, config.destinationPlanet );
	// 		window.newGroupOfShips.sendShips();
	// 	}

	// 	config.clickedPlanet = null;
	// });


});