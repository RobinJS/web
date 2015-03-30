define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config'),
        Signal = require('signals'),
        utils = require('utils'),
        soundPlayer = require('soundPlayer');

    var OpponentField = function( mainStage ){
    	this.mainStage = mainStage;

		this.markerEnabled = false;
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

        this.hitMarks = new createjs.Container();
        this.mainStage.addChild( this.hitMarks );

        this.pointerMarker = new createjs.Shape();
        this.pointerMarker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(config.opponentFiledData.x, config.opponentFiledData.y, 50, 50);
        this.pointerMarker.visible = false;
        this.mainStage.addChild(this.pointerMarker);

        this.opponentFieldHitArea = new createjs.Shape();
        this.opponentFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(config.opponentFiledData.x, config.opponentFiledData.y, config.fieldWidth, config.fieldHeight);
        this.opponentFieldHitArea.visible = false;
        this.mainStage.addChild(this.opponentFieldHitArea);

        this.explosionAnim = new createjs.Sprite(new createjs.SpriteSheet({
            images: ["./img/explosion.png"],
            frames: {width: 50, height: 50},
            animations: {
                anim:[0, 32, false, 1.5]
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
            positionToCheck: new Signal(),
            fullSectorMarked: new Signal(),
            emptySectorMarked: new Signal(),
            updateShipsRemainingText: new Signal(),
            endGame: new Signal()
        };
		
		this.init();
		this.addListeners();
    };

    $.extend(OpponentField.prototype, {
    	init: function(){
            var shipsInitialNum = 7;
            for (var i = 0; i < shipsInitialNum; i++) {
                this.ships[i] = new Ship(config.shipsByType[i], this.field);
            }
    	},

    	addListeners: function(){
    		this.mainStage.on('stagemousemove', function(e) {
    			// check if cursor is outside strike field's bounds
    			if ( !this.markerEnabled ) return;

    			if ( (e.stageX <= config.opponentFiledData.x || e.stageY <= config.opponentFiledData.y) || (e.stageX >= config.opponentFiledData.x + config.fieldWidth || e.stageY >= config.opponentFiledData.y + config.fieldHeight ) ) return;

    			this.pointerMarker.x = Math.floor( ( e.stageX / config.gridSize) ) * config.gridSize - config.opponentFiledData.x;
    			this.pointerMarker.y = Math.floor( ( e.stageY / config.gridSize) ) * config.gridSize - config.opponentFiledData.y;
    		}.bind(this));

    		this.opponentFieldHitArea.on('click', function(e){
    			if ( !this.markerEnabled ) return;

                var hitPosition = { x: this.pointerMarker.x / config.gridSize, y: this.pointerMarker.y / config.gridSize };
                if ( this.field[hitPosition.y][hitPosition.x] !== 'x' && this.field[hitPosition.y][hitPosition.x] !== '.') {
                    this.events.positionToCheck.dispatch( hitPosition );
                }
    		}.bind(this));
    	},

        autoArrange: function(){
            this.clearField();

            this.ships.forEach(function(ship, idx){
                var rotate = utils.toBeRotated();

                if ( rotate ) {
                    ship.rotate();
                }
                
                this.markShipOnField(ship);
            }.bind(this));
        },

        markShipOnField: function( ship ){
            var that = this,
                allSquaresFree = false,
                randPosition = utils.getValidRandomPosition( ship, this.field );

            utils.checkSectors( ship, this.field, randPosition );
            utils.markSectorsAsFull( ship, this.field, randPosition );
            ship.arrangedRotationType = ship.rotationType;
        },

        checkHittedSector: function( hitPosition ){
            if ( this.field[hitPosition.y][hitPosition.x] === 1 ) {
                this.markAsHit( hitPosition );
            } else if ( this.field[hitPosition.y][hitPosition.x] === 0 ) {
                this.markAsEmpty( hitPosition );
            }
        },

        enableHitMarker: function(){
            this.markerEnabled = true;
            this.pointerMarker.visible = true;
            this.opponentFieldHitArea.visible = true;
        },

        disableHitMarker: function(){
            this.markerEnabled = false;
            this.pointerMarker.visible = false;
            this.opponentFieldHitArea.visible = false;
        },

        markAsHit: function( hitPosition ){
            var that = this;

            function animEndHandler(){
                that.explosionAnim.removeEventListener('animationend', animEndHandler);
                that.explosionAnim.visible = false;

                var newHitMark = new createjs.Bitmap("img/hitted_mark.png");
                newHitMark.x = hitPosition.x * config.gridSize + config.opponentFiledData.x;
                newHitMark.y = hitPosition.y * config.gridSize + config.opponentFiledData.y;
                that.hitMarks.addChild( newHitMark );

                that.ships.forEach(function(ship, idx){
                    if ( (hitPosition.x >= ship.startSectorX && hitPosition.x <= ship.endSectorX) && (hitPosition.y >= ship.startSectorY && hitPosition.y <= ship.endSectorY) ) {
                        ship.sectorsHitted++;

                        // check if ship sunk
                        if ( ship.sectorsHitted === ship.size ) {
                            ship.sunk = true;
                            that.shipsRemaining--;
                            that.events.updateShipsRemainingText.dispatch();
                            that.markShipSunk( ship );
                            that.markSurroundingSectorsAsEmpty( ship );
                        }
                    }

                    if ( idx === that.ships.length - 1 ) {
                        // check if all ships sunk
                        if ( that.shipsRemaining === 0 ) {
                            that.events.endGame.dispatch();
                        } else {
                            that.events.fullSectorMarked.dispatch();
                        }
                    }
                });
            }

            this.disableHitMarker();

            this.field[hitPosition.y][hitPosition.x] = 'x';

            this.explosionAnim.x = hitPosition.x * config.gridSize + config.opponentFiledData.x;
            this.explosionAnim.y = hitPosition.y * config.gridSize + config.opponentFiledData.y;

            this.explosionAnim.addEventListener('animationend', animEndHandler);

            this.explosionAnim.visible = true;

            soundPlayer.playExplosionSound();
            this.explosionAnim.gotoAndPlay('anim');
        },

        markAsEmpty: function( hitPosition ){
            var that = this;

            function animEndHandler(){
                that.waterSplashAnim.removeEventListener('animationend', animEndHandler);
                that.waterSplashAnim.visible = false;

                that.addEmptyHitMark( hitPosition );
                that.events.emptySectorMarked.dispatch();
            }

            this.disableHitMarker();

            this.field[hitPosition.y][hitPosition.x] = '.';

            this.waterSplashAnim.x = hitPosition.x * config.gridSize + config.opponentFiledData.x;
            this.waterSplashAnim.y = hitPosition.y * config.gridSize + config.opponentFiledData.y;

            this.waterSplashAnim.addEventListener('animationend', animEndHandler);

            this.waterSplashAnim.visible = true;
            soundPlayer.playWateronSound();
            this.waterSplashAnim.gotoAndPlay('anim');
        },

        addEmptyHitMark: function( hitPosition ){
            var newHitMark = new createjs.Bitmap("img/empty_mark.png");
            newHitMark.x = hitPosition.x * config.gridSize + config.opponentFiledData.x;
            newHitMark.y = hitPosition.y * config.gridSize + config.opponentFiledData.y;
            this.hitMarks.addChild( newHitMark );
        },

        markShipSunk: function( ship ){
            var sunkMark = new createjs.Shape();
            sunkMark.graphics.setStrokeStyle(1).beginFill('rgba(0, 101, 155, 0.7)').rect(0, 0, ship.sectorsWidth * config.gridSize, ship.sectorsHeight * config.gridSize);
            
            sunkMark.x = ship.startSectorX * config.gridSize + config.opponentFiledData.x;
            sunkMark.y = ship.startSectorY * config.gridSize + config.opponentFiledData.y;
            this.hitMarks.addChild( sunkMark );
        },

        markSurroundingSectorsAsEmpty: function( ship ){
            for (var y = ship.startSectorY - 1; y <= ship.endSectorY + 1; y++) {
                for (var x = ship.startSectorX - 1; x <= ship.endSectorX + 1; x++) {
                    if ( y >= 0 && y < this.field.length && x >= 0 && x < this.field.length ) {
                        var sector = this.field[y][x];
                        if ( sector == 0 ) {
                            this.field[y][x] = '.';
                            this.addEmptyHitMark( {x: x, y: y} );
                        }
                    }
                }
            }
        },

        clearField: function(){
            for (var i = 0; i < this.field.length; i++) {
                for (var j = 0; j < this.field.length; j++) {
                    this.field[i][j] = 0;
                }
            }
        },

        reset: function(){
            this.hitMarks.removeAllChildren();
            this.shipsRemaining = 7;

            this.ships.forEach(function(ship){
                ship.sectorsHitted = 0;
                ship.sunk = false;
            });
        }
    });
    
    return OpponentField;
});