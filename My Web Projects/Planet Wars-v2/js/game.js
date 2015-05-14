define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Signal = require('libs/signals.min'),
		Player = require('player'),
		Planet = require('planet'),
		Button = require('button'),
		Bangup = require('bangup'),
		Hints = require('hints'),
		Message = require('message'),
		DestinationArrow = require('destinationArrow');

	var Game = function(stage){
		PIXI.DisplayObjectContainer.call(this);

		this.stage = stage;

		this.STATES = { START: 'start', PLAY: 'play', FINISH: 'finish' };
		this.currentState = "";

		this.planetTapped = false;
		this.chosenPlanet = null;
		this.destinationPlanet = null;

		this.events = {
			assetsReady: new Signal()
		}
		

		DEBUG = {};
		DEBUG.game = this;

		// DEBUG.gaffs.iWin = function(){
		// 	DEBUG.game.deck.cardsArr[0].setRankAndSuit( 0 );

		// 	for (var i = 1; i < 5; i++) {
		// 		DEBUG.game.deck.cardsArr[i].setRankAndSuit( 12 );
		// 	}
		// };

		// DEBUG.gaffs.dealerWins = function(){
		// 	DEBUG.game.deck.cardsArr[0].setRankAndSuit( 12 );

		// 	for (var i = 1; i < 5; i++) {
		// 		DEBUG.game.deck.cardsArr[i].setRankAndSuit( 0 );
		// 	}
		// };

		// DEBUG.gaffs.tie = function(){
		// 	for (var i = 0; i < 5; i++) {
		// 		DEBUG.game.deck.cardsArr[i].setRankAndSuit( 0 );
		// 	}
		// };
		var that = this;
		this.createGameElements(function(){
			that.addListeners(function(){
				that.start();
			});
		});
	};

	Game.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Game.prototype.newState = function(){
		var game = this;

		switch( game.currentState ) {
			case game.STATES.START:
				
			break;
	        case game.STATES.PLAY:
        		this.startCreatingShips();
	        break;
	        case game.STATES.FINISH:
        		
	        break;
	   	}
	};

	Game.prototype.createGameElements = function( callback ){
		var that = this;
		// var background = new PIXI.Sprite.fromImage('img/bg.jpg');
		// this.addChild(background);

		this.player = new Player( "player1", "player", "bluePlanet" );
		this.enemy = new Player( "enemy1", "enemy", "redPlanet" );

	/* DESTIONATION ARROW */
		this.arrow = new DestinationArrow();
		this.addChild(this.arrow);

	/* PLANETS */
		this.planets = [
			this.addChild(new Planet(this.arrow, "planet1", 150, 150, this.player.type, this.player.planetType)),
			this.addChild(new Planet(this.arrow, "planet2", 450, 350, "empty", "emptyPlanet")),
			this.addChild(new Planet(this.arrow, "planet3", 850, 250, this.enemy.type, this.enemy.planetType))
		];

	/* TEXTS */
		// this.hints = new Hints();
		// this.addChild(this.hints);
		
		// var dealersCardText = new PIXI.Text("Dealer's card", { font: 'bold 24px Arial', fill: '#c2c2c2', align: 'left' });
		// dealersCardText.x = 275;
		// dealersCardText.y = 450;
		// this.addChild(dealersCardText);

		// var balanceText = new PIXI.Text("BALANCE:", { font: 'bold 24px Arial', fill: '#f3d601', align: 'left' });
		// balanceText.x = 10;
		// balanceText.y = 10;
		// this.addChild(balanceText);

		// var betPerGame = new PIXI.Text("Bet per game:", { font: 'bold 18px Arial', fill: '#c2c2c2', align: 'left' });
		// betPerGame.x = 200;
		// betPerGame.y = settings.gameHeight - 80;
		// this.addChild(betPerGame);

	/* BUTTONS */
		// this.doubleButton = new Button( "double" );
		// this.doubleButton.events.clicked.add(function(){
		// 	that.chosenMultiplier = "double";
		// 	that.currentState = that.STATES.PICK_A_CARD;
		// 	that.newState();
		// });
		// this.doubleButton.setXY( 750, 480 );
		// this.addChild(this.doubleButton);

		// this.doubleHalfButton = new Button( "doubleHalf" );
		// this.doubleHalfButton.events.clicked.add(function(){
		// 	that.chosenMultiplier = "doubleHalf";
		// 	that.currentState = that.STATES.PICK_A_CARD;
		// 	that.newState();
		// });
		// this.doubleHalfButton.setXY( 550, 480 );
		// this.addChild(this.doubleHalfButton);

		// this.startButton = new Button( "start" );
		// this.startButton.setXY( 920, settings.gameHeight - 65 );
		// this.startButton.events.clicked.add(function(){
		// 	that.currentState = that.STATES.START;
		// 	that.newState();
		// });
		// this.startButton.activate();
		// this.addChild(this.startButton);

		// this.collectButton = new Button( "collect" );
		// this.collectButton.setXY( 1100, settings.gameHeight - 65 );
		// this.collectButton.events.clicked.add(function(){
		// 	that.currentState = that.STATES.FINISH;
		// 	that.newState();
		// });
		// this.addChild(this.collectButton);


		

	/* MESSAGE */
		// this.message = new Message();
		// this.addChild(this.message);

		callback && callback();
	};

	Game.prototype.addListeners = function( callback ){
		var that = this;

		this.stage.mousemove = function(e){
			if ( !that.planetTapped ) { return; }

			that.arrow.draw(e);
		};

		this.stage.mouseup = this.stage.touchend = function(){
			if ( !that.planetTapped ) { return; }

			that.planetTapped = false;
			that.arrow.clear();
			if ( that.destinationPlanet ) {
				that.destinationPlanet.hideDestinationMarker();
				that.chosenPlanet.sendShipsTo( that.destinationPlanet );
				that.destinationPlanet = null;
			}

			if ( that.chosenPlanet ) {
				that.chosenPlanet.hideTouchMarker();
				that.chosenPlanet = null;
			}
		};

		this.stage.mouseout = this.stage.touchendoutside = function(){
			if ( !that.planetTapped ) { return; }

			that.planetTapped = false;
			that.arrow.clear();
			if ( that.destinationPlanet ) {
				that.destinationPlanet.hideDestinationMarker();
			}

			if ( that.chosenPlanet ) {
				that.chosenPlanet.hideTouchMarker();
			}
		};

		this.planets.forEach(function(planet){
			planet.currentShape.mousedown = planet.currentShape.touchstart = function(){
				if ( this.parent.team !== 'player' ) {
					return;
				}

				that.arrow.setStartXY(this.x, this.y);
				that.planetTapped = true;
				that.chosenPlanet = this.parent;
				this.parent.showTouchMarker();
			};

			planet.currentShape.mouseover = function(){
				if ( !that.planetTapped || this.parent.id === that.chosenPlanet.id ) return;

				that.destinationPlanet = this.parent;
				this.parent.showDestinationMarker();
			};

			planet.currentShape.mouseout = planet.currentShape.touchendoutside = function(){
				if ( !that.planetTapped || this.parent.id === that.chosenPlanet.id ) return;

				this.parent.hideDestinationMarker();
			};
			
		});
		
		callback && callback();
	};

	Game.prototype.start = function () {
		this.currentState = this.STATES.PLAY;
		this.newState();
	};

	Game.prototype.startCreatingShips = function(){
		this.planets.forEach(function(planet){
			planet.startCreatingShips();
		});
	};

	Game.prototype.activateButtons = function( buttons ){
		// buttons.forEach(function( btn ){
		// 	btn.activate();
		// });
	};

	Game.prototype.deactivateButtons = function( buttons ){
		// buttons.forEach(function( btn ){
		// 	btn.deactivate();
		// });
	};

	return Game;
});