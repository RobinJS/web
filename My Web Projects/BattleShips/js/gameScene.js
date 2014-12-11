define(function (require) {
    "use strict";

    var InfoHeader = require('js/infoHeader');

    var GameScene = function( mainStage ){
    	this.mainStage = mainStage;

    	this.stageBgImage = new createjs.Bitmap("img/ocean_bg.jpg");
		this.mainStage.addChild(this.stageBgImage);

		this.infoHeader = new InfoHeader();

		// this.introBg = new createjs.Shape();
 	// 	this.introBg.graphics.beginFill("rgba(0, 0, 0, 0.5)").drawRect(0, 0, this.mainStage.stage.canvas.width, this.mainStage.stage.canvas.height);
		// this.mainStage.addChild(this.introBg);

    	this.init();
    };

	$.extend(GameScene.prototype, {
		init: function(){
			// show info header
			// create Battlefield
			// create Strike field

			this.infoHeader.show();
		}
	});
    
    return GameScene;
});