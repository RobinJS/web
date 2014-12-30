define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene'),
    	Stage = require('stage'),
    	PlayerField = require('playerField'),
    	OpponentField = require('opponentField');

    var GameManager = function(){
    	var currentState = 'arrange_ships';
    	this.hitPosition = null;
    	this.playerTurn = 'player';

    	this.mainStage = new Stage('mainCanvas');
    	this.gameScene = new GameScene(this.mainStage);
    	this.opponentField = new OpponentField( this.mainStage );
    	this.playerField = new PlayerField( this.mainStage );

		this.gameScene.events.startGame.add(function(){
			currentState = config.gameStates.BATTLE;
			this.newState();
		}.bind(this));

		this.gameScene.events.panelHidden.add(function(){
			currentState = config.gameStates.PLAYERS_TURN;
			this.newState();
		}.bind(this));

		this.gameScene.opponentField.events.positionToCheck.add(function( hitPosition ){
			this.opponentField.disableHitMarker();
			this.hitPosition = hitPosition;
			currentState = config.gameStates.CHECK_RESULT;
			this.newState();
		}.bind(this));

		this.gameScene.opponentField.events.sectorMarked.add(function(){
			this.opponentField.enableHitMarker();
			this.switchPlayerTurn();
			this.newState();
		}.bind(this));

		// this.gameScene.playerField.events.sectorMarked.add(function(){
			
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
		        	this.gameScene.hideTurnLabel( this.playerTurn );
		        	this.playerTurn = 'player';
		        	this.gameScene.showTurnLabel( this.playerTurn );
		        	this.opponentField.enableHitMarker();
		        	// enable user interraction

		        break;
		        case config.gameStates.COMPUTERS_TURN:
		        	// enable user interraction
		        	this.gameScene.hideTurnLabel( this.playerTurn );
		        	this.playerTurn = 'computer';
		        	this.gameScene.showTurnLabel( this.playerTurn );
		        	this.gameScene.opponentField.makeTurn( this.gameScene.playerField.field );
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
				this.gameScene.opponentField.checkHittedSector( this.hitPosition );
			} else if ( this.playerTurn === 'computer' ) {
				this.gameScene.playerField.checkHittedSector( this.hitPosition );
			}
		}.bind(this);

		this.switchPlayerTurn = function(){
			if ( this.playerTurn === 'player' ) {
				currentState = config.gameStates.COMPUTERS_TURN;
			} else if ( this.playerTurn === 'computer' ) {
				currentState = config.gameStates.PLAYERS_TURN;
			}
		}.bind(this);

		this.newState();
    };
    
    return GameManager;
});