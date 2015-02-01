define(function (require) {
    "use strict";

    var InfoHeader = require('infoHeader'),
    	Signal = require('signals'),
    	config = require('config'),
    	Button = require('button'),
    	soundPlayer = require('soundPlayer');

    var GameScene = function( mainStage ){
    	this.mainStage = mainStage;
    	var stageBgImage = new createjs.Bitmap("img/ocean_bg.jpg");
		this.mainStage.addChild(stageBgImage);
		this.infoHeader = new InfoHeader( this.mainStage );

	/* sound icons */
		this.soundIcon = new createjs.Bitmap("img/sound.png");
		this.soundIcon.visible = true;

		this.muteIcon = new createjs.Bitmap("img/mute.png");
		this.muteIcon.y = 6;
		this.muteIcon.visible = false;

		this.soundButtonHitArea = new createjs.Shape();
		this.soundButtonHitArea.graphics.beginFill('rgba(255, 255, 255, 0.05)').rect(0, 0, 64, 58);

		this.soundButton = new createjs.Container();
		this.soundButton.addChild( this.soundIcon, this.muteIcon, this.soundButtonHitArea );
		this.soundButton.alpha = 0.7;
		this.soundButton.x = 1180;
		this.soundButton.y = 50;
		this.soundButton.soundIcon = this.soundIcon;
		this.soundButton.muteIcon = this.muteIcon;
		this.soundButton.mouseEnabled = false;
		this.mainStage.addChild(this.soundButton);
	/* end sound icons */

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
			arrPanBgHeight = 770,
			rotationIconWidthHeight = 64;

		this.arrangepanelBg = new createjs.Shape();
		this.arrangepanelBg.graphics.beginFill("rgba(0, 0, 0, 0.8)").drawRect(0, 0, arrPanBgWidth, arrPanBgHeight);
 		this.arrangepanelBg.x = 0;
 		this.arrangepanelBg.y = 0;

 		this.arrangeLabel = new createjs.Text("ARRANGE YOUR SHIPS", "34px Verdana", "#fff");
 		this.arrangeLabel.x = 130;
 		this.arrangeLabel.y = 150;

 		this.infoLabel = new createjs.Text("You can drag and drop your ships to arrange them.\nClick on ship, then click on rotation icon to rotate it.", "20px Verdana", "#fff");
 		this.infoLabel.x = 70;
 		this.infoLabel.y = 220;
 		this.infoLabel.lineHeight = 35;

		this.startGameBtn = new Button(50, 450, 96, 462, "START GAME", '#6acd3c' );
		this.startGameBtn.clickEnabled = false;

    	this.autoArrangeBtn = new Button(360, 450, 390, 462, "AUTO ARRANGE", '#e6993d');
    	this.autoArrangeBtn.clickEnabled = false;

    	this.rotateIcon = new createjs.Bitmap("img/rotate.png");
		this.rotateIcon.visible = true;

		this.rotateButtonHitArea = new createjs.Shape();
		this.rotateButtonHitArea.graphics.beginFill('rgba(255, 255, 255, 0.05)').rect(0, 0, rotationIconWidthHeight, rotationIconWidthHeight);

		this.rotateButton = new createjs.Container();
		this.rotateButton.addChild( this.rotateIcon, this.rotateButtonHitArea );
		this.rotateButton.alpha = 0.7;
		
		this.rotateButton.regX = rotationIconWidthHeight / 2;
		this.rotateButton.regY = rotationIconWidthHeight / 2;
		this.rotateButton.scaleX = 0.8;
		this.rotateButton.scaleY = 0.8;
		this.rotateButton.x = 90;
		this.rotateButton.y = 350;
		this.rotateButton.soundIcon = this.soundIcon;
		this.rotateButton.muteIcon = this.muteIcon;
	/* end arrange panel stuff */

	/* Game Over splash stuff */
		this.gameOverSplashBg = new createjs.Shape();
		this.gameOverSplashBg.graphics.beginFill("rgba(0, 0, 0, 0.8)").drawRect(0, 0, this.mainStage.canvas.width, this.mainStage.canvas.height);
 		this.gameOverSplashBg.x = 0;
 		this.gameOverSplashBg.y = 0;

 		this.gameOverLabel = new createjs.Text("GAME OVER", "38px Verdana", "#fff");
 		this.gameOverLabel.x = this.mainStage.canvas.width / 2 - 150;
 		this.gameOverLabel.y = 130;

 		this.winnerLabel = new createjs.Text("", "28px Verdana", "#fff");
 		this.winnerLabel.x = 450;
 		this.winnerLabel.y = 180;

 		this.scoreLabel = new createjs.Text("SCORE:", "28px Verdana", "#fff");
 		this.scoreLabel.x = 550;
 		this.scoreLabel.y = 300;

 		this.playerScoreText = new createjs.Text("Player:", "28px Verdana", "#fff");
 		this.playerScoreText.x = 520;
 		this.playerScoreText.y = 350;

 		this.computerScoreText = new createjs.Text("Computer:", "28px Verdana", "#fff");
 		this.computerScoreText.x = 468;
 		this.computerScoreText.y = 390;

 		this.playAgainBtn = new Button(470, 510, 525, 522, "PLAY AGAIN", '#6acd3c' );
 		this.playAgainBtn.button.alpha = 0;
		this.playAgainBtn.clickEnabled = false;
	/* end Game Over splash stuff */

		this.arrangepanel = new createjs.Container();
    	this.arrangepanel.addChild(this.arrangepanelBg, this.arrangeLabel, this.infoLabel, this.startGameBtn.button, this.autoArrangeBtn.button, this.rotateButton);
		this.arrangepanel.x = 1300;
		this.mainStage.addChild(this.arrangepanel);

		this.gameOverSplash = new createjs.Container();
    	this.gameOverSplash.addChild(this.gameOverSplashBg, this.gameOverLabel, this.winnerLabel, this.scoreLabel, this.playerScoreText, this.computerScoreText, this.playAgainBtn.button);
		this.gameOverSplash.y = -this.mainStage.canvas.height;
		
		this.events = {
			panelShown: new Signal(),
			panelHidden: new Signal(),
			startGame: new Signal(),
			playerAutoArrange: new Signal(),
			playAgain: new Signal(),
			tryToRotateShip: new Signal()
		}

    	this.addListeners();
    };

	$.extend(GameScene.prototype, {
		addListeners: function(){
		// start game button
			this.startGameBtn.addEventListener('mousedown', function(e){
				this.startGameBtn.showPressedImg();
			}.bind(this));

			this.startGameBtn.addEventListener('pressup', function(e){
				this.startGameBtn.hidePressedImg();
				this.disableButtonsClick();
				this.soundButton.mouseEnabled = true;
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
				this.autoArrangeBtn.showPressedImg();
			}.bind(this));

			this.autoArrangeBtn.addEventListener('pressup', function(e){
				this.autoArrangeBtn.hidePressedImg();

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

		// play again button
			this.playAgainBtn.addEventListener('mousedown', function(e){
				this.playAgainBtn.showPressedImg();
			}.bind(this));

			this.playAgainBtn.addEventListener('pressup', function(e){
				this.playAgainBtn.hidePressedImg();
				this.disableButtonsClick();
				this.soundButton.mouseEnabled = true;
				this.events.playAgain.dispatch();
			}.bind(this));

			this.playAgainBtn.addEventListener('mouseover', function(e){
				this.playAgainBtn.showGlow();
			}.bind(this));

			this.playAgainBtn.addEventListener('mouseout', function(e){
				this.playAgainBtn.hideGlow();
			}.bind(this));
		// end play again button

		// sound button
			this.soundButtonHitArea.addEventListener('pressup', function(e){
				if ( this.soundButton.soundIcon.visible ) {
					this.soundButton.soundIcon.visible = false;
					this.soundButton.muteIcon.visible = true;
					soundPlayer.disableSounds();
				} else if ( this.soundButton.muteIcon.visible ) {
					this.soundButton.muteIcon.visible = false;
					this.soundButton.soundIcon.visible = true;
					soundPlayer.enableSounds();
				}
			}.bind(this));

			this.soundButtonHitArea.addEventListener('mouseover', function(e){
				this.soundButton.alpha = 1;
			}.bind(this));

			this.soundButtonHitArea.addEventListener('mouseout', function(e){
				this.soundButton.alpha = 0.7;
			}.bind(this));
		// end sound button

		// rotate button
			this.rotateButton.addEventListener('mousedown', function(e){
				this.rotateButton.scaleX = 0.7;
				this.rotateButton.scaleY = 0.7;
			}.bind(this));

			this.rotateButton.addEventListener('pressup', function(e){
				this.events.tryToRotateShip.dispatch();
				this.rotateButton.scaleX = 0.8;
				this.rotateButton.scaleY = 0.8;
			}.bind(this));

			this.rotateButton.addEventListener('mouseover', function(e){
				this.rotateButton.alpha = 1;
			}.bind(this));

			this.rotateButton.addEventListener('mouseout', function(e){
				this.rotateButton.alpha = 0.7;
			}.bind(this));
		// end rotate button
		},

		showArrangepanel: function(){
			var that = this;
			TweenMax.to(this.arrangepanel, 1, {
				x: 600,
				onComplete: function(){
					that.events.panelShown.dispatch();
				}
			});
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
	    	this.playAgainBtn.clickEnabled = true;
	    	this.autoArrangeBtn.clickEnabled = true;
		},

		disableButtonsClick: function(){
			this.startGameBtn.clickEnabled = false;
	    	this.autoArrangeBtn.clickEnabled = false;
	    	this.playAgainBtn.clickEnabled = false;
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

		addGameOverSplash: function(){
			this.mainStage.addChild(this.gameOverSplash);
		},

		showWinSplah: function( winner ){
			var that = this,
				playerWins = sessionStorage.player !== undefined ? sessionStorage.player : 0,
				computerWins = sessionStorage.computer !== undefined ? sessionStorage.computer : 0;

			if ( winner === 'player' ) {
				this.winnerLabel.x = this.mainStage.canvas.width / 2 - 175;
			} else if ( winner === 'computer' ){
 				this.winnerLabel.x = this.mainStage.canvas.width / 2 - 200;
			}

			this.winnerLabel.text = winner + " is the winner!"

			this.playerScoreText.text = 'Player: ' + playerWins + ' wins';
			this.computerScoreText.text = 'Computer: ' + computerWins + ' wins';
			this.playAgainBtn.button.alpha = 0;

			TweenMax.to(this.gameOverSplash, 1, {
				y: 0,
				onComplete: function(){
					that.animatePlayAgainBtn();
				}
			});

			this.soundButton.mouseEnabled = false;
		},

		hideWinSplah: function( winner ){
			TweenMax.to(this.gameOverSplash, 1, {
				y: -this.mainStage.canvas.height
			});
		},

		animatePlayAgainBtn: function(){
			TweenMax.to(this.playAgainBtn.button, 1, {
				alpha: 1
			});
		},

		reset: function(){
			this.infoHeader.reset();
		}
	});
    
    return GameScene;
});