define(function (require) {
    "use strict";

    var StrikeField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = new createjs.Bitmap("img/grid.png");
		this.gridImage.x = 650
		this.gridImage.y = 250;

		this.mainStage.addChild(this.gridImage);
    };
    
    return StrikeField;
});