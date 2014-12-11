define(function (require) {
    "use strict";

    var config = require('config');

    var Ship = function( type ){
    	this.type = type;
    	this.size = this.getSize( type );
    	this.image = new createjs.Bitmap(config.shipsImgPath[type]);
    	this.image.x = 0;
    	this.image.y = 0;
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
    	}

    });

    return Ship;
});