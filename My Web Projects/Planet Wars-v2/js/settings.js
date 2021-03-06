define(function (require) {
	var settings = {
		gameWidth: 1280,
		gameHeight: 770,
		assets: ['img/planets.json', 'img/ships.json', 'img/touchMarker.png', 'img/destinationMarker.png'],
		maxNumOfShips : 5,
		clickedPlanet: null,
		destinationPlanet: null,
		touchMarker: null,
		line: null,
		destinationMarker: null,
		arrowStartX: 0,
		arrowStartY: 0
	};

	return settings;
});