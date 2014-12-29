define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config'),
        utils = require('utils');

    var PlayerField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = null;
    	this.ships = [];
        this.marker = null;
        // this.playerFieldHitArea = null;
        this.playerFieldLeftOffset = config.playerFieldData.x;
        this.playerFieldTopOffset = config.playerFieldData.y;
        this.field = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        // this.rotations = ['horizontal', 'vertical'];
    	// this.clickEnabled = false;
        this.testContainer = new createjs.Container();//
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
				this.ships[i] = new Ship(config.shipsByType[i], this.field);
				this.mainStage.addChild(this.ships[i].image);
			}

            this.autoArrange();

            // create arrange marker
            // this.marker = new createjs.Shape();
            // this.marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(this.playerFieldLeftOffset, this.playerFieldTopOffset, config.arrangeMarkerWidth, config.arrangeMarkerHeight);
            // this.marker.visible = false;
            // this.mainStage.addChild(this.marker);

            // this.playerFieldHitArea = new createjs.Shape();
            // this.playerFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(this.playerFieldLeftOffset, this.playerFieldTopOffset, config.fieldWidth, config.fieldHeight);
            // this.mainStage.addChild(this.playerFieldHitArea);
    	},

    	enableClick: function(){
    		// this.clickEnabled = true;
            this.ships.forEach(function(ship){
                ship.clickEnabled = true;
            });
    	},

        autoArrange: function(){
            // iterate all sips
            // choose random position
            // check if this position is possible

this.mainStage.removeChild(this.testContainer);//
this.testContainer = new createjs.Container();//

            // reset field
            for (var i = 0; i < this.field.length; i++) {
                for (var j = 0; j < this.field.length; j++) {
                    this.field[i][j] = 0;
                }
            }

            this.ships.forEach(function(ship, idx){
                var rotate = utils.toBeRotated();

                if ( rotate ) {
                    ship.rotate();
                }

                this.drawShip(ship);
            }.bind(this));

            this.mainStage.addChild(this.testContainer);//

            // console.log('------------');//
            // console.log(this.field[0]);//
            // console.log(this.field[1]);//
            // console.log(this.field[2]);//
            // console.log(this.field[3]);//
            // console.log(this.field[4]);//
            // console.log(this.field[5]);//
            // console.log(this.field[6]);//
            // console.log(this.field[7]);//
            // console.log(this.field[8]);//
            // console.log(this.field[9]);//
            // console.log('------------');//
        },

        drawShip: function( ship ){
            var that = this,
                allSquaresFree = false,
                randPosition = utils.getValidRandomPosition( ship, this.field );

            // check if ship fits
            // make all cells around = 1
            // draw ship image

            function drawShipImage () {
                var rotationOffset = ship.getRotationOffset();
                ship.image.x = that.playerFieldLeftOffset + (randPosition.x * 50) + rotationOffset;
                ship.image.y = that.playerFieldTopOffset + (randPosition.y * 50);

                // save ship image coordinates after auto arrange
                ship.arrangedX = ship.image.x;
                ship.arrangedY = ship.image.y;
                ship.arrangedRotationType = ship.rotationType;

                // var test = new createjs.Shape();
                // test.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(0, 0, 50 * ship.blocksWidth, 50 * ship.blocksHeight);
                // test.x = that.playerFieldLeftOffset + (randPosition.x * 50);
                // test.y = that.playerFieldTopOffset + (randPosition.y * 50);

                // that.testContainer.addChild(test);
            }

            utils.checkAllSquares( ship, this.field, randPosition );
            utils.markAllSquaresAsFull( ship, this.field, randPosition );
            drawShipImage();
        }
    });
    
    return PlayerField;
});