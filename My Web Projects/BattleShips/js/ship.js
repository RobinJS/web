define(function (require) {
    "use strict";

    var config = require('config'),
        Signal = require('libs/signals.min');

    var Ship = function( type ){
    	this.type = type;
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
            createArrangeMarker: new Signal()
        };

        var that = this;
    	this.image.addEventListener('pressmove', function( e ){
            if ( !that.clickEnabled ) return;
            
            that.move( e );
        });

        this.image.addEventListener('mousedown', function( e ){

            this.startX = Math.floor( e.stageX / config.gridSize) * config.gridSize;
            this.startY = Math.floor( e.stageY / config.gridSize) * config.gridSize;

            this.pointerDistanceX = this.startX - this.image.x;
            this.pointerDistanceY = this.startY - this.image.y;

            this.events.createArrangeMarker.dispatch( this );
        }.bind(this));

        this.image.addEventListener('pressup', function( e ){
            // if pointer outside player field's bounds
            // if ( e.stageX <= config.playerFieldData.x || e.stageX >= (config.playerFieldData.x + config.fieldWidth) || e.stageY <= config.playerFieldData.y || e.stageY >= (config.playerFieldData.y + config.fieldHeight) ) {
            //     // return ship at initial position
            //     // console.log(this.rotationType, this.arrangedX, this.arrangedY);
            //     this.image.x = this.arrangedX;
            //     this.image.y = this.arrangedY;



            // } else {

            // }

            // if ship is outside player field's bounds
            

            // console.log(this.image.x + this.blocksWidth * 50, this.image.y + this.blocksHeight * 50);

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
        }

    });

    return Ship;
});