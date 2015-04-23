define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Button = require('button');

	var Bet = function( type ){
		PIXI.DisplayObjectContainer.call(this);

		this.text = new PIXI.Text("2", { font: 'bold 22px Arial', fill: '#f3d601', align: 'center' });
		this.currentBet = 0;

		this.amounts = [0.25, 0.5, 1, 2, 5, 10];

		this.increaseBtn = new Button( "increase" );
		this.increaseBtn.setXY( 160, settings.gameHeight - 50 );
		this.addChild(this.increaseBtn);

		this.decreaseBtn = new Button( "decrease" );
		this.decreaseBtn.setXY( 310, settings.gameHeight - 50 );
		this.addChild(this.decreaseBtn);
		

	};

	Bet.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Bet.prototype.setXY = function( x, y ){
		
	};
	Bet.prototype.activateButtons = function(){
		this.increaseBtn.activate();
		this.decreaseBtn.activate();
	};

	return Bet;
});