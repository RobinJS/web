define(function (require) {
    "use strict";

    var InfoHeader = function( mainStage ){
    	this.mainStage = mainStage;

    	var whiteBgWidth = 500,
    		whiteBgHeight = 120;

    /* white backgrounds */
    	this.whiteBg = [new createjs.Shape(), new createjs.Shape()];

 		this.whiteBg[0].graphics.beginFill("rgba(255, 255, 255, 0.5)").drawRect(0, 0, whiteBgWidth, whiteBgHeight);
 		this.whiteBg[0].x = 50;
 		this.whiteBg[0].y = 20;

 		this.whiteBg[1].graphics.beginFill("rgba(255, 255, 255, 0.5)").drawRect(0, 0, whiteBgWidth, whiteBgHeight);
 		this.whiteBg[1].x = 650;
 		this.whiteBg[1].y = 20;

 		this.mainStage.addChild(this.whiteBg[0]);
		this.mainStage.addChild(this.whiteBg[1]);
	/* end white backgrounds */

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
		this.shipsRemainingLabel[0].y = 70;
		this.shipsRemainingLabel[0].shadow = new createjs.Shadow("#000000", 2, 2, 3);

		this.shipsRemainingLabel[1].x = 795;
		this.shipsRemainingLabel[1].y = 70;
		this.shipsRemainingLabel[1].shadow = new createjs.Shadow("#000000", 2, 2, 3);

		this.mainStage.addChild(this.shipsRemainingLabel[0]);
		this.mainStage.addChild(this.shipsRemainingLabel[1]);
	/* end ships remaining labels*/

	/* ships remaining text */
		this.playerShipsRemainText = new createjs.Text("7", "bold 30px Verdana", "#000");
		this.playerShipsRemainText.x = 380;
		this.playerShipsRemainText.y = 65;

		this.compShipsRemainText = new createjs.Text("7", "bold 30px Verdana", "#000");
		this.compShipsRemainText.x = 985;
		this.compShipsRemainText.y = 65;

		this.mainStage.addChild(this.playerShipsRemainText);
		this.mainStage.addChild(this.compShipsRemainText);
	/* end ships remaining text */

	/* player turn labels */
		this.playerTurnLabel = new createjs.Text("YOUR TURN", "24px Arial", "#31D55A");
		this.playerTurnLabel.x = 225;
		this.playerTurnLabel.y = 102;
		this.playerTurnLabel.visible = false;
		this.playerTurnLabel.shadow = new createjs.Shadow("#000000", 2, 2, 3);

		this.computerTurnLabel = new createjs.Text("COMPUTER'S TURN", "24px Arial", "#FB7A3C");
		this.computerTurnLabel.x = 785;
		this.computerTurnLabel.y = 102;
		this.computerTurnLabel.visible = false;
		this.computerTurnLabel.shadow = new createjs.Shadow("#000000", 2, 2, 3);

		this.mainStage.addChild(this.playerTurnLabel);
		this.mainStage.addChild(this.computerTurnLabel);
	/* end player turn labels */

		this.updateShipsRemainingText = function( player ){
			if ( player === 'player' ) {
				this.playerShipsRemainText.text = parseInt(this.playerShipsRemainText.text) - 1;
			} else if ( player === 'computer' ) {
				this.compShipsRemainText.text = parseInt(this.compShipsRemainText.text) - 1;
			}
		};

		this.reset = function(){
			this.playerShipsRemainText.text = "7";
			this.compShipsRemainText.text = "7";
		};

    };
    
    return InfoHeader;
});