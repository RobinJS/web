define(function(){

	var SingleShip = function( homePlanet, destinationPlanet ){

		var team = homePlanet.team;
		var color = homePlanet.teamColor;
		var graphics = new createjs.Graphics().beginFill(color).drawCircle(0, 0, 5, 5);
		var shape = new createjs.Shape(graphics);

		graphics.regX = 5 / 2;
		graphics.regY = 5 / 2;
		graphics.x = homePlanet.x;
		graphics.y = homePlanet.y;

    	mainStage.addChild(shape);

		this.send = function(){
			homePlanet.setShipsNum( homePlanet.getShipsNum() - 1);
			TweenMax.fromTo( shape, 5, { x: homePlanet.x, y: homePlanet.y }, { x: destinationPlanet.x, y: destinationPlanet.y, ease:Linear.easeNone, onComplete: function(){
				destinationPlanet.updateShipsNum(1);
			}});
		};
	};

	return SingleShip;
});