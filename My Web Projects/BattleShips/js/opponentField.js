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
    	this.opponentFieldLeftOffset = 650;
    	this.opponentFieldTopOffset = 250;
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

        this.events = {
            positionToCheck: new Signal()
        };
		
		this.init();
		this.addListeners();
    };

    $.extend(OpponentField.prototype, {
    	init: function(){
    		this.gridImage = new createjs.Bitmap("img/grid.png");
			this.gridImage.x = 650
			this.gridImage.y = 250;
			this.mainStage.addChild(this.gridImage);

			this.marker = new createjs.Shape();
			this.marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(this.opponentFieldLeftOffset, this.opponentFieldTopOffset, 50, 50);
			this.marker.visible = false;
			this.mainStage.addChild(this.marker);

			this.opponentFieldHitArea = new createjs.Shape();
			this.opponentFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(this.opponentFieldLeftOffset, this.opponentFieldTopOffset, config.fieldWidth, config.fieldHeight);
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

    			if ( (e.stageX <= this.opponentFieldLeftOffset || e.stageY <= this.opponentFieldTopOffset) || (e.stageX >= this.opponentFieldLeftOffset + config.fieldWidth || e.stageY >= this.opponentFieldTopOffset + config.fieldHeight ) ) return;

    			this.marker.x = Math.floor( ( e.stageX / this.squareWidth) ) * this.squareWidth - this.opponentFieldLeftOffset;
    			this.marker.y = Math.floor( ( e.stageY / this.squareWidth) ) * this.squareWidth - this.opponentFieldTopOffset;
    		}.bind(this));

    		this.opponentFieldHitArea.on('click', function(e){
    			if ( !this.markerEnabled ) return;

                var hitPosition = { x: this.marker.x / config.gridSize, y: this.marker.y / config.gridSize };

    			this.events.positionToCheck.dispatch( hitPosition );
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
        }
    });
    
    return OpponentField;
});