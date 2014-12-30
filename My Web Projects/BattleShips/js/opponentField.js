define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config'),
        Signal = require('libs/signals.min'),
        utils = require('utils');

    var OpponentField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = null;
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
    		this.gridImage = new createjs.Bitmap("img/grid.png");
			this.gridImage.x = config.opponentFiledData.x;
			this.gridImage.y = config.opponentFiledData.y;
			this.mainStage.addChild(this.gridImage);

			this.marker = new createjs.Shape();
			this.marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(config.opponentFiledData.x, config.opponentFiledData.y, 50, 50);
			this.marker.visible = false;
			this.mainStage.addChild(this.marker);

			this.opponentFieldHitArea = new createjs.Shape();
			this.opponentFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(config.opponentFiledData.x, config.opponentFiledData.y, config.fieldWidth, config.fieldHeight);
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

            utils.checkAllSquares( ship, this.field, randPosition );
            utils.markAllSquaresAsFull( ship, this.field, randPosition );
            ship.arrangedRotationType = ship.rotationType;
        },

        checkHittedSector: function( hitPosition ){
            if ( this.field[hitPosition.y][hitPosition.x] === 1 ) {
                this.markAsHit( hitPosition );
            } else if ( this.field[hitPosition.y][hitPosition.x] === 0 ) {
                this.markAsEmpty( hitPosition );
            }

            window.marks = this.hitMarks;
        },

        enableHitMarker: function(){
            this.markerEnabled = true;
            this.marker.visible = true;
        },

        disableHitMarker: function(){
            this.markerEnabled = false;
            this.marker.visible = false;
        },

        markAsHit: function( hitPosition ){
            this.field[hitPosition.y][hitPosition.x] = 'x';
            var newHitMark = new createjs.Bitmap("img/hitted_mark.png");
            newHitMark.x = hitPosition.x * config.gridSize + config.opponentFiledData.x;
            newHitMark.y = hitPosition.y * config.gridSize + config.opponentFiledData.y;
            this.hitMarks.addChild( newHitMark );

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

        makeTurn: function( playerField ){
            // pick a sector
            var randPosition = this.getRandomPlayerFieldPosition( playerField );

            
        },

        getRandomPlayerFieldPosition: function( playerField ){
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
    
    return OpponentField;
});