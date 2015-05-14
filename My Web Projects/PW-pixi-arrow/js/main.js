require(["libs/pixi.dev", "libs/TweenMax.min", "settings", "stage", "game" ],
	function( PIXI, TweenMax, settings, stage, Game ) {
	
	var loader = new PIXI.AssetLoader(settings.assets);
	loader.onComplete = function(){
		var game = new Game(stage);
		stage.addChild(game);
		stage.interactive = true;

		game.events.elementsCreated.addOnce(function(){
			game.start();
		});

		game.createGameElements();
	}
	
	loader.load();
});