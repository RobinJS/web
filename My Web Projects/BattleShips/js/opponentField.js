define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config'),
        Signal = require('libs/signals.min'),
        utils = require('utils');

    var OpponentField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.marker = null;
		this.opponentFieldHitArea = null;
    	this.squareWidth = 50;

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

        this.events = {
            positionToCheck: new Signal(),
            sectorMarked: new Signal()
        };
		
		this.init();
		this.addListeners();
    };

    $.extend(OpponentField.prototype, {
    	init: function(){
			this.marker = new createjs.Shape();
			this.marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(config.opponentFiledData.x, config.opponentFiledData.y, 50, 50);
			this.marker.visible = false;
			this.mainStage.addChild(this.marker);

			this.opponentFieldHitArea = new createjs.Shape();
			this.opponentFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(config.opponentFiledData.x, config.opponentFiledData.y, config.fieldWidth, config.fieldHeight);
			this.opponentFieldHitArea.visible = false;
            this.mainStage.addChild(this.opponentFieldHitArea);

            var shipsInitialNum = 7;
            for (var i = 0; i < shipsInitialNum; i++) {
                this.ships[i] = new Ship(config.shipsByType[i], this.field);
            }

            this.autoArrange();
    	},

    	addListeners: function(){
    		this.mainStage.on('stagemousemove', function(e) {
    			// check if cursor is outside strike field's bounds
    			if ( !this.markerEnabled ) return;

    			if ( (e.stageX <= config.opponentFiledData.x || e.stageY <= config.opponentFiledData.y) || (e.stageX >= config.opponentFiledData.x + config.fieldWidth || e.stageY >= config.opponentFiledData.y + config.fieldHeight ) ) return;

    			this.marker.x = Math.floor( ( e.stageX / this.squareWidth) ) * this.squareWidth - config.opponentFiledData.x;
    			this.marker.y = Math.floor( ( e.stageY / this.squareWidth) ) * this.squareWidth - config.opponentFiledData.y;
    		}.bind(this));

    		this.opponentFieldHitArea.on('click', function(e){
    			if ( !this.markerEnabled ) return;

                var hitPosition = { x: this.marker.x / config.gridSize, y: this.marker.y / config.gridSize };
                if ( this.field[hitPosition.y][hitPosition.x] !== 'x' && this.field[hitPosition.y][hitPosition.x] !== '.') {
                    this.events.positionToCheck.dispatch( hitPosition );
                }
    		}.bind(this));
    	},

        autoArrange: function(){
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

            window.marks = this.hitMarks;//
            console.warn('remove');//
        },

        enableHitMarker: function(){
            this.markerEnabled = true;
            this.marker.visible = true;
            this.opponentFieldHitArea.visible = true;
        },

        disableHitMarker: function(){
            this.markerEnabled = false;
            this.marker.visible = false;
            this.opponentFieldHitArea.visible = false;
        },

        markAsHit: function( hitPosition ){
            this.field[hitPosition.y][hitPosition.x] = 'x';
            var newHitMark = new createjs.Bitmap("img/hitted_mark.png");
            newHitMark.x = hitPosition.x * config.gridSize + config.opponentFiledData.x;
            newHitMark.y = hitPosition.y * config.gridSize + config.opponentFiledData.y;
            this.hitMarks.addChild( newHitMark );

            console.warn('check if ship is drawn');//
            // this.checkForSunkShip( hitPosition );
            this.ships.forEach(function(ship){
                if ( (hitPosition.x >= ship.startSectorX && hitPosition.x <= ship.endSectorX) && (hitPosition.y >= ship.startSectorY && hitPosition.y <= ship.endSectorY) ) {
                    ship.sectorsHitted++;
                    // mark in info header 
                    
                    // check if ship sunk
                    if ( ship.sectorsHitted === ship.size ) {
                        ship.sunk = true;
                        this.markShipSunk( ship );
                    }
                }
            }.bind(this));

            this.events.sectorMarked.dispatch();
        },

        markAsEmpty: function( hitPosition ){
            this.field[hitPosition.y][hitPosition.x] = '.';
            var newHitMark = new createjs.Bitmap("img/empty_mark.png");
            newHitMark.x = hitPosition.x * config.gridSize + config.opponentFiledData.x;
            newHitMark.y = hitPosition.y * config.gridSize + config.opponentFiledData.y;
            this.hitMarks.addChild( newHitMark );

            this.events.sectorMarked.dispatch();
        },

        markShipSunk: function( ship ){
            var sunkMark = new createjs.Shape();
            sunkMark.graphics.setStrokeStyle(1).beginFill('rgba(0, 101, 155, 0.7)').rect(0, 0, ship.sectorsWidth * config.gridSize, ship.sectorsHeight * config.gridSize);
            
            sunkMark.x = ship.startSectorX * config.gridSize + config.opponentFiledData.x;
            sunkMark.y = ship.startSectorY * config.gridSize + config.opponentFiledData.y;
            this.hitMarks.addChild( sunkMark );
        }
    });
    
    return OpponentField;
});