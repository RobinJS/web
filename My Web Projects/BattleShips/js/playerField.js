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
                var randPosition = this.getRandomPosition(),
                    rotation = 'horizontal', //this.getRotation(),
                    shipPosition = {};

                if ( rotation === 'horizontal' ) {
                    shipPosition = this.horizontalCheckApprove(ship, randPosition);
                } else {
                    shipPosition = this.verticalCheckApprove();
                }

            var test = new createjs.Shape();
            test.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(0, 0, 50 * ship.size, 50);
            test.x = this.playerFieldLeftOffset + (shipPosition.x * 50);
            test.y = this.playerFieldTopOffset + (shipPosition.y * 50);
            this.mainStage.addChild(test);

            }.bind(this));
        },

        getRandomPosition: function(){
            var position = {};
            position.x = Math.floor(Math.random() * 10);
            position.y = Math.floor(Math.random() * 10);
            return position;
        },

        getRotation: function(){
            return this.rotations[Math.floor(Math.random() * 2)]
        },

        horizontalCheckApprove: function( ship, randPosition ){
            var that = this,
                startPosition = randPosition,
                positionsToCheck = ship.size,
                first = 0,
                last = 0;


            function check(){
                first = startPosition.x,
                last = startPosition.x + ship.size - 1;

                if ( last >= that.field.length ) {
                    startPosition.x = 0;
                    startPosition.y++;
                    if ( startPosition.y >= that.field.length ) {
                        startPosition.y = 0;
                    }
                    check();
                } else {
                    if ( that.field[startPosition.y][startPosition.x] === 0) {
                        positionsToCheck--;

                        // check if next positions are free
                        for (var i = first + 1; i <= last; i++) {
                            if ( that.field[startPosition.y][i] === 0 ) {
                                positionsToCheck--;

                                // check if positionsToCheck === 0
                                if ( positionsToCheck === 0 ) {
                                    return;
                                }
                            } else {
                                // not free
                                // change first and search again
                                positionsToCheck = ship.size;
                                changeFirstPos();
                                check();
                                return;
                            }
                        }
                    } else {
                        // check next pos
                        changeFirstPos();
                        check();
                    }
                }
            }


            // function check(){
            //     if ( startPosition.x <= that.field.length - ship.size ) {
            //         if ( that.field[startPosition.y][startPosition.x] === 0 ) {
            //             positionsChecked--;

            //             if ( positionsChecked === 0) {
            //                 markShipInField();
            //                 return;
            //             }

            //             // check other positions if free
            //             for (var i = 1; i <= ship.size - 1; i++) {
            //                 if ( that.field[startPosition.y][startPosition.x + i] === 0 ) {
            //                     positionsChecked--;
            //                 } else {
            //                     // change start position
            //                     startPosition.x = startPosition.x + i + 1;
            //                     if ( startPosition.x <= that.field.length - ship.size ) {
            //                         startPosition.y++;
            //                     }

            //                     if ( startPosition.y >= that.field.length ) {
            //                         startPosition.y = 0;
            //                     }

            //                     positionsChecked = 1;
            //                     check();
            //                 }
            //             }

            //             if ( positionsChecked === 0 ) {
            //                 markShipInField();
            //                 return;
            //             } else {
            //                 positionsChecked = 1;
            //                 check();
            //             }


            //         } else {
            //             startPosition.x++;
            //             check();
            //         }
            //     } else {
            //         startPosition.x = 0;
            //         startPosition.y++;
            //         if ( startPosition.y >= that.field.length ) {
            //             startPosition.y = 0;
            //         }
            //         check();
            //     }

            //     function markShipInField(){
            //         for (var i = startPosition.x; i < that.field.length - ship.size; i++) {
            //             that.field[startPosition.y][i] = 1;
            //         }

            //         ;;;console.log(JSON.stringify(that.field));
            //     }

            // }

            check();

            function changeFirstPos(){
                startPosition.x += 2;
                if ( startPosition.x >= that.field.length ) {
                    startPosition.x = 0;
                    startPosition.y++;
                }

                if ( startPosition.y >= that.field.length ) {
                    startPosition.y = 0;
                }
            }

            // mark ship on the field array
            for (var i = first; i <= last; i++) {
                that.field[startPosition.y][i] = 1;
            }

            ;;;console.log(JSON.stringify(this.field));

            return startPosition;
        },

        verticalCheckApprove: function(){

        }
    });
    
    return PlayerField;
});