define(function (require) {
    "use strict";

    var InfoHeader = require('infoHeader'),
    	Signal = require('libs/signals.min'),
    	config = require('config'),
    	Button = require('button');

    var GameScene = function( mainStage ){
    	this.mainStage = mainStage;
    	this.stageBgImage = new createjs.Bitmap("img/ocean_bg.jpg");
		this.mainStage.addChild(this.stageBgImage);
		this.infoHeader = new InfoHeader( this.mainStage );

	/* numbers */
		this.mapNumbers = [new createjs.Bitmap("img/field_numbers.png"), new createjs.Bitmap("img/field_numbers.png")];
		this.mapNumbers[0].x = 50;
		this.mapNumbers[0].y = 200;
		this.mapNumbers[1].x = 650;
		this.mapNumbers[1].y = 200;

		this.mainStage.addChild(this.mapNumbers[0]);
		this.mainStage.addChild(this.mapNumbers[1]);
	/* end numbers */

	/* letters */
		this.mapLetters = [new createjs.Bitmap("img/field_letters.png"), new createjs.Bitmap("img/field_letters.png")];
		this.mapLetters[0].x = 0
		this.mapLetters[0].y = 250;
		this.mapLetters[1].x = 600;
		this.mapLetters[1].y = 250;

		this.mainStage.addChild(this.mapLetters[0]);
		this.mainStage.addChild(this.mapLetters[1]);
	/* end letters */

	/* grid images */
		this.gridImagePlayer = new createjs.Bitmap("img/grid.png");
		this.gridImagePlayer.x = config.playerFieldData.x;
		this.gridImagePlayer.y = config.playerFieldData.y;
		this.mainStage.addChild(this.gridImagePlayer);

		this.gridImageOpponent = new createjs.Bitmap("img/grid.png");
		this.gridImageOpponent.x = config.opponentFiledData.x;
		this.gridImageOpponent.y = config.opponentFiledData.y;
		this.mainStage.addChild(this.gridImageOpponent);
	/* end grid images */

	/* arrange panel stuff */
		var arrPanBgWidth = 680,
			arrPanBgHeight = 770;

		this.arrangepanelBg = new createjs.Shape();
		this.arrangepanelBg.graphics.beginFill("rgba(0, 0, 0, 0.8)").drawRect(0, 0, arrPanBgWidth, arrPanBgHeight);
 		this.arrangepanelBg.x = 0;
 		this.arrangepanelBg.y = 0;

 		this.arrangeLabel = new createjs.Text("ARRANGE YOUR SHIPS", "34px Verdana", "#fff");
 		this.arrangeLabel.x = 110;
 		this.arrangeLabel.y = 210;

 		this.infoLabel = new createjs.Text("You can drag and drop ships to arrange them. \n Choose difficulty - easy/normal", "20px Verdana", "#fff");
 		this.infoLabel.x = 110;
 		this.infoLabel.y = 280;
 		this.infoLabel.lineHeight = 35;
	/* end arrange panel stuff */

	/* Buttons */
		this.startGameBtn = new Button(50, 450, 96, 462, "START GAME", '#6acd3c' );
		this.startGameBtn.clickEnabled = false;
    	this.autoArrangeBtn = new Button(350, 450, 380, 462, "AUTO ARRANGE", '#e6993d');
    	this.autoArrangeBtn.clickEnabled = false;
    /* end Buttons */

	/* Game Over splash stuff */
		this.gameOverSplashBg = new createjs.Shape();
		this.gameOverSplashBg.graphics.beginFill("rgba(0, 0, 0, 0.8)").drawRect(0, 0, this.mainStage.canvas.width, this.mainStage.canvas.height);
 		this.gameOverSplashBg.x = 0;
 		this.gameOverSplashBg.y = 0;

 		this.gameOverLabel = new createjs.Text("GAME OVER", "38px Verdana", "#fff");
 		this.gameOverLabel.x = this.mainStage.canvas.width / 2 - 150;
 		this.gameOverLabel.y = 210;

 		this.winnerLabel = new createjs.Text("", "28px Verdana", "#fff");
 		this.winnerLabel.y = 300;
	/* end Game Over splash stuff */

		this.arrangepanel = new createjs.Container();
    	this.arrangepanel.addChild(this.arrangepanelBg, this.arrangeLabel, this.infoLabel, this.startGameBtn.button, this.autoArrangeBtn.button);
		this.arrangepanel.x = 1300;
		this.mainStage.addChild(this.arrangepanel);

		this.gameOverSplash = new createjs.Container();
    	this.gameOverSplash.addChild(this.gameOverSplashBg, this.gameOverLabel, this.winnerLabel);
		this.gameOverSplash.y = -this.mainStage.canvas.height;
		this.mainStage.addChild(this.gameOverSplash);

		// window.show = this.showWinSplah( 'player' );
		// window.show = this.showWinSplah( 'computer' );

		this.events = {
			panelShown: new Signal(),
			panelHidden: new Signal(),
			startGame: new Signal(),
			playerAutoArrange: new Signal()
		}

    	this.init();
    };

	$.extend(GameScene.prototype, {
		init: function(){
		// start game button
			this.startGameBtn.addEventListener('mousedown', function(e){
				this.startGameBtn.showPressed();
			}.bind(this));

			this.startGameBtn.addEventListener('pressup', function(e){
				this.startGameBtn.hidePressed();

				// if ( !this.startGameBtn.clickEnabled ) return;

				this.disableButtonsClick();
				this.events.startGame.dispatch();
			}.bind(this));

			this.startGameBtn.addEventListener('mouseover', function(e){

				this.startGameBtn.showGlow();
			}.bind(this));

			this.startGameBtn.addEventListener('mouseout', function(e){

				this.startGameBtn.hideGlow();
			}.bind(this));
		// end start game button

		// auto arrange button
			this.autoArrangeBtn.addEventListener('mousedown', function(e){
				this.autoArrangeBtn.showPressed();
			}.bind(this));

			this.autoArrangeBtn.addEventListener('pressup', function(e){
				this.autoArrangeBtn.hidePressed();

				if ( !this.autoArrangeBtn.clickEnabled ) return;

				this.events.playerAutoArrange.dispatch();
			}.bind(this));

			this.autoArrangeBtn.addEventListener('mouseover', function(e){

				this.autoArrangeBtn.showGlow();
			}.bind(this));

			this.autoArrangeBtn.addEventListener('mouseout', function(e){

				this.autoArrangeBtn.hideGlow();
			}.bind(this));
		// end auto arrange button

		},

		showArrangepanel: function(){
			var that = this;
			TweenMax.to(this.arrangepanel, 1, {
				x: 600,
				onComplete: function(){
					that.events.panelShown.dispatch();
				}
			});

			this.showWinSplah();
		},

		hideArrangepanel: function(){
			var that = this;
			TweenMax.to(this.arrangepanel, 1, {
				x: 1300,
				onComplete: function(){
					that.events.panelHidden.dispatch();
				}
			});
		},

		enableButtonsClick: function(){
			this.startGameBtn.clickEnabled = true;
	    	this.autoArrangeBtn.clickEnabled = true;
		},

		disableButtonsClick: function(){
			this.startGameBtn.clickEnabled = false;
	    	this.autoArrangeBtn.clickEnabled = false;
		},

		showTurnLabel: function( player ){
			if ( player === 'player' ) {
				this.infoHeader.playerTurnLabel.visible = true;
			} else if ( player === 'computer' ){
				this.infoHeader.computerTurnLabel.visible = true;
			}
		},

		hideTurnLabel: function( player ){
			if ( player === 'player' ) {
				this.infoHeader.playerTurnLabel.visible = false;
			} else if ( player === 'computer' ){
				this.infoHeader.computerTurnLabel.visible = false;
			}
		},

		showWinSplah: function( winner ){
			if ( winner === 'player' ) {
				this.winnerLabel.x = this.mainStage.canvas.width / 2 - 175;
			} else if ( winner === 'computer' ){
 				this.winnerLabel.x = this.mainStage.canvas.width / 2 - 200;
			}

			this.winnerLabel.text = winner + " is the winner!"

			TweenMax.to(this.gameOverSplash, 1, {
				x: 0,
				onComplete: function(){
					// that.events.panelShown.dispatch();
				}
			});
		},

		hideWinSplah: function( winner ){
			TweenMax.to(this.gameOverSplash, 1, {
				x: -this.mainStage.canvas.height,
				onComplete: function(){
					// that.events.panelShown.dispatch();
				}
			});
		},
	});
    
    return GameScene;
});