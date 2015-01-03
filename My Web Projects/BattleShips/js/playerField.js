define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config'),
        Signal = require('libs/signals.min'),
        utils = require('utils'),
        soundPlayer = require('soundPlayer');

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

        this.explosionAnim = new createjs.Sprite(new createjs.SpriteSheet({
            images: ["./img/explosion.png"],
            frames: {width: 50, height: 50},
            animations: {
                anim:[0, 32, false]
            }
        }));

        this.explosionAnim.visible = false;
        this.mainStage.addChild(this.explosionAnim);

        this.waterSplashAnim = new createjs.Sprite(new createjs.SpriteSheet({
            images: ["./img/water_splash.png"],
            frames: {width: 50, height: 50},
            animations: {
                anim: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], next: false, speed: 0.5 }
            }
        }));

        this.waterSplashAnim.visible = false;
        this.mainStage.addChild(this.waterSplashAnim);

        this.events = {
            fullSectorMarked: new Signal(),
            emptySectorMarked: new Signal(),
            updateShipsRemainingText: new Signal(),
            endGame: new Signal()
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
        },

        checkHittedSector: function( hitPosition ){
            if ( this.field[hitPosition.y][hitPosition.x] === 1 ) {
                this.markAsHit( hitPosition );
            } else if ( this.field[hitPosition.y][hitPosition.x] === 0 ) {
                this.markAsEmpty( hitPosition );
            }
        },

        markAsHit: function( hitPosition ){
            var that = this;

            function animEndHandler(){
                that.explosionAnim.removeEventListener('animationend', animEndHandler);
                that.explosionAnim.visible = false;

                var newHitMark = new createjs.Bitmap("img/hitted_mark.png");
                newHitMark.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
                newHitMark.y = hitPosition.y * config.gridSize + config.playerFieldData.y;
                that.hitMarks.addChild( newHitMark );
                
                that.ships.forEach(function(ship){
                    if ( (hitPosition.x >= ship.startSectorX && hitPosition.x <= ship.endSectorX) && (hitPosition.y >= ship.startSectorY && hitPosition.y <= ship.endSectorY) ) {
                        ship.sectorsHitted++;
                        // mark in info header 

                        // check if ship sunk
                        if ( ship.sectorsHitted === ship.size ) {
                            ship.sunk = true;
                            that.shipsRemaining--;
                            that.events.updateShipsRemainingText.dispatch();
                            that.markShipSunk( ship );
                            
                            // check if all ships sunk
                            if ( that.shipsRemaining === 0 ) {
                                that.events.endGame.dispatch();
                            }
                        }
                    }
                });

                that.events.fullSectorMarked.dispatch();
            }

            this.field[hitPosition.y][hitPosition.x] = 'x';

            this.explosionAnim.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
            this.explosionAnim.y = hitPosition.y * config.gridSize + config.playerFieldData.y;

            this.explosionAnim.addEventListener('animationend', animEndHandler);
            this.explosionAnim.visible = true;
            soundPlayer.playExplosionSound();
            this.explosionAnim.gotoAndPlay('anim');

            console.warn('check if ship is drawn');//
            // this.checkForSunkShip( hitPosition );
        },

        markAsEmpty: function( hitPosition ){
            var that = this;

            function animEndHandler(){
                that.waterSplashAnim.removeEventListener('animationend', animEndHandler);
                that.waterSplashAnim.visible = false;

                var newHitMark = new createjs.Bitmap("img/empty_mark.png");
                newHitMark.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
                newHitMark.y = hitPosition.y * config.gridSize + config.playerFieldData.y;
                that.hitMarks.addChild( newHitMark );
                
                that.events.emptySectorMarked.dispatch();
            }

            this.field[hitPosition.y][hitPosition.x] = '.';

            this.waterSplashAnim.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
            this.waterSplashAnim.y = hitPosition.y * config.gridSize + config.playerFieldData.y;

            this.waterSplashAnim.addEventListener('animationend', animEndHandler);
            this.waterSplashAnim.visible = true;
            soundPlayer.playWateronSound();
            this.waterSplashAnim.gotoAndPlay('anim');
        },

        markShipSunk: function( ship ){
            var sunkMark = new createjs.Shape();
            sunkMark.graphics.setStrokeStyle(1).beginFill('rgba(0, 101, 155, 0.7)').rect(0, 0, ship.sectorsWidth * config.gridSize, ship.sectorsHeight * config.gridSize);
            
            sunkMark.x = ship.startSectorX * config.gridSize + config.playerFieldData.x;
            sunkMark.y = ship.startSectorY * config.gridSize + config.playerFieldData.y;
            this.hitMarks.addChild( sunkMark );
        }
    });
    
    return PlayerField;
});