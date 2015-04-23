define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings');

	var Bangup = function( type ){
		PIXI.DisplayObjectContainer.call(this);

		this.text = new PIXI.Text("0", { font: 'bold 22px Arial', fill: '#f3d601', align: 'center' });
		this.currentAmount = 0;
		

	};

	Bangup.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Bangup.prototype.addEventListeners = function(){
		var that = this;

		
	};

	Bangup.prototype.setXY = function( x, y ){
		this.text.x = x;
		this.text.y = y;
	};

	Bangup.prototype.setAmount = function( amount ){
		this.currentAmount = amount;
		this.text.setText(amount);
	};

	Bangup.prototype.updateWith = function( amount ){
		var that = this,
			bangup = { currentAmount: this.currentAmount };

		TweenMax.to(bangup, 1, { 
			currentAmount: this.currentAmount + amount,
			onUpdate: onUpdate,
			onComplete: onComplete
		});

		function onUpdate () {
			var amountPercent = ( this.progress() * amount ).toFixed(2),
			amountToUpdate = (that.currentAmount + parseFloat(amountPercent)).toFixed(2);

			that.text.setText( amountToUpdate );
		}

		function onComplete () {
			that.currentAmount += amount;
		}
	};

	return Bangup;
});