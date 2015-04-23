define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings'),
		Button = require('button');

	var Bet = function( type ){
		PIXI.DisplayObjectContainer.call(this);
		
		this.text = new PIXI.Text("2", { font: 'bold 22px Arial', fill: '#f3d601', align: 'center' });
		this.currentBet = 0;

		this.amounts = [0.25, 0.5, 1, 2, 5, 10];

		// this.increaseBtn = new Button( "double" );
		// this.increaseBtn.setXY( 750, 480 );
		// stage.addChild(this.increaseBtn.getImage());

		// this.doubleHalfButton = new Button( "doubleHalf" );
		// this.doubleHalfButton.setXY( 550, 480 );
		// stage.addChild(this.doubleHalfButton.getImage());
		

	};

	Bet.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Bet.prototype.getImage = function(){
		return this.text;
	};

	Bet.prototype.setXY = function( x, y ){
		this.text.x = x;
		this.text.y = y;
	};

	return Bet;
});