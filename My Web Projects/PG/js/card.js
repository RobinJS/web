define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings');

	var Card = function(){
		PIXI.DisplayObjectContainer.call(this);

		this.position.x = settings.cardsDefaultPosition.x;
		this.position.y = settings.cardsDefaultPosition.y;

		this.backImage = PIXI.Sprite.fromImage( "img/cards_back.png" );
		this.backImage.anchor.x = this.backImage.anchor.y = 0.5;
		this.backImage.scale.x = this.backImage.scale.y = settings.cardsScale;
		this.backImage.visible = false;
		this.addChild(this.backImage);

		this.frontImage = new PIXI.Sprite.fromFrame('4');
		this.frontImage.anchor.x = this.frontImage.anchor.y = 0.5;
		this.frontImage.scale.x = this.frontImage.scale.y = settings.cardsScale;
		this.frontImage.visible = false;
		this.addChild(this.frontImage);

	};

	Card.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Card.prototype.addEventListeners = function(){
		var that = this;

		
	};

	Card.prototype.showBack = function(){
		this.backImage.visible = true;
	};
	
	Card.prototype.deal = function( cardIndex, callback ){
		TweenMax.to(this.position, 0.1, {
					x: settings.cardPositions[cardIndex].x,
					y: settings.cardPositions[cardIndex].y,
					ease: Power4.easeOut,
					delay: 0.1,
					onComplete: callback
				});
	};

	Card.prototype.hide = function( callback ){
		var that = this;
		TweenMax.to(this.position, 0.2, {
					x: settings.cardPositionOutsideGame,
					ease: Power1.easeIn,
					onComplete: function(){
						that.reset();
						callback && callback();
					}
				});
	};

	Card.prototype.flip = function(){
		var that = this;

		TweenMax.to(this, 0.1, { rotation: -0.2 });

		TweenMax.to(this.scale, 0.1, { x: 0.1, onComplete:function(){
			that.backImage.visible = false;
			that.frontImage.visible = true;

			TweenMax.to(that, 0.1, { rotation: 0 });
			TweenMax.to(that.scale, 0.1, { x: 1, onComplete:function(){
					
			}});
		}});
	};

	Card.prototype.reset = function(){
		this.position.x = settings.cardsDefaultPosition.x;
		this.position.y = settings.cardsDefaultPosition.y;
		this.backImage.visible = true;
		this.frontImage.visible = false;
	};

	return Card;
});