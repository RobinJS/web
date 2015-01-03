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
    	this.playerField = new PlayerField( this.mainStage );
    	this.opponentField = new OpponentField( this.mainStage );

    	this.gameScene.events.playerAutoArrange.add(function(){
			this.playerField.autoArrange();
		}.bind(this));

		this.gameScene.events.startGame.add(function(){
			this.playerField.disableShipsClick();
			currentState = config.gameStates.BATTLE;
			this.newState();
		}.bind(this));

		this.gameScene.events.panelHidden.add(function(){
			currentState = config.gameStates.PLAYERS_TURN;
			this.newState();
		}.bind(this));

		this.opponentField.events.positionToCheck.add(function( hitPosition ){
			this.opponentField.disableHitMarker();
			this.hitPosition = hitPosition;
			currentState = config.gameStates.CHECK_RESULT;
			this.newState();
		}.bind(this));

		this.opponentField.events.emptySectorMarked.add(function(){
			// this.opponentField.enableHitMarker();
			this.switchPlayerTurn();
			this.newState();
		}.bind(this));

		this.opponentField.events.fullSectorMarked.add(function(){
			// if ( this.playerTurn === 'player' ) {
				currentState = config.gameStates.PLAYERS_TURN;
			// } else if ( this.playerTurn === 'computer' ) {
			// 	currentState = config.gameStates.COMPUTERS_TURN;
			// }

			this.newState();
		}.bind(this));

		this.playerField.events.emptySectorMarked.add(function(){
			setTimeout(function(){
				this.switchPlayerTurn();
				this.newState();
			}.bind(this), 500);
			// this.opponentField.enableHitMarker();
		}.bind(this));

		this.playerField.events.fullSectorMarked.add(function(){
			// if ( this.playerTurn === 'player' ) {
			// 	currentState = config.gameStates.PLAYERS_TURN;
			// } else if ( this.playerTurn === 'computer' ) {
				currentState = config.gameStates.COMPUTERS_TURN;
			// }

			this.newState();
		}.bind(this));

		this.playerField.events.updateShipsRemainingText.add(function(){
			this.gameScene.infoHeader.updateShipsRemainingText( 'player' );
		}.bind(this));

		this.opponentField.events.updateShipsRemainingText.add(function(){
			this.gameScene.infoHeader.updateShipsRemainingText( 'computer' );
		}.bind(this));

		this.playerField.events.endGame.add(function(){
			currentState = config.gameStates.GAME_END;
			this.newState();
		}.bind(this));

		this.opponentField.events.endGame.add(function(){
			currentState = config.gameStates.GAME_END;
			this.newState();
		}.bind(this));

		this.newState = function(){
			switch( currentState ) {
		        case config.gameStates.ARRANGE_SHIPS:
		        	// add listeners
		        	// create functionality for drag, drop, rotate, free areas
		        	// animate scene hide

		        	// reset marks, etc...
		        	console.warn('reset');

		        	this.gameScene.events.panelShown.addOnce(function(){
		        		this.playerField.enableShipsClick();
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
		        	setTimeout(function(){
			        	this.gameScene.hideTurnLabel( this.playerTurn );
			        	this.playerTurn = 'computer';
		        		this.gameScene.showTurnLabel( this.playerTurn );
		        	}.bind(this), 500);

		        	setTimeout(function(){
		        		this.playerField.computersTurn();
		        	}.bind(this), 1500);
		        break;
		        case config.gameStates.CHECK_RESULT:
		        	this.hitCheck();
		        	// enable user interraction

		        break;
		        case config.gameStates.GAME_END:
		        	// alert("Game Over. The winner is... Start new Game");
		        	// disable use interaction of field
		        break;
		   	}
		};

		this.hitCheck = function () {
			if ( this.playerTurn === 'player' ) {
				this.opponentField.checkHittedSector( this.hitPosition );
			} else if ( this.playerTurn === 'computer' ) {
				this.playerField.checkHittedSector( this.hitPosition );
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