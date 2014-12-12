define(function (require) {
    "use strict";

    var config = require('config');

    var Ship = function( type ){
    	this.type = type;
    	this.size = this.getSize( type );
    	this.image = new createjs.Bitmap(config.shipsData[type].imagePath);
        
        this.image.regX = config.shipsData[type].width / 2;
        this.image.regY = config.shipsData[type].height / 2;
    	this.image.x = 0;
    	this.image.y = 0;
        this.distanceX = 0;
        this.distanceY = 0;
        this.clickEnabled = false;

    	var clickHandler = function( e ){
    		if ( !this.clickEnabled ) return;
            
            this.move( e );
    	}.bind(this);

    	this.image.addEventListener('pressmove', clickHandler);

        this.image.addEventListener('mousedown', function( e ){
            this.distanceX = this.image.x - e.stageX;
            this.distanceY = this.image.y - e.stageY;
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
    			case 'submarine':
    				size = 1;
    			break;
    		}

    		return size;
    	},

    	move: function( e ){
            this.image.x = e.stageX + this.distanceX;
    		this.image.y = e.stageY + this.distanceY;
    	}

    });

    return Ship;
});