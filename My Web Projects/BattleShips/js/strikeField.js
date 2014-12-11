define(function (require) {
    "use strict";

    var StrikeField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = null;
    	this.marker = null;
		this.strikeFieldHitArea = null;
    	this.strikeFieldLeftOffset = 650,
    	this.strikeFieldTopOffset = 250,
    	this.squareWidth = 50,
    	this.fieldWidth = 500,
		this.fieldHeight = 500;
		
		this.init();
		this.addListeners();
    };

    $.extend(StrikeField.prototype, {
    	init: function(){
    		this.gridImage = new createjs.Bitmap("img/grid.png");
			this.gridImage.x = 650
			this.gridImage.y = 250;
			this.mainStage.addChild(this.gridImage);

			this.marker = new createjs.Shape();
			this.marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(this.strikeFieldLeftOffset, this.strikeFieldTopOffset, 50, 50);
			this.marker.visible = false;
			this.mainStage.addChild(this.marker);

			this.strikeFieldHitArea = new createjs.Shape();
			this.strikeFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(this.strikeFieldLeftOffset, this.strikeFieldTopOffset, this.fieldWidth, this.fieldHeight);
			this.mainStage.addChild(this.strikeFieldHitArea);
    	},

    	addListeners: function(){
    		this.mainStage.on('stagemousemove', function(e) {
    			// check if cursor is outside strike field's bounds
    			if ( (e.stageX <= this.strikeFieldLeftOffset || e.stageY <= this.strikeFieldTopOffset) || (e.stageX >= this.strikeFieldLeftOffset + this.fieldWidth || e.stageY >= this.strikeFieldTopOffset + this.fieldHeight ) ) return;

    			this.marker.x = Math.floor( ( e.stageX / this.squareWidth) ) * this.squareWidth - this.strikeFieldLeftOffset;
    			this.marker.y = Math.floor( ( e.stageY / this.squareWidth) ) * this.squareWidth - this.strikeFieldTopOffset;
    		}.bind(this));

    		this.strikeFieldHitArea.on('mouseover', function(e){
    			this.marker.visible = true;
    		}.bind(this));

    		this.strikeFieldHitArea.on('mouseout', function(){
    			this.marker.visible = false;
    		}.bind(this));
    	}
    });
    
    return StrikeField;
});