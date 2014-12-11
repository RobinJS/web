define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene'),
    	Stage = require('stage');

    var GameManager = function(){
    	var currentState = 'intro_splash';

    	this.mainStage = new Stage('mainCanvas');
    	this.gameScene = new GameScene(this.mainStage);

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