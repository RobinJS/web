require(["libs/pixi.dev", "libs/TweenMax.min", "settings", "game" ],
	function( PIXI, TweenMax, settings, Game ) {
	
	var loader = new PIXI.AssetLoader(settings.assets);
	loader.onComplete = function(){
		var game = new Game();

		game.events.elementsCreated.addOnce(function(){
			game.start();
		});

		game.createGameElements();

		
	}
	loader.load();
});