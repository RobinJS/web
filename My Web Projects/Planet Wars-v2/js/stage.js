define(function (require) {
	var PIXI = require("libs/pixi.dev"),
		settings = require("settings");

	var renderer = PIXI.autoDetectRenderer(settings.gameWidth, settings.gameHeight, {
		clearBeforeRender: true,
		transparent: false,
		resolution: 1,
		roundPixels: true,
		antialias: true
  	}),
	stage = new PIXI.Stage(0x000000),
	amount = (renderer instanceof PIXI.WebGLRenderer) ? 100 : 5;

	if(amount == 5) {
		renderer.context.mozImageSmoothingEnabled = false
		renderer.context.webkitImageSmoothingEnabled = false;
	}

	renderer.view.style["transform"] = "translatez(0)";

	var animate = function() {
		renderer.render(stage);
	    requestAnimFrame(animate);
	}.bind(this);

	requestAnimFrame(animate);

	document.body.appendChild(renderer.view);
	renderer.view.style.position = "absolute";

	return stage;
});