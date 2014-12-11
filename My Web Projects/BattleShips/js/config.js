define(function(){
	var config = {
		gameStates: { 
			ARRANGE_SHIPS: 'arrange_ships',
			BATTLE: 'battle',
			PLAYERS_TURN: 'players_turn',
			COMPUTERS_TURN: 'computerss_turn',
			CHECK_RESULT: 'check_result',
			GAME_END: 'game_end'
		},
		shipsImgPath: {
			'aircraftCarrier': 'img/aircraft_carrier_5.png',
			'battleship': 'img/battleship_4.png',
			'cruiser': 'img/cruiser_3.png',
			'destroyer': 'img/destroyer_2.png',
			'submarine': 'img/submarine_1.png'
		}
	};

	return config;
});