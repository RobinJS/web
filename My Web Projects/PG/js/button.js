define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Signal = require('libs/signals.min');

	var Button = function( type ){
		PIXI.DisplayObjectContainer.call(this);
		if ( type !== "double" && type !== "doubleHalf" && type !== "increase" && type !== "decrease" && type !== "start" ) {
			;;;console.error("Invalid button type");
			return;
		}

		this.STATES = { NORMAL: 'normal', DOWN: 'down', INACTIVE: 'inactive' };
		this.state = this.STATES.INACTIVE;
		this.type = type;

		var buttonType = settings.buttons[type+"Btn"],
			baseTexture = PIXI.Texture.fromImage("img/buttons.png").baseTexture;

		this.textures = {
			normal: new PIXI.Texture( baseTexture, {x: buttonType.normal.x, y: buttonType.normal.y, width: buttonType.width, height: buttonType.height }),
			down: new PIXI.Texture( baseTexture, {x: buttonType.down.x, y: buttonType.down.y, width: buttonType.width, height: buttonType.height }),
			inactive: new PIXI.Texture( baseTexture, {x: buttonType.inactive.x, y: buttonType.inactive.y, width: buttonType.width, height: buttonType.height })
		};

		this.image = new PIXI.Sprite( this.textures.inactive );
		this.image.interactive = true;
		this.image.buttonMode = true;
		this.image.interactive = false;
		this.active = true;

		this.addChild(this.image);

		this.events = {
			clicked: new Signal()
		};

		this.addEventListeners();
	};

	Button.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Button.prototype.addEventListeners = function(){
		var that = this;

		this.image.mousedown = this.image.touchstart = function(){
			if ( that.state === that.STATES.INACTIVE ) { return; }

			that.changeState( that.STATES.DOWN );
		};

		this.image.click = this.image.tap = function(){
			if ( that.state === that.STATES.INACTIVE ) { return; }

			that.changeState( that.STATES.NORMAL );
			that.events.clicked.dispatch();
		};

		this.image.mouseout = this.image.touchendoutside = function(){
			if ( that.state === that.STATES.INACTIVE ) { return; }

			that.changeState( that.STATES.NORMAL );
		};
	};

	Button.prototype.changeState = function( stateType ){
		this.image.setTexture( this.textures[stateType] );
		this.state = this.STATES[stateType];
	};

	Button.prototype.activate = function( stateType ){
		this.changeState( this.STATES.NORMAL );
		this.image.interactive = true;
		this.active = true;
	};

	Button.prototype.deactivate = function( stateType ){
		this.changeState( this.STATES.INACTIVE );
		this.image.interactive = false;
		this.active = false;
	};
	
	Button.prototype.setXY = function(x, y){
		this.x = x;
		this.y = y;
	};

	return Button;
});