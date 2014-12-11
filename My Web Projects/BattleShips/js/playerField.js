define(function (require) {
    "use strict";

    var Ship = require('ship');

    var PlayerField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = null;
    	this.ships = [];
    	this.shipsByType = ['aircraftCarrier', 'battleship', 'cruiser', 'destroyer', 'destroyer', 'submarine', 'submarine'];
    	this.initialX = [750, 750, 750, 750, 870, 750, 830];
    	this.initialY = [250, 320, 390, 460, 460, 530, 530];
    	this.init();
    };

    $.extend(PlayerField.prototype, {
    	init: function(){
    		this.gridImage = new createjs.Bitmap("img/grid.png");
			this.gridImage.x = 50
			this.gridImage.y = 250;
			this.mainStage.addChild(this.gridImage);

			// create ships and position them before arrange
			var shipsInitialNum = 7;

			for (var i = 0; i < shipsInitialNum; i++) {
				this.ships[i] = new Ship(this.shipsByType[i]);
				this.ships[i].image.x = this.initialX[i];
				this.ships[i].image.y = this.initialY[i];
				this.mainStage.addChild(this.ships[i].image);
			}
    	},

    	showShipsToArrange: function(){
    		// this.shipsImages.forEach(function(ship){
    		// 	ship.visible = true;
    		// });
    	}
    });
    
    return PlayerField;
});