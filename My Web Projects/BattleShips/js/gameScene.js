define(function (require) {
    "use strict";

    var InfoHeader = require('infoHeader'),
    	PlayerField = require('playerField'),
    	OpponentField = require('opponentField'),
    	Signal = require('libs/signals.min');

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
 		this.mainStage.addChild(this.arrangepanelBg);

 		this.arrangeLabel = new createjs.Text("ARRANGE YOUR SHIPS", "34px Verdana", "#fff");
 		this.arrangeLabel.x = 710;
 		this.arrangeLabel.y = 60;
 		this.mainStage.addChild(this.arrangeLabel);

 		this.infoLabel = new createjs.Text("Drag and drop ships to the battlefield.\nTap on a ship to rotate it.", "20px Verdana", "#fff");
 		this.infoLabel.x = 700;
 		this.infoLabel.y = 130;
 		this.infoLabel.lineHeight = 35;
 		this.mainStage.addChild(this.infoLabel);
	/* end arrange panel stuff */

		this.playerField = new PlayerField( this.mainStage );
		// this.playerField.createShips();

		this.events = {
			panelShown: new Signal()
		}

    	this.init();
    };

	$.extend(GameScene.prototype, {
		init: function(){
			// create PlayerField
			// create Strike field

		},

		showArrangepanel: function( panel ){
			var that = this;
			this.opponentField.markerEnabled = false;
			panel.y = -770;
			TweenMax.to(panel, 2, {
				y: 0,
				onComplete: function(){
					that.events.panelShown.dispatch();
				}
			});
		},

		hideArrangepanel: function(){
			// this.opponentField.markerEnabled = true;
		}
	});
    
    return GameScene;
});