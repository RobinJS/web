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

    	this.startGameBtn = new Button(650, 650, 696, 662, "START GAME", 'img/start_btn_bg.png');
    	this.mainStage.addChild(this.startGameBtn);
    	this.autoArrangeBtn = new Button(950, 650, 980, 662, "AUTO ARRANGE", 'img/auto_arr_btn_bg.png');
    	this.mainStage.addChild(this.autoArrangeBtn);

    	this.arrangepanel = new createjs.Container();
    	this.arrangepanel.addChild(this.gameScene.arrangepanelBg, this.gameScene.arrangeLabel, this.gameScene.infoLabel, this.startGameBtn, this.autoArrangeBtn);

		this.gameScene.playerField.ships.forEach(function(ship){
			this.arrangepanel.addChild(ship.image);			
		}.bind(this));

		this.mainStage.addChild(this.arrangepanel);

		switch( currentState ) {
	        case config.gameStates.ARRANGE_SHIPS:
	        	// add listeners
	        	// create functionality for drag, drop, rotate, free areas
	        	// animate scene hide
	        	this.gameScene.events.pannelShown.addOnce(function(){

	        	});
	        	
	        	this.gameScene.showArrangepanel(this.arrangepanel);
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