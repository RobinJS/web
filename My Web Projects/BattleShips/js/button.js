define(function (require) {
    "use strict";

    var config = require('config');

    var Button = function(backgroundX, backgroundY, textX, textY, text){
    	var background = new createjs.Bitmap("img/button_bg.png");
        background.x = backgroundX;
        background.y = backgroundY;

        var label = new createjs.Text("", "34px Verdana", "#000");
        label.x = textX;
        label.y = textY;
        label.text = text;

        var button = new createjs.Container();
        button.addChild(background, label);

        return button;
    };


    return Button;
});