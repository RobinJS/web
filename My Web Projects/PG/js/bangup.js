define(function (require) {
	var PIXI = require('libs/pixi.dev'),
		settings = require('settings');

	var Bangup = function(){
		PIXI.DisplayObjectContainer.call(this);

		this.text = new PIXI.Text("", { font: 'bold 22px Arial', fill: '#f3d601', align: 'center' });
		var bounds = this.text.getBounds();
		this.text.pivot = new PIXI.Point(bounds.width / 2, bounds.height / 2);
		this.addChild(this.text);
		// this.currentAmount = 0;
		this.centered = false;
		

	};

	Bangup.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	Bangup.prototype.addEventListeners = function(){
		var that = this;

		
	};

	Bangup.prototype.setXY = function( x, y ){
		this.text.x = x;
		this.text.y = y;
	};

	Bangup.prototype.setCentered = function(){
		this.centered = true;
	};

	Bangup.prototype.setAmount = function( amount ){
		// this.currentAmount = amount;
		this.text.setText( amount.toFixed(2) );
		this.text.updateTransform();
		var bounds = this.text.getBounds();
		this.text.pivot = new PIXI.Point(bounds.width / 2, bounds.height / 2);
	};

	Bangup.prototype.setFontSize = function( size ){
		this.text.setStyle({font: 'bold ' + size + 'px Arial', fill: '#f3d601', align: 'center'});
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

			if ( that.centered ) {
				that.text.updateTransform();
				var bounds = that.text.getBounds();
				that.text.pivot = new PIXI.Point(bounds.width / 2, bounds.height / 2);
			}
		}

		function onComplete () {
			that.currentAmount += amount;
		}
	};

	Bangup.prototype.updateTo = function( amount ){
		var that = this,
			bangup = { currentAmount: this.currentAmount };

		TweenMax.to(bangup, 1, { 
			currentAmount: amount,
			onUpdate: onUpdate,
			onComplete: onComplete
		});

		function onUpdate () {
			var amountPercent = ( this.progress() * amount ).toFixed(2),
			amountToUpdate = (that.currentAmount + parseFloat(amountPercent)).toFixed(2);

			that.text.setText( amountToUpdate );

			if ( that.centered ) {
				that.text.updateTransform();
				var bounds = that.text.getBounds();
				that.text.pivot = new PIXI.Point(bounds.width / 2, bounds.height / 2);
			}
		}

		function onComplete () {
			that.currentAmount = amount;
		}
	};

	return Bangup;
});