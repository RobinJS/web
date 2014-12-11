define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene'),
    	Stage = require('stage'),
    	Button = require('button');

    var GameManager = function(){
    	var currentState = 'arrange_ships';

    	this.mainStage = new Stage('mainCanvas');
    	this.gameScene = new GameScene(this.mainStage);
    	this.startGameBtn = new Button(750, 650, 790, 665, "START GAME");
    	this.mainStage.addChild(this.startGameBtn);

		switch( currentState ) {
	        case config.gameStates.ARRANGE_SHIPS:
	        	// animate right side down
	        	// add listeners
	        	// create functionality for drag, drop, rotate, free areas
	        	// animate scene hide
	        	this.gameScene.showArrangePannel();
	        break;
	        case config.gameStates.BATTLE:
	        	// enable user interraction
	        	// decide which turn it is
	        break;
	        case config.gameStates.PLAYERS_TURN:
	        	// enable user interraction
	        break;
	        case config.gameStates.COMPUTERS_TURN:
	        	// enable user interraction
	        break;
	        case config.gameStates.CHECK_RESULT:
	        	// enable user interraction
	        break;
	        case config.gameStates.GAME_END:
	        	
	        break;
	   	}
    };
    
    return GameManager;
});