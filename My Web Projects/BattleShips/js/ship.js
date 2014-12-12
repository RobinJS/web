define(function (require) {
    "use strict";

    var config = require('config');

    var Ship = function( type ){
    	this.type = type;
    	this.size = this.getSize( type );
    	this.image = new createjs.Bitmap(config.shipsImgPath[type]);
        
        this.image.regX = this.image.getBounds().width / 2;
        this.image.regY = this.image.getBounds().height / 2;
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

        // var bitmap;
        //     bitmap = new createjs.Bitmap(config.shipsImgPath[type]);
        //     bitmap.x = 300;
        //     bitmap.y = 300;
        //     stage.addChild(bitmap);

        //     bitmap.on("pressmove", function(evt) {
        //         ;;;console.log(1);
        //     });
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