define(function (require) {
    "use strict";

    var InfoHeader = function( mainStage ){
    	this.mainStage = mainStage;

    	var whiteBgWidth = 500,
    		whiteBgHeight = 120;

    /* shite backgrounds */
    	this.whiteBg = [new createjs.Shape(), new createjs.Shape()];

 		this.whiteBg[0].graphics.beginFill("rgba(255, 255, 255, 0.5)").drawRect(0, 0, whiteBgWidth, whiteBgHeight);
 		this.whiteBg[0].x = 50;
 		this.whiteBg[0].y = 20;

 		this.whiteBg[1].graphics.beginFill("rgba(255, 255, 255, 0.5)").drawRect(0, 0, whiteBgWidth, whiteBgHeight);
 		this.whiteBg[1].x = 650;
 		this.whiteBg[1].y = 20;

 		this.mainStage.addChild(this.whiteBg[0]);
		this.mainStage.addChild(this.whiteBg[1]);
	/* end shite backgrounds */

	/* big labels */
		this.bigLabels = [new createjs.Text("PLAYER", "34px Arial", "#fff"), new createjs.Text("COMPUTER", "34px Arial", "#fff")];
		this.bigLabels[0].x = 230;
		this.bigLabels[0].y = 30;
		this.bigLabels[0].shadow = new createjs.Shadow("#000000", 3, 3, 5);

		this.bigLabels[1].x = 800;
		this.bigLabels[1].y = 30;
		this.bigLabels[1].shadow = new createjs.Shadow("#000000", 3, 3, 5);

		this.mainStage.addChild(this.bigLabels[0]);
		this.mainStage.addChild(this.bigLabels[1]);
	/* end big labels */

	/* ships remaining labels */
		this.shipsRemainingLabel = [new createjs.Text("Ships remaining:", "24px Arial", "#fff"), new createjs.Text("Ships remaining:", "24px Arial", "#fff")];
		this.shipsRemainingLabel[0].x = 190;
		this.shipsRemainingLabel[0].y = 80;
		this.shipsRemainingLabel[0].shadow = new createjs.Shadow("#000000", 2, 2, 3);

		this.shipsRemainingLabel[1].x = 795;
		this.shipsRemainingLabel[1].y = 80;
		this.shipsRemainingLabel[1].shadow = new createjs.Shadow("#000000", 2, 2, 3);

		this.mainStage.addChild(this.shipsRemainingLabel[0]);
		this.mainStage.addChild(this.shipsRemainingLabel[1]);
	/* end ships remaining labels*/

	/* ships remaining text */
		this.playerShipsRemainText = new createjs.Text("7", "bold 30px Verdana", "#000");
		this.playerShipsRemainText.x = 380;
		this.playerShipsRemainText.y = 75;

		this.compShipsRemainText = new createjs.Text("7", "bold 30px Verdana", "#000");
		this.compShipsRemainText.x = 985;
		this.compShipsRemainText.y = 75;

		this.mainStage.addChild(this.playerShipsRemainText);
		this.mainStage.addChild(this.compShipsRemainText);
	/* end ships remaining text */

    };
    
    return InfoHeader;
});