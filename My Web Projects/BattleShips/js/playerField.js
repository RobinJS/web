define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config'),
        Signal = require('libs/signals.min'),
        utils = require('utils');

    var PlayerField = function( mainStage ){
    	this.mainStage = mainStage;
        this.marker = null;
        this.playerFieldLeftOffset = config.playerFieldData.x;
        this.playerFieldTopOffset = config.playerFieldData.y;
        
    	this.ships = [];
        this.shipsRemaining = 7;
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

        this.shipsContainer = new createjs.Container();
        this.mainStage.addChild( this.shipsContainer );

        this.hitMarks = new createjs.Container();
        this.mainStage.addChild( this.hitMarks );

        this.events = {
            sectorMarked: new Signal()
        };
        // this.rotations = ['horizontal', 'vertical'];
    	// this.clickEnabled = false;
        this.testContainer = new createjs.Container();//
    	this.init();
    };

    $.extend(PlayerField.prototype, {
    	init: function(){
			// create ships and position them before arrange
			var shipsInitialNum = 7;

			for (var i = 0; i < shipsInitialNum; i++) {
				this.ships[i] = new Ship(config.shipsByType[i], this.field);
				// this.mainStage.addChild(this.ships[i].image);
                this.shipsContainer.addChild( this.ships[i].image );
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

    	enableShipsClick: function(){
    		// this.clickEnabled = true;
            this.ships.forEach(function(ship){
                ship.clickEnabled = true;
            });
    	},

        disableShipsClick: function(){
            // this.clickEnabled = true;
            this.ships.forEach(function(ship){
                ship.clickEnabled = false;
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
            // make all sectors around = 1
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
                // test.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(0, 0, 50 * ship.sectorsWidth, 50 * ship.sectorsHeight);
                // test.x = that.playerFieldLeftOffset + (randPosition.x * 50);
                // test.y = that.playerFieldTopOffset + (randPosition.y * 50);

                // that.testContainer.addChild(test);
            }

            utils.checkSectors( ship, this.field, randPosition );
            utils.markSectorsAsFull( ship, this.field, randPosition );
            drawShipImage();
        },

        computersTurn: function(){
            // pick a sector
            var randPosition = this.getNewPosition( this.field );

            this.checkHittedSector( randPosition );
        },

        checkHittedSector: function( hitPosition ){
            if ( this.field[hitPosition.y][hitPosition.x] === 1 ) {
                this.markAsHit( hitPosition );
            } else if ( this.field[hitPosition.y][hitPosition.x] === 0 ) {
                this.markAsEmpty( hitPosition );
            }
        },

        markAsHit: function( hitPosition ){
            this.field[hitPosition.y][hitPosition.x] = 'x';
            var newHitMark = new createjs.Bitmap("img/hitted_mark.png");
            newHitMark.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
            newHitMark.y = hitPosition.y * config.gridSize + config.playerFieldData.y;
            this.hitMarks.addChild( newHitMark );

            console.warn('check if ship is drawn');//

            this.events.sectorMarked.dispatch();
        },

        markAsEmpty: function( hitPosition ){
            this.field[hitPosition.y][hitPosition.x] = '.';
            var newHitMark = new createjs.Bitmap("img/empty_mark.png");
            newHitMark.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
            newHitMark.y = hitPosition.y * config.gridSize + config.playerFieldData.y;
            this.hitMarks.addChild( newHitMark );

            this.events.sectorMarked.dispatch();
        },

        getNewPosition: function( playerField ){
            var position = {},
                maxX = 10,
                maxY = 10;

            position.x = Math.floor( Math.random() * maxX );
            position.y = Math.floor( Math.random() * maxY );

            if ( playerField[position.y][position.x] === 'x' || playerField[position.y][position.x] === '.' ) {
                while ( playerField[position.y][position.x] === 'x' || playerField[position.y][position.x] === '.' ) {

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

            return position;
        }
    });
    
    return PlayerField;
});