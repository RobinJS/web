define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Signal = require('libs/signals.min'),
		stage = require('stage'),
		Button = require('button');

	function createSpriteFromImage( imgPath, x, y, scale ){
		var card = PIXI.Sprite.fromImage( imgPath );
		card.anchor.x = card.anchor.y = 0.5;
		card.scale.x = card.scale.y = scale;
		// card.position.x = settings.gameWidth + card.width;
		card.position.x = x;
		card.position.y = y;

		stage.addChild(card);
		return card;
	}

	var Game = function(){
		this.doubleButton = null;
		this.doubleHalfButton = null;
		this.cardBacksArr = [];



		this.events = {
			elementsCreated: new Signal()
		}
		
		this.addEventListeners();
	};

	Game.prototype.addEventListeners = function () {

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
		this.doubleButton = stage.addChild(new Button( "double" ));
		this.doubleButton.x = 750;
		this.doubleButton.y = 480;

		this.doubleHalfButton = stage.addChild(new Button( "doubleHalf" ));
		this.doubleHalfButton.x = 550;
		this.doubleHalfButton.y = 480;

		/* CARDS */
		var dexkCard0 = createSpriteFromImage( "img/cards_back.png", 110, 180, 1.5 );
		var dexkCard1 = createSpriteFromImage( "img/cards_back.png", 108, 178, 1.5 );
		var dexkCard2 = createSpriteFromImage( "img/cards_back.png", 106, 176, 1.5 );
		var dexkCard3 = createSpriteFromImage( "img/cards_back.png", 104, 174, 1.5 );


		var totalCardBacks = 5;

		for (var i = 0; i < totalCardBacks; i++) {
			var cardBack = createSpriteFromImage( "img/cards_back.png", 104, 174, 1.5 );
			this.cardBacksArr.push(cardBack);

			TweenMax.to(cardBack.position, 0.5, { x: settings.cardPositions[i].x, y: settings.cardPositions[i].y });
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

	};

	return Game;
});