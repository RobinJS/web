define(function(){
    var explosionSound = new Audio('./sounds/explosion_sound.mp3'),
        waterSound = new Audio('./sounds/water_sound.mp3');

	var soundPlayer = {
		playExplosionSound: function(){
            if ( !explosionSound.paused ) {
                explosionSound = new Audio('./sounds/explosion_sound.mp3');
            }
            
            explosionSound.play();
        },

        playWateronSound: function(){
            if ( !waterSound.paused ) {
                waterSound = new Audio('./sounds/water_sound.mp3');
            }

            waterSound.play();
        }
	};

	return soundPlayer;
});