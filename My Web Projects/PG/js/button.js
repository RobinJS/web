define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Signal = require('libs/signals.min');

	var Button = function( type ){
		PIXI.DisplayObjectContainer.call(this);
		if ( type !== "double" && type !== "doubleHalf" ) {
			;;;console.error("Invalid button type");
			return;
		}

		this.STATES = { normal: 'normal', down: 'down', inactive: 'inactive' };
		this.state = this.STATES.inactive;
		this.type = type;

		var buttonType = settings.buttons[type+"Btn"],
			baseTexture = PIXI.Texture.fromImage("img/buttons.png").baseTexture;

		this.textures = {
			normal: new PIXI.Texture( baseTexture, {x: 0, y: buttonType.normal, width: settings.buttons.width, height: settings.buttons.height }),
			down: new PIXI.Texture( baseTexture, {x: 0, y: buttonType.down, width: settings.buttons.width, height: settings.buttons.height }),
			inactive: new PIXI.Texture( baseTexture, {x: 0, y: buttonType.inactive, width: settings.buttons.width, height: settings.buttons.height })
		};

		// this.image = new PIXI.Sprite(new PIXI.Texture( baseTexture, {x: 0, y: cropY, width: settings.buttons.width, height: settings.buttons.height }));
		this.image = new PIXI.Sprite( this.textures.inactive );
		this.image.interactive = true;
		this.image.buttonMode = true;
		this.image.interactive = false;

		this.events = {
			clicked: new Signal()
		};

		this.addEventListeners();
	};

	Button.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Button.prototype.addEventListeners = function(){
		var that = this;

		this.image.mousedown = this.image.touchstart = function(){
			if ( that.state === that.STATES.inactive ) { return; }

			that.changeState( that.STATES.down );
		};

		this.image.click = this.image.tap = function(){
			if ( that.state === that.STATES.inactive ) { return; }

			that.changeState( that.STATES.inactive );
			that.image.interactive = false;

			this.events.clicked.dispatch();
		};

		this.image.mouseout = function(){
			if ( that.state === that.STATES.inactive ) { return; }

			that.changeState( that.STATES.normal );
		};
	};

	Button.prototype.changeState = function( stateType ){
		this.image.setTexture( this.textures[stateType] );
		this.state = this.STATES[stateType];
		this.image.interactive = true;
	};

	Button.prototype.getImage = function(){
		return this.image;
	};

	
	Button.prototype.setXY = function(x, y){
		this.image.x = x;
		this.image.y = y;
	};

	return Button;
});