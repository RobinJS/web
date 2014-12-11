define(function (require) {
    "use strict";

    var OpponentField = function( mainStage ){
    	this.mainStage = mainStage;
    	this.gridImage = null;
    	this.marker = null;
		this.opponentFieldHitArea = null;
    	this.opponentFieldLeftOffset = 650,
    	this.opponentFieldTopOffset = 250,
    	this.squareWidth = 50,
    	this.fieldWidth = 500,
		this.fieldHeight = 500;

		this.markerEnabled = false;
		
		this.init();
		this.addListeners();
    };

    $.extend(OpponentField.prototype, {
    	init: function(){
    		this.gridImage = new createjs.Bitmap("img/grid.png");
			this.gridImage.x = 650
			this.gridImage.y = 250;
			this.mainStage.addChild(this.gridImage);

			this.marker = new createjs.Shape();
			this.marker.graphics.setStrokeStyle(1).beginFill('rgba(125, 209, 255, 0.7)').rect(this.opponentFieldLeftOffset, this.opponentFieldTopOffset, 50, 50);
			this.marker.visible = false;
			this.mainStage.addChild(this.marker);

			this.opponentFieldHitArea = new createjs.Shape();
			this.opponentFieldHitArea.graphics.beginFill('rgba(255, 255, 255, 0.01)').rect(this.opponentFieldLeftOffset, this.opponentFieldTopOffset, this.fieldWidth, this.fieldHeight);
			this.mainStage.addChild(this.opponentFieldHitArea);
    	},

    	addListeners: function(){
    		this.mainStage.on('stagemousemove', function(e) {
    			// check if cursor is outside strike field's bounds
    			if ( !this.markerEnabled ) return;

    			if ( (e.stageX <= this.opponentFieldLeftOffset || e.stageY <= this.opponentFieldTopOffset) || (e.stageX >= this.opponentFieldLeftOffset + this.fieldWidth || e.stageY >= this.opponentFieldTopOffset + this.fieldHeight ) ) return;

    			this.marker.x = Math.floor( ( e.stageX / this.squareWidth) ) * this.squareWidth - this.opponentFieldLeftOffset;
    			this.marker.y = Math.floor( ( e.stageY / this.squareWidth) ) * this.squareWidth - this.opponentFieldTopOffset;
    		}.bind(this));

    		this.opponentFieldHitArea.on('mouseover', function(e){
    			if ( !this.markerEnabled ) return;

    			this.marker.visible = true;
    		}.bind(this));

    		this.opponentFieldHitArea.on('mouseout', function(){
    			if ( !this.markerEnabled ) return;

    			this.marker.visible = false;
    		}.bind(this));
    	}
    });
    
    return OpponentField;
});