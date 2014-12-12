define(function (require) {
    "use strict";

    var Stage = function( canvasID ){
    	this.stage = new createjs.Stage("mainCanvas");
    	
    	this.stage.enableMouseOver(10);
        this.stage.enableDOMEvents(false);
        createjs.Touch.enable(this.stage);
        this.stage.mouseMoveOutside = true;

    	createjs.Ticker.useRAF = true;

    	this.handleTick = function(event){
			this.stage.update();
    	}.bind(this);

    	createjs.Ticker.addEventListener("tick", this.handleTick);

        return this.stage;
    };
    
    return Stage;
});