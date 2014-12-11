define(function (require) {
    "use strict";

    var InfoHeader = require('infoHeader'),
    	Battlefield = require('battlefield'),
    	StrikeField = require('strikeField');

    var GameScene = function( mainStage ){
    	this.mainStage = mainStage;

    	this.stageBgImage = new createjs.Bitmap("img/ocean_bg.jpg");
		this.mainStage.addChild(this.stageBgImage);

		this.infoHeader = new InfoHeader( this.mainStage );
		this.battlefield = new Battlefield( this.mainStage );
		this.strikeField = new StrikeField( this.mainStage );

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

    	this.init();
    };

	$.extend(GameScene.prototype, {
		init: function(){
			// create Battlefield
			// create Strike field

		}
	});
    
    return GameScene;
});