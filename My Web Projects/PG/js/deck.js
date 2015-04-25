define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Signal = require('libs/signals.min'),
		Card = require('card');

	function createSpriteFromImage( imgPath, x, y, scale, ctx ){
		var card = PIXI.Sprite.fromImage( imgPath );
		card.anchor.x = card.anchor.y = 0.5;
		card.scale.x = card.scale.y = scale;
		card.position.x = x;
		card.position.y = y;
		ctx.addChild(card);
		return card;
	}

	var Deck = function(){
		PIXI.DisplayObjectContainer.call(this);

		// fake cards at the top left corner looking lika a deck of cards
		var deckCard0 = createSpriteFromImage( "img/cards_back.png", 110, 180, 1.5, this ),
			deckCard1 = createSpriteFromImage( "img/cards_back.png", 108, 178, 1.5, this ),
			deckCard2 = createSpriteFromImage( "img/cards_back.png", 106, 176, 1.5, this ),
			deckCard3 = createSpriteFromImage( "img/cards_back.png", 104, 174, 1.5, this );
		
		this.cardsArr = [];
		this.dealerCardRank = 0;
		this.playerCardRank = 0;

		this.createCards();

		this.events = {
			cardPicked: new Signal(),
			allCardsDealed: new Signal(),
			allCardsHidden: new Signal(),
			dealersCardShown: new Signal()
		};
	};

	Deck.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Deck.prototype.createCards = function(){
		var that = this;

		for (var i = 0; i < settings.totalPlayableCards; i++) {
			var card = new Card();
			card.events.clicked.add( function( pickedCard ){
				that.handlePick( pickedCard );
				that.events.cardPicked.dispatch();
			});
			this.cardsArr.push( card );
			this.addChild(card);
		}
	};

	Deck.prototype.handlePick = function( pickedCard ){
		this.playerCardRank = pickedCard.rank;
		this.disableCardPick();
		pickedCard.flip();
	};

	Deck.prototype.deal = function () {
		var that = this,
			cardIndex = settings.totalPlayableCards - 1;

		this.setCardsRankAndSuit();

		function animateCard () {
			if ( cardIndex >= 0 ) {
				var currentCard = that.cardsArr[cardIndex];
				currentCard.showBack();
				currentCard.deal(cardIndex, function(){
					cardIndex--;
					animateCard();
				});
			} else {
				that.events.allCardsDealed.dispatch();
			}
		}

		animateCard();
	};

	Deck.prototype.collect = function () {
		var that = this,
			cardIndex = settings.totalPlayableCards - 1;

		function animateCard () {
			if ( cardIndex >= 0 ) {
				var currentCard = that.cardsArr[cardIndex];
				currentCard.hide(function(){
					cardIndex--;
					animateCard();
				});
			} else {
				that.events.allCardsHidden.dispatch();
			}
		}

		animateCard();
	};

	Deck.prototype.showDealersCard = function(){
		var dealersCard = this.cardsArr[0];

		this.dealerCardRank = dealersCard.rank;

		dealersCard.flip(function(){
			this.events.dealersCardShown.dispatch();
		}.bind(this));
	};

	Deck.prototype.enableCardPick = function(){
		for (var i = 1; i < this.cardsArr.length; i++) {
			this.cardsArr[i].enablePick();
		}
	};

	Deck.prototype.disableCardPick = function(){
		for (var i = 1; i < this.cardsArr.length; i++) {
			this.cardsArr[i].disablePick();
		}
	};

	Deck.prototype.setCardsRankAndSuit = function(){
		var shuffledCardIndices = getShuffledCardIndices();

		for (var i = 0; i < settings.totalPlayableCards; i++) {
			var cardId = shuffledCardIndices[i];
			this.cardsArr[i].setRankAndSuit( cardId );
		}

		function getShuffledCardIndices(){
			var indArr = [],
				shuffledArr = [];

			for (var i = 0; i < settings.totalDeckCards; i++) {
				indArr.push(i);
			}

			while(indArr.length > 0 ){
				shuffledArr.push( indArr.splice(Math.floor(Math.random() * indArr.length), 1)[0] );
			}

			return shuffledArr;
		}
	};

	Deck.prototype.getResultData = function(){
		return { dealer: this.dealerCardRank, player: this.playerCardRank }
	};

	Deck.prototype.flipTheOtherCards = function(){
		this.cardsArr.forEach(function(card){
			card.flip();
		});
	};

	Deck.prototype.showWinEffects = function(){
		this.cardsArr.forEach(function(card){
			if ( card.chosenByPlayer ) {
				card.showWinFrame();
			}
		});
	};

	return Deck;
});