define(function (require) {
	var settings = {
		gameWidth: 1280,
		gameHeight: 770,
		assets: ['img/bg.jpg', 'img/cards.json', 'img/buttons.png', 'img/cards_back.png'],
		btnTypes: [ "double", "doubleHalf", "increase", "decrease", "start", "collect" ],
		// cardPositions: {
		// 	dealer: { x: 260, y: 330 },
		// 	player: [ {x: 480, y: 330}, {x: 660, y: 330}, {x: 840, y: 330}, {x: 1020, y: 330} ]
		// },
		cardPositions: [{x: 350, y: 330}, {x: 570, y: 330}, {x: 750, y: 330}, {x: 930, y: 330}, {x: 1110, y: 330}],
		cardPositionOutsideGame: 1280 + 200,
		cardsDefaultPosition: {x: 104, y: 174},
		buttons: {
			doubleHalfBtn: { normal: {x: 0, y: 0}, down: {x: 0, y: 46}, inactive: {x: 0, y: 92}, width: 156, height: 46 },
			doubleBtn: { normal: {x: 156, y: 0}, down: {x: 156, y: 46}, inactive: {x: 156, y: 92}, width: 156, height: 46 },
			startBtn: { normal: {x: 312, y: 0}, down: {x: 312, y: 46}, inactive: {x: 312, y: 92}, width: 156, height: 46 },
			collectBtn: { normal: {x: 468, y: 0}, down: {x: 468, y: 46}, inactive: {x: 468, y: 92}, width: 156, height: 46 },
			increaseBtn: { normal: {x: 624, y: 0}, down: {x: 624, y: 46}, inactive: {x: 624, y: 92}, width: 46, height: 46 },
			decreaseBtn: { normal: {x: 670, y: 0}, down: {x: 670, y: 46}, inactive: {x: 670, y: 92}, width: 46, height: 46 }
		},
		totalGameCards: 5,
		cardsScale: 1.5
	};

	return settings;
});