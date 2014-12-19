define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config');

    var PlayerField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = null;
    	this.ships = [];
    	this.shipsByType = ['aircraftCarrier', 'battleship', 'cruiser', 'destroyer', 'destroyer2', 'submarine', 'submarine2'];
        this.marker = null;
        this.playerFieldHitArea = null;
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
        this.rotations = ['horizontal', 'vertical'];
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
				// this.ships[i].image.x = config.shipsData[ this.shipsByType[i] ].initialX;
				// this.ships[i].image.y = config.shipsData[ this.shipsByType[i] ].initialY;
				this.mainStage.addChild(this.ships[i].image);
			}

            this.autoArrange();

            // create arrange marker
            // this.marker = new createjs.Shape();
            // this.marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(this.playerFieldLeftOffset, this.playerFieldTopOffset, config.arrangeMarkerWidth, config.arrangeMarkerHeight);
            // this.marker.visible = false;
            // this.mainStage.addChild(this.marker);

            this.playerFieldHitArea = new createjs.Shape();
            this.playerFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(this.playerFieldLeftOffset, this.playerFieldTopOffset, config.fieldWidth, config.fieldHeight);
            this.mainStage.addChild(this.playerFieldHitArea);
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

            this.ships.forEach(function(ship, idx){
                ship.rotation = this.getRotation();

                if ( ship.rotation === 'horizontal' ) {
                    // shipPosition = this.horizontalCheckApprove(ship, randPosition);
                } else {
                    // rotate ship
                    var oldBlocksWidth = ship.blocksWidth,
                        oldBlocksHeight = ship.blocksHeight;

                    ship.blocksWidth = oldBlocksHeight;
                    ship.blocksHeight = oldBlocksWidth;

                    // shipPosition = this.verticalCheckApprove();
                }

            this.drawShip(ship);

            

            }.bind(this));
        },

        drawShip: function( ship ){
            var that = this,
                randPosition = that.getRandomPosition(),
                positionsToCheckX = null,
                positionsToCheckY = null,
                maxPositionToCheckX = null,
                maxPositionToCheckY = null,
                allValid = true;

            function loopCheck(){
                positionsToCheckX = that.getPositionsToCheckX(ship, randPosition),
                positionsToCheckY = that.getPositionsToCheckY(ship, randPosition),
                maxPositionToCheckX = Math.max.apply(Math, positionsToCheckX),
                maxPositionToCheckY = Math.max.apply(Math, positionsToCheckY);

                // break the check if the ship is going to be placed outside the field
                if ( maxPositionToCheckX > that.field.length || maxPositionToCheckY > that.field.length ) {
                    // break and get new random position
                    randPosition = that.getNextPossiblePos( randPosition, ship );
                    loopCheck();
                } else {
                    // check if all squares are free
                    allValid = checkAllSquares();

                    if ( !allValid ) {
                        randPosition = that.getNextPossiblePos( randPosition, ship );
                        loopCheck();
                    }
                }
            }

            loopCheck();

            function checkAllSquares(){
                var valid = true;
                for (var y = 0; y < positionsToCheckY.length; y++) {
                    for (var x = 0; x < positionsToCheckX.length; x++) {
                        
                        try {
                            if ( that.field[ positionsToCheckY[y] ][ positionsToCheckX[x] ] === 1 ) {
                                valid = false;
                                break;
                            }
                        } catch(e) {

                        }
                    }
                }

                return valid;
            }

            ;;;console.log(ship.blocksWidth, ship.blocksHeight, randPosition, positionsToCheckX, positionsToCheckY);
            
            // mark positions on field as not free
            for (var y = 0; y < positionsToCheckY.length; y++) {
                for (var x = 0; x < positionsToCheckX.length; x++) {
                    try {
                        that.field[ positionsToCheckY[y] ][ positionsToCheckX[x] ] = 1;
                    } catch (e) {

                    }
                }
            }

            var test = new createjs.Shape();
            test.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(0, 0, 50 * ship.blocksWidth, 50 * ship.blocksHeight);
            test.x = this.playerFieldLeftOffset + (randPosition.x * 50);
            test.y = this.playerFieldTopOffset + (randPosition.y * 50);
            this.mainStage.addChild(test);

            ship.image.x = this.playerFieldLeftOffset + (randPosition.x * 50);
            ship.image.y = this.playerFieldTopOffset + (randPosition.y * 50);

            if ( ship.rotation === 'vertical' ) {
                ship.image.rotation = 90;
                ship.image.x += 50;
            }


            /* Example:

            5 1 Object {x: 8, y: 6} [7, 8, 9, 10, 11, 12, 13] [5, 6, 7]

            4 1 Object {x: 7, y: 7} [6, 7, 8, 9, 10, 11] [6, 7, 8]
            3 1 Object {x: 6, y: 5} [5, 6, 7, 8, 9] [4, 5, 6]
            2 1 Object {x: 5, y: 5} [4, 5, 6, 7] [4, 5, 6]
            2 1 Object {x: 0, y: 7} [-1, 0, 1, 2] [6, 7, 8]
            1 1 Object {x: 1, y: 4} [0, 1, 2] [3, 4, 5]
            1 1 Object {x: 3, y: 0} [2, 3, 4] [-1, 0, 1]*/
        },

        getPositionsToCheckX: function( ship, randPosition ){
            var positions = [];

            positions.push(randPosition.x - 1);

            for (var i = 0; i < ship.blocksWidth + 1; i++) {
                positions.push(randPosition.x + i);
            }

            return positions;
        },

        getPositionsToCheckY: function( ship, randPosition ){
            var positions = [];

            positions.push(randPosition.y - 1);

            for (var i = 0; i < ship.blocksHeight + 1; i++) {
                positions.push(randPosition.y + i);
            }

            return positions;
        },

        getRandomPosition: function(){
            var position = {};
            position.x = Math.floor(Math.random() * 10);
            position.y = Math.floor(Math.random() * 10);
            return position;
        },

        getNextPossiblePos: function( randPosition, ship ){
            var that = this,
                nextPossiblePos = randPosition,
                step = 1,
                lastSquarePosX = 0,
                lastSquarePosY = 0;

                nextPossiblePos.x++;

            function next(){
                lastSquarePosX = nextPossiblePos.x + ship.blocksWidth - 1;
                lastSquarePosY = nextPossiblePos.y + ship.blocksHeight - 1;

                if ( lastSquarePosX > that.field.length - 1 ) {
                    nextPossiblePos.x = 0;
                    nextPossiblePos.y++;
                    next();
                }

                if ( lastSquarePosY > that.field.length - 1 ) {
                    nextPossiblePos.y = 0;
                    nextPossiblePos.x = 0;
                    next();
                }

                if ( that.field[ nextPossiblePos.y ][ nextPossiblePos.x ] === 1 ) {
                    nextPossiblePos.x++;
                    next();
                }
            }

            next();

            return nextPossiblePos;
        },

        getRotation: function(){
            return this.rotations[Math.floor(Math.random() * 2)]
        },

        verticalCheckApprove: function(){

        }
    });
    
    return PlayerField;
});