define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Signal = require('libs/signals.min'),
		stage = require('stage'),
		Button = require('button'),
		Card = require('card');

	function createSpriteFromImage( imgPath, x, y, scale, visible ){
		var card = PIXI.Sprite.fromImage( imgPath );
		card.anchor.x = card.anchor.y = 0.5;
		card.scale.x = card.scale.y = scale;
		// card.position.x = settings.gameWidth + card.width;
		card.position.x = x;
		card.position.y = y;

		card.visible = visible === false ? false : true;

		stage.addChild(card);
		return card;
	}

	var Game = function(){
		this.doubleButton = null;
		this.doubleHalfButton = null;
		this.flippedCardsContainer = null;


		this.events = {
			elementsCreated: new Signal(),
			allCardsDealed: new Signal()
		}
		
		this.addEventListeners();

		DEBUG = {};
		DEBUG.game = this;
	};

	Game.prototype.addEventListeners = function () {
		this.events.allCardsDealed.add(function(){
			this.activateButtons();
		}.bind(this));
	};

	Game.prototype.createGameElements = function () {
		
		// popup Dealer's card
		// show Player's cards
		// allow buttons
		
		//show D's card - ask Player to choose a card
		// show win (if any)
		// show not chosen coards

		var background = new PIXI.Sprite.fromImage('img/bg.jpg');
		stage.addChild(background);

		/* TEXTS */
		var hintText = new PIXI.Text("CHOOSE DOUBLE OR DOUBLE HALF", { font: 'bold 24px Arial', fill: '#ffffff', align: 'center' });
		hintText.x = settings.gameWidth/2 - hintText.width/2 + 90;
		hintText.y = 120;
		stage.addChild(hintText);

		var dealersCardText = new PIXI.Text("Dealer's card", { font: 'bold 24px Arial', fill: '#c2c2c2', align: 'left' });
		dealersCardText.x = 275;
		dealersCardText.y = 450;
		stage.addChild(dealersCardText);

		/* BUTTONS */
		this.doubleButton = new Button( "double" );
		this.doubleButton.setXY( 750, 480 );
		stage.addChild(this.doubleButton.getImage());

		this.doubleHalfButton = new Button( "doubleHalf" );
		this.doubleHalfButton.setXY( 550, 480 );
		stage.addChild(this.doubleHalfButton.getImage());

		/* CARDS */
		// these are at the top left corner looking lika a deck of cards
		var deckCard0 = createSpriteFromImage( "img/cards_back.png", 110, 180, 1.5 ),
			deckCard1 = createSpriteFromImage( "img/cards_back.png", 108, 178, 1.5 ),
			deckCard2 = createSpriteFromImage( "img/cards_back.png", 106, 176, 1.5 ),
			deckCard3 = createSpriteFromImage( "img/cards_back.png", 104, 174, 1.5 );


		this.flippedCardsContainer = new PIXI.DisplayObjectContainer();
		stage.addChild(this.flippedCardsContainer);

		for (var i = 0; i < settings.totalFlippedCards; i++) {
			var flippedCard = createSpriteFromImage( "img/cards_back.png", 104, 174, 1.5, false );
			this.flippedCardsContainer.addChild(flippedCard);
		}


		// this.card0 = new PIXI.Sprite.fromFrame('0');
		// this.card0.x = settings.cardPositions.dealer.x;
		// this.card0.y = settings.cardPositions.dealer.y;
		// this.card0.anchor.x = this.card0.anchor.y = 0.5;
		// this.card0.scale.x = 1.5;
		// this.card0.scale.y = 1.5;
		// stage.addChild(this.card0);

		// this.card1 = new PIXI.Sprite.fromFrame('1');
		// this.card1.x = settings.cardPositions.player[0].x;
		// this.card1.y = settings.cardPositions.player[0].y;
		// this.card1.anchor.x = this.card1.anchor.y = 0.5;
		// this.card1.scale.x = 1.5;
		// this.card1.scale.y = 1.5;
		// stage.addChild(this.card1);

		// this.card2 = new PIXI.Sprite.fromFrame('2');
		// this.card2.x = settings.cardPositions.player[1].x;
		// this.card2.y = settings.cardPositions.player[1].y;
		// this.card2.anchor.x = this.card2.anchor.y = 0.5;
		// this.card2.scale.x = 1.5;
		// this.card2.scale.y = 1.5;
		// stage.addChild(this.card2);

		// this.card3 = new PIXI.Sprite.fromFrame('3');
		// this.card3.x = settings.cardPositions.player[2].x;
		// this.card3.y = settings.cardPositions.player[2].y;
		// this.card3.anchor.x = this.card3.anchor.y = 0.5;
		// this.card3.scale.x = 1.5;
		// this.card3.scale.y = 1.5;
		// stage.addChild(this.card3);

		// this.card4 = new PIXI.Sprite.fromFrame('4');
		// this.card4.x = settings.cardPositions.player[3].x;
		// this.card4.y = settings.cardPositions.player[3].y;
		// this.card4.anchor.x = this.card4.anchor.y = 0.5;
		// this.card4.scale.x = 1.5;
		// this.card4.scale.y = 1.5;
		// stage.addChild(this.card4);

		this.events.elementsCreated.dispatch();
	};

	Game.prototype.start = function () {
		setTimeout(function(){
			this.deal();
		}.bind(this), 1000);
	};

	Game.prototype.deal = function () {
		var that = this,
			index = 0;

		// put this animation into a Deck class ???
		function animateCard () {
			if ( index < settings.totalFlippedCards ) {
				var currentCard = that.flippedCardsContainer.children[index];
				currentCard.visible = true;

				TweenMax.to(currentCard.position, 0.1, {
							 x: settings.cardPositions[index].x,
							 y: settings.cardPositions[index].y,
							 delay: 0.2,
							 onComplete: function(){
								index++;
								animateCard();
							 }});
			} else {
				that.events.allCardsDealed.dispatch();
			}
		}

		animateCard();
	};

	Game.prototype.activateButtons = function(){
		this.doubleButton.changeState( "normal" );
		this.doubleHalfButton.changeState( "normal" );

	};

	return Game;
});