define(function (require) {
    "use strict";

    var Stage = function( canvasID ){
    	this.stage = new createjs.Stage(document.getElementById(canvasID));
    	
    	this.stage.enableMouseOver(10);
        this.stage.enableDOMEvents(true);
        createjs.Touch.enable(this.stage);
        this.stage.mouseMoveOutside = true;

    	createjs.Ticker.useRAF = true;

    	var handleTick = function(event){
			this.stage.update();
    	}.bind(this);

    	createjs.Ticker.addEventListener("tick", handleTick);

        return this.stage;
    };
    
    return Stage;
});