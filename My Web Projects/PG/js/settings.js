define(function (require) {
	var settings = {
		gameWidth: 1280,
		gameHeight: 770,
		assets: ['img/bg.jpg', 'img/cards.json', 'img/buttons.png', 'img/cards_back.png'],
		// cardPositions: {
		// 	dealer: { x: 260, y: 330 },
		// 	player: [ {x: 480, y: 330}, {x: 660, y: 330}, {x: 840, y: 330}, {x: 1020, y: 330} ]
		// },
		cardPositions: [{x: 350, y: 330}, {x: 570, y: 330}, {x: 750, y: 330}, {x: 930, y: 330}, {x: 1110, y: 330}],
		cardsDefaultPosition: {x: 104, y: 174},
		buttons: {
			doubleHalfBtn: { normal: {x: 0, y: 0}, down: {x: 0, y: 46}, inactive: {x: 0, y: 92}, width: 156, height: 46 },
			doubleBtn: { normal: {x: 0, y: 138}, down: {x: 0, y: 184}, inactive: {x: 0, y: 230}, width: 156, height: 46 },
			increaseBtn: { normal: {x: 0, y: 276}, down: {x: 46, y: 276}, inactive: {x: 92, y: 276}, width: 46, height: 46 },
			decreaseBtn: { normal: {x: 0, y: 322}, down: {x: 46, y: 322}, inactive: {x: 92, y: 322}, width: 46, height: 46 }
		},
		totalFlippedCards: 5,
		cardsScale: 1.5
	};

	return settings;
});