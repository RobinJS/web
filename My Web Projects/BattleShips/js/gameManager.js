define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene'),
    	Stage = require('stage');

    var GameManager = function(){
    	var currentState = 'arrange_ships';
    	this.hitPosition = null;
    	this.playerTurn = null;

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
			this.gameScene.disableHitMarker();
			this.hitPosition = hitPosition;
			currentState = config.gameStates.CHECK_RESULT;
			this.newState();
		}.bind(this));

		this.gameScene.opponentField.events.cellMarked.add(function(){
			this.gameScene.enableHitMarker();
		}.bind(this));

		// this.gameScene.playerField.events.cellMarked.add(function(){
			
		// }.bind(this));

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
		        	this.playerTurn = 'player';
		        	this.gameScene.showTurnLabel( this.playerTurn );
		        	this.gameScene.enableHitMarker();
		        	// enable user interraction

		        break;
		        case config.gameStates.COMPUTERS_TURN:
		        	// enable user interraction
		        	this.playerTurn = 'computer';
		        	this.gameScene.showTurnLabel( this.playerTurn );
		        break;
		        case config.gameStates.CHECK_RESULT:
		        	this.hitCheck();
		        	// enable user interraction

		        break;
		        case config.gameStates.GAME_END:
		        	
		        break;
		   	}
		};

		this.hitCheck = function () {
			if ( this.playerTurn === 'player' ) {
				this.gameScene.opponentField.checkHittedCell( this.hitPosition );
			} else if ( this.playerTurn === 'computer' ) {
				this.gameScene.playerField.checkHittedCell( this.hitPosition );
			}
		}.bind(this);

		this.newState();
    };
    
    return GameManager;
});