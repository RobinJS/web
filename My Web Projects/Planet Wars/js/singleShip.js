define(function(){

	var SingleShip = function( homePlanet, destinationPlanet ){
		this.x = homePlanet.x;
		this.y = homePlanet.y;

		var team = homePlanet.team;
		var color = homePlanet.teamColor;
		var graphics = new createjs.Graphics().beginFill(color).drawCircle(this.x, this.y, 10, 10);
		var shape = new createjs.Shape(graphics);

		graphics.regX = 10 / 2;
		graphics.regY = 10 / 2;

    	mainStage.addChild(shape);

		this.move = function(){
			TweenMax.fromTo( shape, 5, { x: this.x, y: this.y }, { x: destinationPlanet.x, y: destinationPlanet.y, ease:Linear.easeNone } ) 
		};
	};

	return SingleShip;
});