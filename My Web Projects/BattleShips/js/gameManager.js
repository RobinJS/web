define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene'),
    	Stage = require('stage'),
    	PlayerField = require('playerField'),
    	OpponentField = require('opponentField');

    var GameManager = function(){
    	var currentState = 'arrange_ships',
    		winner = null,
    		playerTurn = 'player';

    	this.hitPosition = null;

    	this.mainStage = new Stage('mainCanvas');
    	this.gameScene = new GameScene(this.mainStage);
    	this.playerField = new PlayerField( this.mainStage );
    	this.opponentField = new OpponentField( this.mainStage );

    	this.gameScene.addGameOverSplash();

    /* gameScene listeners */
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

		this.gameScene.events.playAgain.add(function(){
			this.reset();
			this.gameScene.hideWinSplah();
			currentState = config.gameStates.ARRANGE_SHIPS;
			this.newState();
		}.bind(this));

		this.gameScene.events.tryToRotateShip.add(function(){
			this.playerField.tryToRotateShip();
		}.bind(this));
	/* end gameScene listeners */

	/* playerField listeners */
		this.playerField.events.emptySectorMarked.add(function(){
			this.switchPlayerTurn();
			this.newState();
		}.bind(this));

		this.playerField.events.fullSectorMarked.add(function(){
			currentState = config.gameStates.COMPUTERS_TURN;
			this.newState();
		}.bind(this));

		this.playerField.events.updateShipsRemainingText.add(function(){
			this.gameScene.infoHeader.updateShipsRemainingText( 'player' );
		}.bind(this));

		this.playerField.events.endGame.add(function(){
			winner = 'computer';
			currentState = config.gameStates.GAME_OVER;
			this.newState();
		}.bind(this));
	/* end playerField listeners */

	/* opponentField listeners */
		this.opponentField.events.positionToCheck.add(function( hitPosition ){
			this.opponentField.disableHitMarker();
			this.hitPosition = hitPosition;
			currentState = config.gameStates.CHECK_RESULT;
			this.newState();
		}.bind(this));

		this.opponentField.events.emptySectorMarked.add(function(){
			this.switchPlayerTurn();
			this.newState();
		}.bind(this));

		this.opponentField.events.fullSectorMarked.add(function(){
			currentState = config.gameStates.PLAYERS_TURN;
			this.newState();
		}.bind(this));

		this.opponentField.events.updateShipsRemainingText.add(function(){
			this.gameScene.infoHeader.updateShipsRemainingText( 'computer' );
		}.bind(this));

		this.opponentField.events.endGame.add(function(){
			winner = 'player';
			currentState = config.gameStates.GAME_OVER;
			this.newState();
		}.bind(this));
	/* end opponentField listeners */

		this.newState = function(){
			switch( currentState ) {
		        case config.gameStates.ARRANGE_SHIPS:
		        	this.gameScene.events.panelShown.addOnce(function(){
		        		this.playerField.enableShipsClick();
		        		this.gameScene.enableButtonsClick();
		        	}.bind(this));

		        	this.playerField.autoArrange();
		        	this.opponentField.autoArrange();
		        	this.gameScene.showArrangepanel();
		        break;
		        case config.gameStates.BATTLE:
		        	this.gameScene.hideArrangepanel();
		        break;
		        case config.gameStates.PLAYERS_TURN:
		        	this.gameScene.hideTurnLabel( playerTurn );
		        	playerTurn = 'player';
		        	this.gameScene.showTurnLabel( playerTurn );
		        	this.opponentField.enableHitMarker();
		        break;
		        case config.gameStates.COMPUTERS_TURN:
		        	this.opponentField.disableHitMarker();

		        	this.gameScene.hideTurnLabel( playerTurn );
		        	playerTurn = 'computer';
	        		this.gameScene.showTurnLabel( playerTurn );

	        		this.playerField.computersTurn();
		        break;
		        case config.gameStates.CHECK_RESULT:
		        	this.hitCheck();
		        break;
		        case config.gameStates.GAME_OVER:
		        	this.opponentField.disableHitMarker();
		        	this.gameScene.hideTurnLabel( playerTurn );
		        	this.saveResultInStorage();
		        	this.gameScene.showWinSplah( winner );
		        break;
		   	}
		};

		this.hitCheck = function () {
			if ( playerTurn === 'player' ) {
				this.opponentField.checkHittedSector( this.hitPosition );
			} else if ( playerTurn === 'computer' ) {
				this.playerField.checkHittedSector( this.hitPosition );
			}
		}.bind(this);

		this.switchPlayerTurn = function(){
			if ( playerTurn === 'player' ) {
				currentState = config.gameStates.COMPUTERS_TURN;
			} else if ( playerTurn === 'computer' ) {
				currentState = config.gameStates.PLAYERS_TURN;
			}
		}.bind(this);

		this.addRotationListeners = (function(){
			var that = this;
			this.playerField.ships.forEach(function( ship ){
				ship.events.lastClickedShip.add(function(ship){
					that.playerField.lastClickedShip = ship;
				}.bind(this, ship));
			});
		}.bind(this)());

		this.saveResultInStorage = function(){
			var currentPoints = sessionStorage[winner] !== undefined ? sessionStorage[winner] : 0;
			sessionStorage[winner] = parseInt(currentPoints) + 1;
		};

		this.reset = function(){
			this.opponentField.reset();
			this.playerField.reset();
			this.gameScene.reset();
		};

		this.newState();
    };
    
    return GameManager;
});