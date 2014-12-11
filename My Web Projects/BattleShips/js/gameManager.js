define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene');

    var GameManager = function(){
    	var that = this,
    		currentState = 'intro_splash';

    	this.gameScene = new GameScene();
    	this.mainStage = new createjs.Stage("mainCanvas");

		createjs.Ticker.addEventListener("tick", handleTick);
		// mainStage.enableMouseOver(10);

		function handleTick(event) {
			;;;console.log(1);
			that.mainStage.update();
		}

		switch( currentState ) {
	        case config.gameStates.INTRO_SPLASH:
	        	this.gameScene.showIntroSplash();
	        break;
	        case config.gameStates.ARRANGE_SHIPS:
	        	
	        break;
	        case config.gameStates.BATTLE:
	        	
	        break;
	        case config.gameStates.GAME_END:
	        	
	        break;
	   	}
    };
    
    return GameManager;
});