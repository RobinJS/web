define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		Signal = require('libs/signals.min');

	var Game = function(stage){
		PIXI.DisplayObjectContainer.call(this);

		this.stage = stage;
		this.listenForMouseMove = false;

		this.arrow = new PIXI.Graphics();
		this.addChild( this.arrow );

		this.arrow.clear();
		this.arrow.lineStyle(4, 0xffd900, 1);
		this.arrow.moveTo(50, 50);
		this.arrow.lineTo(500, 500);
		this.arrow.endFill();

		this.shape = new PIXI.Graphics();
		this.shape.beginFill(0xFFFFFF, 1);
		this.shape.drawCircle(0, 0, 50);
		this.shape.x = 100;
		this.shape.y = 100;
		this.shape.interactive = true;
		this.addChild( this.shape );

		var that = this;

		this.stage.mousemove = function(e){
			if ( !that.listenForMouseMove ) { return; }
			that.drawArrow(e);
		};

		this.arrowStartX = this.arrowStartY = 0;

		this.events = {
			elementsCreated: new Signal()
		}

		this.addListeners();
	};

	Game.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Game.prototype.createGameElements = function () {

		this.events.elementsCreated.dispatch();
	};

	Game.prototype.start = function () {
		
	};

	Game.prototype.drawArrow = function (e) {
		this.arrow.clear();
		this.arrow.lineStyle(4, 0xffd900, 1);
		this.arrow.moveTo(this.arrowStartX, this.arrowStartY);
		this.arrow.lineTo(event.x, event.y);
		this.arrow.endFill();
	};

	Game.prototype.addListeners = function(){

		this.shape.mousedown = function(){
			this.arrowStartX = this.shape.x;
			this.arrowStartY = this.shape.y;
			this.listenForMouseMove = true;
		}.bind(this);

		this.stage.mouseup = function(){
			this.listenForMouseMove = false;
			this.arrow.clear();
		}.bind(this);
	};

	return Game;
});