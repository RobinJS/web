define(function (require) {
    "use strict";

    var config = require('config');

    var Button = function(backgroundX, backgroundY, textX, textY, text, color){
    	var glowGraphics = new createjs.Graphics().setStrokeStyle(5).beginStroke('#1a8fc8').drawRoundRect(0, 0, 265, 56, 10),
            pressedGraphics = new createjs.Graphics().beginFill('rgba(0, 0, 0, 0.2)').drawRoundRect(0, 0, 265, 56, 10),
            bgGraphics = new createjs.Graphics().beginFill(color).drawRoundRect(0, 0, 265, 56, 10),
            background = new createjs.Shape(bgGraphics);

        this.glow = new createjs.Shape(glowGraphics);
        this.glow.x = backgroundX;
        this.glow.y = backgroundY;
        this.glow.visible = false;

        this.pressedImg = new createjs.Shape(pressedGraphics);
        this.pressedImg.x = backgroundX;
        this.pressedImg.y = backgroundY;
        this.pressedImg.visible = false;

        background.x = backgroundX;
        background.y = backgroundY;


        var label = new createjs.Text("", "26px Verdana", "#fff");
        label.x = textX;
        label.y = textY;
        label.text = text;

        this.button = new createjs.Container();
        this.button.addChild( this.glow, background, label, this.pressedImg );

    };

    $.extend(Button.prototype, {
        addEventListener: function( eventType, handler ){
            this.button.addEventListener( eventType, handler );
        },

        showGlow: function(){
            this.glow.visible = true;
        },

        hideGlow: function(){
            this.glow.visible = false;
        },

        showPressedImg: function(){
            this.pressedImg.visible = true;
        },

        hidePressedImg: function(){
            this.pressedImg.visible = false;
        }
    });


    return Button;
});