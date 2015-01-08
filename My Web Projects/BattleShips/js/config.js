define(function(){
	var config = {
		gameStates: { 
			ARRANGE_SHIPS: 'arrange_ships',
			BATTLE: 'battle',
			PLAYERS_TURN: 'players_turn',
			COMPUTERS_TURN: 'computerss_turn',
			CHECK_RESULT: 'check_result',
			GAME_OVER: 'game_over'
		},
		shipsByType: ['aircraftCarrier', 'battleship', 'cruiser', 'destroyer', 'destroyer2', 'submarine', 'submarine2'],
		shipsData: {
			'aircraftCarrier': { imagePath: 'img/aircraft_carrier_5.png', width: 250, height: 50 },
			'battleship': { imagePath: 'img/battleship_4.png', width: 200, height: 50 },
			'cruiser': { imagePath: 'img/cruiser_3.png', width: 150, height: 50 },
			'destroyer': { imagePath: 'img/destroyer_2.png', width: 100, height: 50 },
			'destroyer2': { imagePath: 'img/destroyer_2.png', width: 100, height: 50 },
			'submarine': { imagePath: 'img/submarine_1.png', width: 50, height: 50 },
			'submarine2': { imagePath: 'img/submarine_1.png', width: 50, height: 50 }
		},
		playerFieldData: {
			x: 50, y: 250, endX: 550, endY: 750
		},
		opponentFiledData: {
			x: 650, y: 250
		},
		gridSize: 50,
		fieldWidth: 500,
		fieldHeight: 500,
		shipDragging: false
	};

	return config;
});