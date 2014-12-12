define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config');

    var PlayerField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = null;
    	this.ships = [];
    	this.shipsByType = ['aircraftCarrier', 'battleship', 'cruiser', 'destroyer', 'destroyer', 'submarine', 'submarine'];
    	this.initialX = [775, 750, 728, 705, 840, 680, 760];
    	this.initialY = [250, 320, 390, 460, 460, 530, 530];
        this.marker = null;
        this.playerFieldHitArea = null;
        this.playerFieldLeftOffset = 50;
        this.playerFieldTopOffset = 250;
    	// this.clickEnabled = false;

    	this.init();
    };

    $.extend(PlayerField.prototype, {
    	init: function(){
    		this.gridImage = new createjs.Bitmap("img/grid.png");
			this.gridImage.x = this.playerFieldLeftOffset
			this.gridImage.y = this.playerFieldTopOffset;
			this.mainStage.addChild(this.gridImage);

			// create ships and position them before arrange
			var shipsInitialNum = 7;

			for (var i = 0; i < shipsInitialNum; i++) {
				this.ships[i] = new Ship(this.shipsByType[i]);
				this.ships[i].image.x = this.initialX[i];
				this.ships[i].image.y = this.initialY[i];
				this.mainStage.addChild(this.ships[i].image);
			}

            // create arrange marker
            this.marker = new createjs.Shape();
            this.marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(this.playerFieldLeftOffset, this.playerFieldTopOffset, config.arrangeMarkerWidth, config.arrangeMarkerHeight);
            this.marker.visible = false;
            this.mainStage.addChild(this.marker);

            this.playerFieldHitArea = new createjs.Shape();
            this.playerFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(this.playerFieldLeftOffset, this.playerFieldTopOffset, config.fieldWidth, config.fieldHeight);
            this.mainStage.addChild(this.playerFieldHitArea);
    	},

    	enableClick: function(){
    		// this.clickEnabled = true;
            this.ships.forEach(function(ship){
                ship.clickEnabled = true;
            });
    	}
    });
    
    return PlayerField;
});