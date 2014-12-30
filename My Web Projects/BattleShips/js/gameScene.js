define(function (require) {
    "use strict";

    var InfoHeader = require('infoHeader'),
    	Signal = require('libs/signals.min'),
    	Button = require('button');

    var GameScene = function( mainStage ){
    	this.mainStage = mainStage;

    	this.stageBgImage = new createjs.Bitmap("img/ocean_bg.jpg");
		this.mainStage.addChild(this.stageBgImage);

		this.infoHeader = new InfoHeader( this.mainStage );
		this.opponentField = new OpponentField( this.mainStage );

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

	/* arrange panel stuff */
		var arrPanBgWidth = 680,
			arrPanBgHeight = 770;

		this.arrangepanelBg = new createjs.Shape();
		this.arrangepanelBg.graphics.beginFill("rgba(0, 0, 0, 0.8)").drawRect(0, 0, arrPanBgWidth, arrPanBgHeight);
 		this.arrangepanelBg.x = 600;
 		this.arrangepanelBg.y = 0;

 		this.arrangeLabel = new createjs.Text("ARRANGE YOUR SHIPS", "34px Verdana", "#fff");
 		this.arrangeLabel.x = 710;
 		this.arrangeLabel.y = 210;

 		this.infoLabel = new createjs.Text("You can drag and drop ships to arrange them.", "20px Verdana", "#fff");
 		this.infoLabel.x = 710;
 		this.infoLabel.y = 280;
 		this.infoLabel.lineHeight = 35;
	/* end arrange panel stuff */

	/* Buttons */
		this.startGameBtn = new Button(650, 450, 696, 462, "START GAME", '#6acd3c' );
		this.startGameBtn.clickEnabled = false;
    	// this.mainStage.addChild(this.startGameBtn);
    	this.autoArrangeBtn = new Button(950, 450, 980, 462, "AUTO ARRANGE", '#e6993d');
    	this.autoArrangeBtn.clickEnabled = false;
    	// this.mainStage.addChild(this.autoArrangeBtn);
    /* end Buttons */

		this.playerField = new PlayerField( this.mainStage );

		this.arrangepanel = new createjs.Container();
    	this.arrangepanel.addChild(this.arrangepanelBg, this.arrangeLabel, this.infoLabel, this.startGameBtn.button, this.autoArrangeBtn.button);
		this.arrangepanel.y = -770;
		this.mainStage.addChild(this.arrangepanel);

		this.events = {
			panelShown: new Signal(),
			panelHidden: new Signal(),
			startGame: new Signal()
		}

    	this.init();
    };

	$.extend(GameScene.prototype, {
		init: function(){
			// create PlayerField
			// create Strike field

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

				this.playerField.autoArrange();
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
			TweenMax.to(this.arrangepanel, 2, {
				y: 0,
				onComplete: function(){
					that.events.panelShown.dispatch();
				}
			});
		},

		hideArrangepanel: function(){
			var that = this;
			TweenMax.to(this.arrangepanel, 2, {
				y: -770,
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
		}
	});
    
    return GameScene;
});