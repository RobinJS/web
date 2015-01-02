define(function(){
	var utils = {
		toBeRotated: function(){
            return Math.floor(Math.random() * 2) === 1 ? true : false;
        },

        getValidRandomPosition: function( ship, field ){
            var position = {},
                maxX = field.length - (ship.sectorsWidth || 10),
                maxY = field.length - (ship.sectorsHeight || 10);

            position.x = Math.floor( Math.random() * maxX );
            position.y = Math.floor( Math.random() * maxY );

            if ( field[position.y][position.x] === 1 ) {
                while ( field[position.y][position.x] === 1 ) {

                    position.x++;
                    if ( position.x >= maxX ) {
                        position.x = 0;
                        position.y++;

                        if ( position.y >= maxY ) {
                            position.y = 0;
                        }
                    }
                }
            }

            return position;
        },

        checkSectors: function( ship, field, randPosition ) {
            for (var y = randPosition.y - 1; y <= randPosition.y + ship.sectorsHeight; y++) {
                for (var x = randPosition.x - 1; x <= randPosition.x + ship.sectorsWidth; x++) {
                    if ( y === -1 || x === -1 || y >= field.length || x >= field.length ) {
                        continue;
                    }

                    if ( field[y][x] === 1 ) {
                        this.checkNextPosition( ship, field, randPosition );
                        return;
                    }

                    if ( (y === randPosition.y + ship.sectorsHeight) && (x === randPosition.x + ship.sectorsWidth ) ) {
                        allSquaresFree = true;
                    }
                }
            }
        },

        checkNextPosition: function( ship, field, randPosition ) {
            randPosition.x++;
            if ( randPosition.x >= field.length ) {
                randPosition.x = 0;
                randPosition.y++;

                if ( randPosition.y >= field.length ) {
                    randPosition.y = 0;
                }
            }

            // check if randPosition is not free, or the ship will go outside fields bounds
            if ( (field[randPosition.y][randPosition.x] === 1) || (randPosition.x + ship.sectorsWidth - 1 >= field.length) || (randPosition.y + ship.sectorsHeight - 1 >= field.length) ) {
                this.checkNextPosition( ship, field, randPosition );
                return;
            }
            
            this.checkSectors( ship, field, randPosition );
        },

        markSectorsAsFull: function( ship, field, randPosition ) {
            ship.startSectorX = randPosition.x;
            ship.startSectorY = randPosition.y;
            ship.endSectorX = randPosition.x + ship.sectorsWidth - 1;
            ship.endSectorY = randPosition.y + ship.sectorsHeight - 1;

            for (var y = randPosition.y; y < randPosition.y + ship.sectorsHeight; y++) {
                for (var x = randPosition.x; x < randPosition.x + ship.sectorsWidth; x++) {
                    if ( y !== -1 && x !== -1 && y < field.length && x < field.length ) {
                        field[y][x] = 1;
                    }
                }
            }
        }
	};

	return utils;
});