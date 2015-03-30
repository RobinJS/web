define(function(){
    var explosionSound = new Audio('./sounds/explosion_sound.mp3'),
        waterSound = new Audio('./sounds/water_sound.mp3'),
        soundsEnabled = true;

	var soundPlayer = {
		playExplosionSound: function(){
            if ( !soundsEnabled ) return;

            if ( !explosionSound.paused ) {
                explosionSound = new Audio('./sounds/explosion_sound.mp3');
            }
            
            explosionSound.play();
        },

        playWateronSound: function(){
            if ( !soundsEnabled ) return;
            
            if ( !waterSound.paused ) {
                waterSound = new Audio('./sounds/water_sound.mp3');
            }

            waterSound.play();
        },

        disableSounds: function(){
            soundsEnabled = false;
        },

        enableSounds: function(){
            soundsEnabled = true;
        }
	};

	return soundPlayer;
});