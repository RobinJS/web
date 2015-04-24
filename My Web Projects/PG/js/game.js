define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Signal = require('libs/signals.min'),
		stage = require('stage'),
		Button = require('button'),
		Card = require('card'),
		Bangup = require('bangup'),
		Bet = require('bet'),
		Hints = require('hints'),
		Wins = require('wins');

	function createSpriteFromImage( imgPath, x, y, scale, visible ){
		var card = PIXI.Sprite.fromImage( imgPath );
		card.anchor.x = card.anchor.y = 0.5;
		card.scale.x = card.scale.y = scale;
		card.position.x = x;
		card.position.y = y;
		card.visible = visible === false ? false : true;
		stage.addChild(card);
		return card;
	}

	/*
		- choose bet
		- on start: get the bet amount from the balance
		- deal cards
		- enable buttons: double; double half and collect; disable + and - buttons; show "TO WIN" and "TO WIN"; show "choose dbl or dbl half!" hint
		- on choose button: hide hint; diable buttons; show only "TO WIN" under the chosen button + the sum to win; hide current sum at the bottom bar;
			show Dealer's card; show "pick a higher card to win!" hint; allow card to be chosen
		
		- on card chosen: flip the card; show hint according to what happens;
			SCENARIOS from here:
			- CHOSEN CARD IS SMALLER: show "better luck next time" hint; flip other the cards; go to (1)
			- CHOSEN CARD IS BIGGER: show "congrats! you win!" hint; update current win sum at the bottom bar; win effect over player's card (golden frame with sunlight); flip other the cards; go to (2)
		- on COLLECT: hide cards, disable double btns, enable bet buttons, update balance, hide win sum at the bottom bar

		 (1) hide cards; disable the 2 buttons; do not update the ballance (player looses what he bet before start); enable bet buttons and start button
		 (2) enable double buttons and show sum wot win under them, enable collect button

		 bet 1 -  to win: 1.5, to win: 2.00
		 current win 1.5 - to win: 2.25, to win: 3.00

	*/
	var Game = function(){
		this.doubleButton = null;
		this.doubleHalfButton = null;
		this.startButton = null;
		this.collectButton = null;
		this.dealedCardsContainer = null;
		this.balance = null;
		this.bet = null;
		this.hints = null;
		this.dealedCards = [];
		this.winAmount = 0;
		this.chosenMultiplier = "";

		this.STATES = { START: 'start', DEAL: 'deal', BET: 'bet', RESULT: 'result', FINISH: 'finish' };
		this.currentState = "";

		this.events = {
			elementsCreated: new Signal(),
			allCardsDealed: new Signal(),
			allCardsHidden: new Signal(),
			dealersCardShown: new Signal()
		}
		
		this.addEventListeners();

		DEBUG = {};
		DEBUG.game = this;
	};

	Game.prototype.addEventListeners = function () {
		
	};

	Game.prototype.newState = function(){
		var game = this;

		switch( game.currentState ) {
			case game.STATES.START:
				game.deactivateButtons([game.startButton]);
				game.bet.deactivateButtons();
				game.wins.showStartAmount( game.bet.getCurrentBet() );
				game.currentState = game.STATES.DEAL;
				game.newState();
			break;
			case game.STATES.DEAL:
				game.events.allCardsDealed.addOnce(function(){
					game.deactivateButtons([game.startButton]);
					game.activateButtons([game.doubleButton, game.doubleHalfButton, game.collectButton]);
					game.hints.changeText( game.hints.TEXTS.CHOOSE_BUTTON );
				});

				game.balance.updateWith(-game.bet.getCurrentBet());
	        	game.deal();
	        	game.wins.showFutureWins();
	        break;
	        case game.STATES.BET:
	        	game.hints.changeText( game.hints.TEXTS.BET );
	        	game.bet.activateButtons();
	        break;
	        case game.STATES.RESULT:
	        	game.deactivateButtons([game.doubleButton, game.doubleHalfButton, game.collectButton]);
	        	game.wins.hideNotChosenMultiplierSum( game.chosenMultiplier );
	        	game.hints.hide();

	        	game.events.dealersCardShown.addOnce(function(){
        			game.hints.changeText( game.hints.TEXTS.PICK );
	        		game.enableCardPick();
	        	});
	        	game.showDealersCard();
	        break;
	        case game.STATES.FINISH:
	        	if ( game.winAmount === 0 ) {
	        		game.balance.updateWith(game.bet.getCurrentBet());
	        	}

	        	game.events.allCardsHidden.addOnce(function(){
		        	game.activateButtons([game.startButton]);
		        	game.bet.activateButtons();
	        	});

	        	game.deactivateButtons([game.doubleButton, game.doubleHalfButton, game.collectButton]);
	        	game.hideCards();
	        	game.wins.hideWinAmount();
	        	game.wins.hideFutureWins();
	        break;
	   	}
	};

	Game.prototype.createGameElements = function () {
		var that = this;
		var background = new PIXI.Sprite.fromImage('img/bg.jpg');
		stage.addChild(background);

	/* TEXTS */
		this.hints = new Hints();
		stage.addChild(this.hints);
		
		var dealersCardText = new PIXI.Text("Dealer's card", { font: 'bold 24px Arial', fill: '#c2c2c2', align: 'left' });
		dealersCardText.x = 275;
		dealersCardText.y = 450;
		stage.addChild(dealersCardText);

		var balanceText = new PIXI.Text("BALANCE:", { font: 'bold 24px Arial', fill: '#f3d601', align: 'left' });
		balanceText.x = 10;
		balanceText.y = 10;
		stage.addChild(balanceText);

		var betPerGame = new PIXI.Text("Bet per game:", { font: 'bold 18px Arial', fill: '#c2c2c2', align: 'left' });
		betPerGame.x = 200;
		betPerGame.y = settings.gameHeight - 80;
		stage.addChild(betPerGame);

	/* BUTTONS */
		this.doubleButton = new Button( "double" );
		this.doubleButton.events.clicked.add(function(){
			that.chosenMultiplier = "double";
			that.currentState = that.STATES.RESULT;
			that.newState();
		});
		this.doubleButton.setXY( 750, 480 );
		stage.addChild(this.doubleButton);

		this.doubleHalfButton = new Button( "doubleHalf" );
		this.doubleHalfButton.events.clicked.add(function(){
			that.chosenMultiplier = "doubleHalf";
			that.currentState = that.STATES.RESULT;
			that.newState();
		});
		this.doubleHalfButton.setXY( 550, 480 );
		stage.addChild(this.doubleHalfButton);

		this.startButton = new Button( "start" );
		this.startButton.setXY( 920, settings.gameHeight - 65 );
		this.startButton.events.clicked.add(function(){
			that.currentState = that.STATES.START;
			that.newState();
		});
		this.startButton.activate();
		stage.addChild(this.startButton);

		this.collectButton = new Button( "collect" );
		this.collectButton.setXY( 1100, settings.gameHeight - 65 );
		this.collectButton.events.clicked.add(function(){
			that.currentState = that.STATES.FINISH;
			that.newState();
		});
		stage.addChild(this.collectButton);

	/* BALANCE */
		this.balance = new Bangup();
		this.balance.setXY( 180, 28);
		this.balance.setAmount(1000);
		stage.addChild(this.balance);

	/* WINS */
		this.wins = new Wins();
		stage.addChild(this.wins);

	/* BET */
		this.bet = new Bet();
		stage.addChild(this.bet);

	/* CARDS */
		// these are at the top left corner looking lika a deck of cards
		var deckCard0 = createSpriteFromImage( "img/cards_back.png", 110, 180, 1.5 ),
			deckCard1 = createSpriteFromImage( "img/cards_back.png", 108, 178, 1.5 ),
			deckCard2 = createSpriteFromImage( "img/cards_back.png", 106, 176, 1.5 ),
			deckCard3 = createSpriteFromImage( "img/cards_back.png", 104, 174, 1.5 );

		this.dealedCardsContainer = new PIXI.DisplayObjectContainer();
		stage.addChild(this.dealedCardsContainer);

		for (var i = 0; i < settings.totalGameCards; i++) {
			var card = new Card();
			this.dealedCards.push( card );
			this.dealedCardsContainer.addChild(card);
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
		this.currentState = this.STATES.BET;
		this.newState();
	};

	Game.prototype.deal = function () {
		var that = this,
			cardIndex = settings.totalGameCards - 1;

		function animateCard () {
			if ( cardIndex >= 0 ) {
				var currentCard = that.dealedCards[cardIndex];
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

	Game.prototype.hideCards = function () {
		var that = this,
			cardIndex = settings.totalGameCards - 1;

		function animateCard () {
			if ( cardIndex >= 0 ) {
				var currentCard = that.dealedCards[cardIndex];
				// currentCard.showBack();
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

	Game.prototype.activateButtons = function( buttons ){
		buttons.forEach(function( btn ){
			btn.activate();
		});
	};

	Game.prototype.deactivateButtons = function( buttons ){
		buttons.forEach(function( btn ){
			btn.deactivate();
		});
	};

	Game.prototype.showDealersCard = function(){
		var dealersCard = this.dealedCardsContainer.children[0];
		dealersCard.flip(function(){
			this.events.dealersCardShown.dispatch();
		}.bind(this));
	};

	Game.prototype.enableCardPick = function(){
		
		for (var i = 1; i < this.dealedCards.length; i++) {
			this.dealedCards[i].enablePick();
		}
		
	};

	return Game;
});