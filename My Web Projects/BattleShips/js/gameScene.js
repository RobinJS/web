define(function (require) {
    "use strict";

    var InfoHeader = require('infoHeader'),
    	PlayerField = require('playerField'),
    	OpponentField = require('opponentField');

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

	/* arrange pannel stuff */
		var arrPanBgWidth = 680,
			arrPanBgHeight = 770;

		this.arrangePannelBg = new createjs.Shape();
		this.arrangePannelBg.graphics.beginFill("rgba(0, 0, 0, 0.8)").drawRect(0, 0, arrPanBgWidth, arrPanBgHeight);
 		this.arrangePannelBg.x = 600;
 		this.arrangePannelBg.y = 0;
 		this.mainStage.addChild(this.arrangePannelBg);

 		this.arrangeLabel = new createjs.Text("ARRANGE YOUR SHIPS", "34px Verdana", "#fff");
 		this.arrangeLabel.x = 710;
 		this.arrangeLabel.y = 60;
 		this.mainStage.addChild(this.arrangeLabel);

 		this.infoLabel = new createjs.Text("Drag and drop ships to the battlefield.\nTap on a ship to rotate it.", "20px Verdana", "#fff");
 		this.infoLabel.x = 700;
 		this.infoLabel.y = 130;
 		this.infoLabel.lineHeight = 35;
 		this.mainStage.addChild(this.infoLabel);
	/* end arrange pannel stuff */

		this.playerField = new PlayerField( this.mainStage );

    	this.init();
    };

	$.extend(GameScene.prototype, {
		init: function(){
			// create PlayerField
			// create Strike field

		},

		showArrangePannel: function( pannel ){
			this.opponentField.markerEnabled = false;
			pannel.y = -770;
			TweenMax.to(pannel, 2, {
				y: 0
			});
		},

		hideArrangePannel: function(){
			// this.opponentField.markerEnabled = true;
		}
	});
    
    return GameScene;
});