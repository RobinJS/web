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

this.mainStage.removeChild(this.testContainer);//
this.testContainer = new createjs.Container();

            // reset field
            for (var i = 0; i < this.field.length; i++) {
                for (var j = 0; j < this.field.length; j++) {
                    this.field[i][j] = 0;
                }
            }

            this.ships.forEach(function(ship, idx){
                var rotate = this.toBeRotated();

                if ( rotate ) {
                    // shipPosition = this.horizontalCheckApprove(ship, randPosition);
                    ship.rotate();
                }
                //  else {
                //     // rotate ship
                //     var oldBlocksWidth = ship.blocksWidth,
                //         oldBlocksHeight = ship.blocksHeight;

                //     ship.blocksWidth = oldBlocksHeight;
                //     ship.blocksHeight = oldBlocksWidth;

                //     // shipPosition = this.verticalCheckApprove();
                // }

                this.drawShip(ship);

            }.bind(this));

            this.mainStage.addChild(this.testContainer);//
        },

        drawShip: function( ship ){
            var that = this,
                allSquaresFree = false;

            var randPosition = that.getValidRandomPosition( ship );

            // check if ship fits
            // make all cells around = 1
            // draw ship image

            function checkNextPosition () {
                randPosition.x++;
                if ( randPosition.x >= that.field.length ) {
                    randPosition.x = 0;
                    randPosition.y++;

                    if ( randPosition.y >= that.field.length ) {
                        randPosition.y = 0;
                    }
                }

                // check if randPosition is not free, or the ship will go outside fields bounds
                if ( (that.field[randPosition.y][randPosition.x] === 1) || (randPosition.x + ship.blocksWidth - 1 >= that.field.length) || (randPosition.y + ship.blocksHeight - 1 >= that.field.length) ) {
                    checkNextPosition();
                    return;
                }
                
                checkAllSquares();
            }

            function checkAllSquares() {
                for (var y = randPosition.y - 1; y <= randPosition.y + ship.blocksHeight; y++) {
                    for (var x = randPosition.x - 1; x <= randPosition.x + ship.blocksWidth; x++) {
                        if ( y === -1 || x === -1 || y >= that.field.length || x >= that.field.length ) {
                            continue;
                        }

                        if ( that.field[y][x] === 1 ) {
                            checkNextPosition();
                            return;
                        }

                        if ( (y === randPosition.y + ship.blocksHeight) && (x === randPosition.x + ship.blocksWidth ) ) {
                            allSquaresFree = true;
                        }
                    }
                }
            }

            function markAllSquaresAsFull() {
                for (var y = randPosition.y; y < randPosition.y + ship.blocksHeight; y++) {
                    for (var x = randPosition.x; x < randPosition.x + ship.blocksWidth; x++) {
                        if ( y !== -1 && x !== -1 && y < that.field.length && x < that.field.length ) {
                            that.field[y][x] = 1;
                        }
                    }
                }

                // console.log('------------');
                //     console.log(that.field[0]);//
                //     console.log(that.field[1]);//
                //     console.log(that.field[2]);//
                //     console.log(that.field[3]);//
                //     console.log(that.field[4]);//
                //     console.log(that.field[5]);//
                //     console.log(that.field[6]);//
                //     console.log(that.field[7]);//
                //     console.log(that.field[8]);//
                //     console.log(that.field[9]);//
                // console.log('------------');
            }

            function drawShipImage () {
                var rotationOffset = ship.rotationType === 'vertical' ? 50 : 0;
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
// var a = 0;//
            // while ( !allSquaresFree ) {
            //     a++;//
            //     if ( a>100 ) {//
            //         console.warn('stack', a);
            //         break;//
            //     }//
                checkAllSquares();

                // move randPosition
            // }

            markAllSquaresAsFull();
            // console.log(JSON.stringify(this.field));

            drawShipImage();


        },

    // drawShip: function( ship ){
        //     var that = this,
        //         randPosition = that.getRandomPosition(),
        //         positionsToCheckX = null,
        //         positionsToCheckY = null,
        //         maxPositionToCheckX = null,
        //         maxPositionToCheckY = null,
        //         allValid = true;

        //     function loopCheck(){
        //         positionsToCheckX = that.getPositionsToCheckX(ship, randPosition),
        //         positionsToCheckY = that.getPositionsToCheckY(ship, randPosition),
        //         maxPositionToCheckX = Math.max.apply(Math, positionsToCheckX),
        //         maxPositionToCheckY = Math.max.apply(Math, positionsToCheckY);

        //         // break the check if the ship is going to be placed outside the field
        //         if ( maxPositionToCheckX > that.field.length || maxPositionToCheckY > that.field.length ) {
        //             // break and get new random position
        //             randPosition = that.getNextPossiblePos( randPosition, ship );
        //             loopCheck();
        //         } else {
        //             // check if all squares are free
        //             allValid = checkAllSquares();

        //             if ( !allValid ) {
        //                 randPosition = that.getNextPossiblePos( randPosition, ship );
        //                 loopCheck();
        //             }
        //         }
        //     }

        //     loopCheck();

        //     function checkAllSquares(){
        //         var valid = true;
        //         for (var y = 0; y < positionsToCheckY.length; y++) {
        //             for (var x = 0; x < positionsToCheckX.length; x++) {
                        
        //                 try {
        //                     if ( that.field[ positionsToCheckY[y] ][ positionsToCheckX[x] ] === 1 ) {
        //                         valid = false;
        //                         break;
        //                     }
        //                 } catch(e) {

        //                 }
        //             }
        //         }

        //         return valid;
        //     }

        //     // ;;;console.log(ship.blocksWidth, ship.blocksHeight, randPosition, positionsToCheckX, positionsToCheckY);
            
        //     // mark positions on field as not free
        //     for (var y = 0; y < positionsToCheckY.length; y++) {
        //         for (var x = 0; x < positionsToCheckX.length; x++) {
        //             try {
        //                 that.field[ positionsToCheckY[y] ][ positionsToCheckX[x] ] = 1;
        //             } catch (e) {

        //             }
        //         }
        //     }


        //     ship.image.x = this.playerFieldLeftOffset + (randPosition.x * 50);
        //     ship.image.y = this.playerFieldTopOffset + (randPosition.y * 50);

        //     var rotate = this.toBeRotated();

        //     if ( rotate ) {
        //         // shipPosition = this.horizontalCheckApprove(ship, randPosition);
        //         ship.rotate();
        //     }

        //     var test = new createjs.Shape();
        //     test.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(0, 0, 50 * ship.blocksWidth, 50 * ship.blocksHeight);
        //     test.x = this.playerFieldLeftOffset + (randPosition.x * 50);
        //     test.y = this.playerFieldTopOffset + (randPosition.y * 50);
        //     this.mainStage.addChild(test);
            
        //     // if ( ship.rotationType === 'vertical' ) {
        //     //     ship.image.x += 50;
        //     // }


        //     /* Example:

        //     5 1 Object {x: 8, y: 6} [7, 8, 9, 10, 11, 12, 13] [5, 6, 7]

        //     4 1 Object {x: 7, y: 7} [6, 7, 8, 9, 10, 11] [6, 7, 8]
        //     3 1 Object {x: 6, y: 5} [5, 6, 7, 8, 9] [4, 5, 6]
        //     2 1 Object {x: 5, y: 5} [4, 5, 6, 7] [4, 5, 6]
        //     2 1 Object {x: 0, y: 7} [-1, 0, 1, 2] [6, 7, 8]
        //     1 1 Object {x: 1, y: 4} [0, 1, 2] [3, 4, 5]
        //     1 1 Object {x: 3, y: 0} [2, 3, 4] [-1, 0, 1]*/
    // },

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

        getValidRandomPosition: function( ship ){
            var position = {},
                maxX = this.field.length - ship.blocksWidth,
                maxY = this.field.length - ship.blocksHeight;

            position.x = Math.floor( Math.random() * maxX );
            position.y = Math.floor( Math.random() * maxY );

            if ( this.field[position.y][position.x] === 1 ) {
                while ( this.field[position.y][position.x] === 1 ) {

                    position.x++;
                    if ( position.x >= maxX ) {
                        position.x = 0;
                        position.y++;

                        if ( position.y >= maxY ) {
                            position.y = 0;
                        }
                    }
                }
            }
// console.log(position.x, position.y, JSON.stringify(this.field));
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

        toBeRotated: function(){
            return Math.floor(Math.random() * 2) === 1 ? true : false;
            // return this.rotations[Math.floor(Math.random() * 2)]
        },

        verticalCheckApprove: function(){

        }
    });
    
    return PlayerField;
});