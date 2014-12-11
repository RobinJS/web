define(function (require) {
    "use strict";

    var GameScene = function( mainStage ){
    	this.mainStage = mainStage;

    	this.stageBgImage = new createjs.Bitmap("img/ocean_bg.jpg");
		this.mainStage.addChild(this.stageBgImage);

    	this.init();
    };

	$.extend(GameScene.prototype, {
		init: function(){
		},

		showIntroSplash: function(){
			setTimeout(function(){
				
			}.bind(this), 1000);
		}
	});
    
    return GameScene;
});