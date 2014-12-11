define(function (require) {
    "use strict";

    var Stage = function( canvasID ){
    	this.stage = new createjs.Stage("mainCanvas");
    	
    	this.stage.enableMouseOver(10);

    	createjs.Ticker.useRAF = true;

    	this.handleTick = function(event){
			this.stage.update();
    	}.bind(this);

    	createjs.Ticker.addEventListener("tick", this.handleTick);
    };

    $.extend(Stage.prototype, {
    	addChild: function( obj ){
    		this.stage.addChild( obj );
    	},
    });
    
    return Stage;
});