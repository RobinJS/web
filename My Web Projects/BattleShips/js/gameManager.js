define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene'),
    	Stage = require('stage');

    var GameManager = function(){
    	var currentState = 'arrange_ships';

    	this.mainStage = new Stage('mainCanvas');
    	this.gameScene = new GameScene(this.mainStage);

		switch( currentState ) {
	        case config.gameStates.ARRANGE_SHIPS:
	        	// animate right side down
	        	// add listeners
	        	// create functionality for drag, drop, rotate, free areas
	        	// animate scene hide
	        break;
	        case config.gameStates.BATTLE:
	        	
	        break;
	        case config.gameStates.GAME_END:
	        	
	        break;
	   	}
    };
    
    return GameManager;
});