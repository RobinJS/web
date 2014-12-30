define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene'),
    	Stage = require('stage');

    var GameManager = function(){
    	var currentState = 'arrange_ships';
    	this.hitPosition = null;

    	this.mainStage = new Stage('mainCanvas');
    	this.gameScene = new GameScene(this.mainStage);

		this.gameScene.events.startGame.add(function(){
			currentState = config.gameStates.BATTLE;
			this.newState();
		}.bind(this));

		this.gameScene.events.panelHidden.add(function(){
			currentState = config.gameStates.PLAYERS_TURN;
			this.newState();
		}.bind(this));

		this.gameScene.opponentField.events.positionToCheck.add(function( hitPosition ){
			this.hitPosition = hitPosition;
			currentState = config.gameStates.CHECK_RESULT;
			this.newState();
		}.bind(this));

		this.newState = function(){
			switch( currentState ) {
		        case config.gameStates.ARRANGE_SHIPS:
		        	// add listeners
		        	// create functionality for drag, drop, rotate, free areas
		        	// animate scene hide
		        	this.gameScene.events.panelShown.addOnce(function(){
		        		this.gameScene.playerField.enableClick();
		        		this.gameScene.enableButtonsClick();
		        	}.bind(this));

		        	this.gameScene.showArrangepanel();
		        break;
		        case config.gameStates.BATTLE:

		        	this.gameScene.hideArrangepanel();
		        	// enable user interraction
		        	// decide which turn it is
		        break;
		        case config.gameStates.PLAYERS_TURN:
		        	// mark "your turn"
		        	this.gameScene.showTurnLabel('player');
		        	this.gameScene.enableHitMarker();
		        	// enable user interraction

		        break;
		        case config.gameStates.COMPUTERS_TURN:
		        	// enable user interraction
		        	this.gameScene.showTurnLabel('computer');
		        break;
		        case config.gameStates.CHECK_RESULT:
		        	// enable user interraction
		        	console.warn(this.hitPosition);
		        break;
		        case config.gameStates.GAME_END:
		        	
		        break;
		   	}
		};

		this.newState();
    };
    
    return GameManager;
});