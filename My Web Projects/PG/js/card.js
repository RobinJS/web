define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings');

	var Card = function( type ){
		if ( type !== "double" && type !== "doubleHalf" ) {
			;;;console.error("Invalid button type");
			return;
		}

		this.STATES = { NORMAL: 'normal', DOWN: 'down', INACTIVE: 'inactive' };
		this.state = this.STATES.NORMAL;
		this.type = type;

		var buttonType = settings.buttons[type+"Btn"],
			baseTexture = PIXI.Texture.fromImage("img/buttons.png").baseTexture;

		this.textures = {
			normal: new PIXI.Texture( baseTexture, {x: 0, y: buttonType.normal, width: settings.buttons.width, height: settings.buttons.height }),
			down: new PIXI.Texture( baseTexture, {x: 0, y: buttonType.down, width: settings.buttons.width, height: settings.buttons.height }),
			inactive: new PIXI.Texture( baseTexture, {x: 0, y: buttonType.inactive, width: settings.buttons.width, height: settings.buttons.height })
		};

		// this.image = new PIXI.Sprite(new PIXI.Texture( baseTexture, {x: 0, y: cropY, width: settings.buttons.width, height: settings.buttons.height }));
		this.image = new PIXI.Sprite( this.textures.normal );
		this.image.interactive = true;
		this.image.buttonMode = true;

		this.addEventListeners();
		return this.image;
	};

	Card.prototype.addEventListeners = function(){
		var that = this;

		this.image.mousedown = this.image.touchstart = function(){
			that.changeState( that.STATES.DOWN );
		};

		this.image.mouseup = this.image.touchend = function(){
			that.changeState( that.STATES.INACTIVE );
			that.image.interactive = false;
		};
	};

	Card.prototype.changeState = function( stateType ){
		this.image.setTexture( this.textures[stateType] );
	};

	return Card;
});