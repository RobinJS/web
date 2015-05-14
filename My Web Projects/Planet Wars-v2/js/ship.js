define(function(){

	var Ship = function( planetType, x, y ){
		PIXI.DisplayObjectContainer.call(this);
		
		this.shape = PIXI.Sprite.fromFrame(planetType + 'Ship.png');
		this.shape.pivot.x = this.shape.width/2;
		this.shape.pivot.y = this.shape.height/2;
		this.shape.scale.x = 0.5;
		this.shape.scale.y = 0.5;
		this.shape.x = x;
		this.shape.y = y;
		this.shape.visible = true;
		this.shape.interactive = false;

		// var team = homePlanet.team;
		// var color = homePlanet.teamColor;
		// var graphics = new createjs.Graphics().beginFill(color).drawCircle(0, 0, 5, 5);
		// var shape = new createjs.Shape(graphics);

		// graphics.regX = 5 / 2;
		// graphics.regY = 5 / 2;
		// graphics.x = homePlanet.x;
		// graphics.y = homePlanet.y;

  //   	mainStage.addChild(shape);

		// this.send = function(){
		// 	homePlanet.setShipsNum( homePlanet.getShipsNum() - 1);
		// 	TweenMax.fromTo( shape, 5, { x: homePlanet.x, y: homePlanet.y }, { x: destinationPlanet.x, y: destinationPlanet.y, ease:Linear.easeNone, onComplete: function(){
		// 		destinationPlanet.updateShipsNum(1);
		// 		destinationPlanet.team = homePlanet.team;
		// 		destinationPlanet.changeColor(homePlanet.color);
		// 		mainStage.removeChild(shape);
		// 	}});
		// };
	};

	Ship.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );

	return Ship;
});