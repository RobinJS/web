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
			width: 156, height: 46,
			doubleHalfBtn: { normal: 0, down: 46, inactive: 92 },
			doubleBtn: { normal: 138, down: 184, inactive: 230 }
		},
		totalFlippedCards: 5,
		cardsScale: 1.5
	};

	return settings;
});