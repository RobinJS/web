define(function (require) {
    "use strict";

    var InfoHeader = require('infoHeader'),
    	Battlefield = require('battlefield');

    var GameScene = function( mainStage ){
    	this.mainStage = mainStage;

    	this.stageBgImage = new createjs.Bitmap("img/ocean_bg.jpg");
		this.mainStage.addChild(this.stageBgImage);

		this.infoHeader = new InfoHeader( mainStage );
		this.battlefield = new Battlefield();

		// this.introBg = new createjs.Shape();
 	// 	this.introBg.graphics.beginFill("rgba(0, 0, 0, 0.5)").drawRect(0, 0, this.mainStage.stage.canvas.width, this.mainStage.stage.canvas.height);
		// this.mainStage.addChild(this.introBg);

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