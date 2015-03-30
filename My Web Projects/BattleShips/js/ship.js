define(function (require) {
    "use strict";

    var config = require('config'),
        Signal = require('signals');

    var Ship = function( type, field ){
    	this.type = type;
        this.field = field;
    	this.size = this.getSize( type );
        this.sectorsHitted = 0;
        this.availableSectors = [];

        this.sectorsWidth = this.size;
        this.sectorsHeight = 1;
        this.rotationType = 'horizontal';
        this.clickEnabled = false;
        this.sunk = false;

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
            emptySectorsUnderShip: new Signal(),
            showAvailableArea: new Signal(),
            hideAvailableArea: new Signal(),
            lastClickedShip: new Signal()
        };

    	this.image.addEventListener('pressmove', function( e ){
            if ( !this.clickEnabled ) return;
            
            this.move( e );
        }.bind(this));

        this.image.addEventListener('mousedown', function( e ){
            if ( !this.clickEnabled ) return;
            this.startX = Math.floor( e.stageX / config.gridSize) * config.gridSize;
            this.startY = Math.floor( e.stageY / config.gridSize) * config.gridSize;

            this.pointerDistanceX = this.startX - this.image.x;
            this.pointerDistanceY = this.startY - this.image.y;

            this.emptySectorsUnderShip();
            this.events.showAvailableArea.dispatch();
        }.bind(this));

        this.image.addEventListener('pressup', function( e ){
            if ( !this.clickEnabled ) return;

            // check if ship is dropped over available area
            if ( this.validDrop() ) {
                this.arrangedX = this.image.x;
                this.arrangedY = this.image.y;

                this.markSectorsAsFull();
            } else {
                // return ship to lass position
                this.image.x = this.arrangedX;
                this.image.y = this.arrangedY;
            }
            
            this.events.lastClickedShip.dispatch();
            this.events.hideAvailableArea.dispatch();
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

        validDrop: function(){
            // iterate ship sectors
            var rotationOffset = this.getRotationOffset(),
                startSectorX = (this.image.x - rotationOffset) / config.gridSize - 1,
                startSectorY = (this.image.y - config.playerFieldData.y) / config.gridSize,
                endSectorX = startSectorX + this.sectorsWidth - 1,
                endSectorY = startSectorY + this.sectorsHeight - 1,
                canBeDropped = true;

                for (var y = startSectorY; y <= endSectorY; y++) {
                    for (var x = startSectorX; x <= endSectorX; x++) {
                        var sectorCode = '' + y + x;

                        if ( this.availableSectors.indexOf( sectorCode ) === -1 ) {
                            canBeDropped = false;
                            break;
                        }
                    }
                }

            return canBeDropped;
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
            var oldBlocksWidth = this.sectorsWidth,
                oldBlocksHeight = this.sectorsHeight;

            this.sectorsWidth = oldBlocksHeight;
            this.sectorsHeight = oldBlocksWidth;

            if ( this.rotationType === 'horizontal' ) {
                this.rotationType = 'vertical';
                this.image.rotation = 90;
                this.image.x += 50;
                this.endSectorX = this.startSectorX;
                this.endSectorY = this.startSectorY + this.sectorsHeight - 1;
            } else {
                this.rotationType = 'horizontal';
                this.image.rotation = 0;
                this.image.x -= 50;
                this.endSectorX = this.startSectorX + this.sectorsWidth - 1;
                this.endSectorY = this.startSectorY;
            }
        },

        getRotationOffset: function(){
            return this.rotationType === 'vertical' ? 50 : 0;
        },

        markSectorsAsFull: function(){
            var rotationOffset = this.getRotationOffset(),
                startSectorX = (this.image.x - rotationOffset) / config.gridSize - 1,
                startSectorY = (this.image.y - config.playerFieldData.y) / config.gridSize,
                endSectorX = startSectorX + this.sectorsWidth - 1,
                endSectorY = startSectorY + this.sectorsHeight - 1;

            this.startSectorX = startSectorX;
            this.startSectorY = startSectorY;
            this.endSectorX = endSectorX;
            this.endSectorY = endSectorY;

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