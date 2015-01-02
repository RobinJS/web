define(function (require) {
    "use strict";

    var config = require('config'),
        Signal = require('libs/signals.min');

    var Ship = function( type, field ){
    	this.type = type;
        this.field = field;
    	this.size = this.getSize( type );
        this.sectorsHitted = 0;
        // this.width = config.shipsData[type].width;
        // this.height = config.shipsData[type].height;

        this.sectorsWidth = this.size;
        this.sectorsHeight = 1;
        this.rotationType = 'horizontal';
        this.clickEnabled = false;
        this.sunk = false;

        // this.image.regX = this.width / 2;
        // this.image.regY = this.height / 2;
        this.image = new createjs.Bitmap(config.shipsData[type].imagePath);
        this.image.x = 0;
        this.image.y = 0;

        this.arrangedX = this.image.x;
        this.arrangedY = this.image.y;
        this.arrangedRotationType = this.rotationType;

        this.pointerDistanceX = 0;
        this.pointerDistanceY = 0;

        this.startX = null;
        this.startY = null;

        this.startSectorX = null;
        this.startSectorY = null;
        this.endSectorX = null;
        this.endSectorY = null;

        this.events = {
            emptySectorsUnderShip: new Signal()
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

            // this.events.emptySectorsUnderShip.dispatch( this );
            this.emptySectorsUnderShip();
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
            
            this.markSectorsAsFull();
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

            if ( nexImageX < config.playerFieldData.x + rotationOffset || nexImageY < config.playerFieldData.y || nexImageX + this.sectorsWidth * config.gridSize - rotationOffset > config.playerFieldData.endX || nexImageY + this.sectorsHeight * config.gridSize > config.playerFieldData.endY ) {
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

            var oldBlocksWidth = this.sectorsWidth,
                oldBlocksHeight = this.sectorsHeight;

            this.sectorsWidth = oldBlocksHeight;
            this.sectorsHeight = oldBlocksWidth;
        },

        getRotationOffset: function(){
            return this.rotationType === 'vertical' ? 50 : 0;
        },

        overAnotherShip: function(){
            var rotationOffset = this.getRotationOffset(),
                startSectorX = (this.image.x - rotationOffset) / config.gridSize - 1,
                startSectorY = (this.image.y - config.playerFieldData.y) / config.gridSize,
                endSectorX = startSectorX + this.sectorsWidth - 1,
                endSectorY = startSectorY + this.sectorsHeight - 1,
                overAnotherShip = false;

                for (var y = startSectorY; y <= endSectorY; y++) {
                    for (var x = startSectorX; x <= endSectorX; x++) {
                        if ( this.field[y][x] === 1 ) {
                            overAnotherShip = true;
                            break;
                        }
                    }
                }

            return overAnotherShip;
        },

        markSectorsAsFull: function(){
            var rotationOffset = this.getRotationOffset(),
                startSectorX = (this.image.x - rotationOffset) / config.gridSize - 1,
                startSectorY = (this.image.y - config.playerFieldData.y) / config.gridSize,
                endSectorX = startSectorX + this.sectorsWidth - 1,
                endSectorY = startSectorY + this.sectorsHeight - 1;

            for (var y = startSectorY; y <= endSectorY; y++) {
                for (var x = startSectorX; x <= endSectorX; x++) {
                   this.field[y][x] = 1;
                }
            }
        },

        emptySectorsUnderShip: function(){
            var rotationOffset = this.getRotationOffset(),
                startSectorX = (this.image.x - rotationOffset) / config.gridSize - 1,
                startSectorY = (this.image.y - config.playerFieldData.y) / config.gridSize,
                endSectorX = startSectorX + this.sectorsWidth - 1,
                endSectorY = startSectorY + this.sectorsHeight - 1;

            for (var y = startSectorY; y <= endSectorY; y++) {
                for (var x = startSectorX; x <= endSectorX; x++) {
                   this.field[y][x] = 0;
                }
            }
        }

    });

    return Ship;
});