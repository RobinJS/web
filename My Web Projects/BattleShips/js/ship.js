define(function (require) {
    "use strict";

    var config = require('config'),
        Signal = require('libs/signals.min');

    var Ship = function( type, field ){
    	this.type = type;
        this.field = field;
    	this.size = this.getSize( type );
    	this.image = new createjs.Bitmap(config.shipsData[type].imagePath);

        this.width = config.shipsData[type].width;
        this.height = config.shipsData[type].height;

        this.blocksWidth = this.size;
        this.blocksHeight = 1;

        // this.image.regX = this.width / 2;
        // this.image.regY = this.height / 2;
    	this.image.x = 0;
    	this.image.y = 0;
        this.rotationType = 'horizontal';

        this.arrangedX = this.image.x;
        this.arrangedY = this.image.y;
        this.arrangedRotationType = this.rotationType;

        this.pointerDistanceX = 0;
        this.pointerDistanceY = 0;
        this.clickEnabled = false;

        this.startX = null;
        this.startY = null;

        this.events = {
            emptyCellsUnderShip: new Signal()
        };

    	this.image.addEventListener('pressmove', function( e ){
            if ( !this.clickEnabled ) return;
            
            this.move( e );
        }.bind(this));

        this.image.addEventListener('mousedown', function( e ){

            this.startX = Math.floor( e.stageX / config.gridSize) * config.gridSize;
            this.startY = Math.floor( e.stageY / config.gridSize) * config.gridSize;

            this.pointerDistanceX = this.startX - this.image.x;
            this.pointerDistanceY = this.startY - this.image.y;

            // this.events.emptyCellsUnderShip.dispatch( this );
            this.emptyCellsUnderShip();
        }.bind(this));

        this.image.addEventListener('pressup', function( e ){
            // check if there is another ship under
            if ( this.overAnotherShip() ) {
                // return ship to las position
                this.image.x = this.arrangedX;
                this.image.y = this.arrangedY;
            } else {
                this.arrangedX = this.image.x;
                this.arrangedY = this.image.y;
            }
            
            this.markAllSquaresAsFull();
        }.bind(this));
    };

    $.extend(Ship.prototype, {
    	getSize: function( type ){
    		var size = 0;

    		switch ( type ) {
    			case 'aircraftCarrier':
    				size = 5;
    			break;
    			case 'battleship':
    				size = 4;
    			break;
    			case 'cruiser':
    				size = 3;
    			break;
    			case 'destroyer':
    				size = 2;
    			break;
                case 'destroyer2':
                    size = 2;
                break;
    			case 'submarine':
    				size = 1;
    			break;
                case 'submarine2':
                    size = 1;
                break;
    		}

    		return size;
    	},

    	move: function( e ){
            // check if ship goes outside battlefield's bounds
            var nexImageX = Math.floor( e.stageX / config.gridSize) * config.gridSize - this.pointerDistanceX,
                nexImageY = Math.floor( e.stageY / config.gridSize) * config.gridSize - this.pointerDistanceY,
                rotationOffset = this.getRotationOffset();

            if ( nexImageX < config.playerFieldData.x + rotationOffset || nexImageY < config.playerFieldData.y || nexImageX + this.blocksWidth * config.gridSize - rotationOffset > config.playerFieldData.endX || nexImageY + this.blocksHeight * config.gridSize > config.playerFieldData.endY ) {
                return;
            }

            this.image.x = nexImageX;
            this.image.y = nexImageY;
    	},

        rotate: function(){
            if ( this.rotationType === 'horizontal' ) {
                this.rotationType = 'vertical';
                this.image.rotation = 90;
            } else {
                this.rotationType = 'horizontal';
                this.image.rotation = 0;
            }

            var oldBlocksWidth = this.blocksWidth,
                oldBlocksHeight = this.blocksHeight;

            this.blocksWidth = oldBlocksHeight;
            this.blocksHeight = oldBlocksWidth;
        },

        getRotationOffset: function(){
            return this.rotationType === 'vertical' ? 50 : 0;
        },

        overAnotherShip: function(){
            var rotationOffset = this.getRotationOffset(),
                startCellX = (this.image.x - rotationOffset) / config.gridSize - 1,
                startCellY = (this.image.y - config.playerFieldData.y) / config.gridSize,
                endCellX = startCellX + this.blocksWidth - 1,
                endCellY = startCellY + this.blocksHeight - 1,
                overAnotherShip = false;

                for (var y = startCellY; y <= endCellY; y++) {
                    for (var x = startCellX; x <= endCellX; x++) {
                        if ( this.field[y][x] === 1 ) {
                            overAnotherShip = true;
                            break;
                        }
                    }
                }

            return overAnotherShip;
        },

        markAllSquaresAsFull: function(){
            var rotationOffset = this.getRotationOffset(),
                startCellX = (this.image.x - rotationOffset) / config.gridSize - 1,
                startCellY = (this.image.y - config.playerFieldData.y) / config.gridSize,
                endCellX = startCellX + this.blocksWidth - 1,
                endCellY = startCellY + this.blocksHeight - 1;

            for (var y = startCellY; y <= endCellY; y++) {
                for (var x = startCellX; x <= endCellX; x++) {
                   this.field[y][x] = 1;
                }
            }
        },

        emptyCellsUnderShip: function(){
            var rotationOffset = this.getRotationOffset(),
                startCellX = (this.image.x - rotationOffset) / config.gridSize - 1,
                startCellY = (this.image.y - config.playerFieldData.y) / config.gridSize,
                endCellX = startCellX + this.blocksWidth - 1,
                endCellY = startCellY + this.blocksHeight - 1;

            for (var y = startCellY; y <= endCellY; y++) {
                for (var x = startCellX; x <= endCellX; x++) {
                   this.field[y][x] = 0;
                }
            }
        }

    });

    return Ship;
});