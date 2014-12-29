define(function (require) {
    "use strict";

    var config = require('config'),
    	GameScene = require('gameScene'),
    	Stage = require('stage');

    var GameManager = function(){
    	var currentState = 'arrange_ships';

    	this.mainStage = new Stage('mainCanvas');

    	this.gameScene = new GameScene(this.mainStage);

    	

    	this.arrangepanel = new createjs.Container();
    	this.arrangepanel.addChild(this.gameScene.arrangepanelBg, this.gameScene.arrangeLabel, this.gameScene.infoLabel, this.gameScene.startGameBtn.button, this.gameScene.autoArrangeBtn.button);

		// this.gameScene.playerField.ships.forEach(function(ship){
		// 	this.arrangepanel.addChild(ship.image);			
		// }.bind(this));

		this.mainStage.addChild(this.arrangepanel);

		this.gameScene.events.startGame.add(function(){
			currentState = config.gameStates.BATTLE;
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

		        	this.gameScene.showArrangepanel(this.arrangepanel);
		        break;
		        case config.gameStates.BATTLE:
		        	this.gameScene.hideArrangepanel( this.arrangepanel );
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

		
    };
    
    return GameManager;
});