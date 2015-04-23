define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings');

	var Card = function( type ){

		this.container = new PIXI.DisplayObjectContainer();
		this.container.position.x = settings.cardsDefaultPosition.x;
		this.container.position.y = settings.cardsDefaultPosition.y;

		this.backImage = PIXI.Sprite.fromImage( "img/cards_back.png" );
		this.backImage.anchor.x = this.backImage.anchor.y = 0.5;
		this.backImage.scale.x = this.backImage.scale.y = settings.cardsScale;
		this.backImage.visible = false;
		this.container.addChild(this.backImage);

		this.frontImage = new PIXI.Sprite.fromFrame('4');
		this.frontImage.anchor.x = this.frontImage.anchor.y = 0.5;
		this.frontImage.scale.x = this.frontImage.scale.y = settings.cardsScale;
		this.frontImage.visible = false;
		this.container.addChild(this.frontImage);

	};

	Card.prototype.addEventListeners = function(){
		var that = this;

		
	};

	Card.prototype.showBack = function(){
		this.backImage.visible = true;
	};
	
	Card.prototype.deal = function( cardIndex, callback ){
		TweenMax.to(this.container.position, 0.2, {
					x: settings.cardPositions[cardIndex].x,
					y: settings.cardPositions[cardIndex].y,
					ease: Power3.easeOut,
					delay: 0.1,
					onComplete: callback
				});
	};

	Card.prototype.flip = function(){
		var that = this;

		TweenMax.to(this.container, 0.1, { rotation: -0.2 });

		TweenMax.to(this.container.scale, 0.1, { x: 0.1, onComplete:function(){
			that.backImage.visible = false;
			that.frontImage.visible = true;

			TweenMax.to(that.container, 0.1, { rotation: 0 });
			TweenMax.to(that.container.scale, 0.1, { x: 1, onComplete:function(){
					
			}});
		}});
	};

	

	return Card;
});