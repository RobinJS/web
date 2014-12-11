define(function (require) {
    "use strict";

    var Battlefield = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = new createjs.Bitmap("img/grid.png");
		this.gridImage.x = 50
		this.gridImage.y = 250;

		this.mainStage.addChild(this.gridImage);
    };
    
    return Battlefield;
});