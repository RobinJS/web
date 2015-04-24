define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings');
		Bangup = require('bangup');

	var Wins = function(){
		PIXI.DisplayObjectContainer.call(this);

		this.winAmountBangup = new Bangup();
		this.winAmountBangup.setCentered();
		this.winAmountBangup.setFontSize( 60 );
		this.winAmountBangup.setXY( 640, settings.gameHeight - 40);

		this.toWinDoubleHalf = new PIXI.Text("TO WIN:", { font: 'bold 18px Arial', fill: '#c2c2c2', align: 'left' });
		this.toWinDoubleHalf.position.x = 560;
		this.toWinDoubleHalf.position.y = 540;
		this.addChild(this.toWinDoubleHalf);

		this.toWinDouble = new PIXI.Text("TO WIN:", { font: 'bold 18px Arial', fill: '#c2c2c2', align: 'left' });
		this.toWinDouble.position.x = 760;
		this.toWinDouble.position.y = 540;
		this.addChild(this.toWinDouble);

		this.cumulativeWinAmoiunt = 0;
		
	};

	Wins.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Wins.prototype.showStartAmount = function( currentBet ){
		this.winAmountBangup.setAmount( currentBet );
	};

	Wins.prototype.showFutureWins = function(){
		
		this.toWinDoubleHalf.setText("TO WIN: " + this.getDoubleHalfFutureWin());
		this.toWinDouble.setText("TO WIN: " + this.getDoubleFutureWin());
		
	};

	Wins.prototype.getDoubleHalfFutureWin = function(){
		
		
	};

	Wins.prototype.getDoubleFutureWin = function(){
		
	};


	return Wins;
});