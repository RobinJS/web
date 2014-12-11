define(function (require) {
    "use strict";

    var config = require('config');

    var Button = function(backgroundX, backgroundY, textX, textY, text, path){
    	var background = new createjs.Bitmap(path);
        background.x = backgroundX;
        background.y = backgroundY;

        var label = new createjs.Text("", "26px Verdana", "#fff");
        label.x = textX;
        label.y = textY;
        label.text = text;

        var button = new createjs.Container();
        button.addChild(background, label);

        return button;
    };


    return Button;
});