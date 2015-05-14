define(function (require) {
    "use strict";

    var settings = require('settings');

    var Player = function( game ){
    /* CONTAINER */
        this.container = game.add.group();
        this.container.x = game.world.centerX;
        this.container.y = game.world.height - settings.player.bottomOffset;
        this.container.enableBody = true;
        game.physics.enable(this.container, Phaser.Physics.ARCADE);

    /* PLAYER FILL */
        this.playerBg = game.add.sprite(0, 0, 'player_bg');
        game.physics.enable(this.playerBg, Phaser.Physics.ARCADE);
        // playerBg.body.collideWorldBounds = true;
        // this.playerBg.scale.x = 0.5;
        // this.playerBg.scale.y = 0.5;
        this.playerBg.height = 0;
        this.playerBg.y = -9;
        this.playerBg.anchor.set(0.5, 1);
        this.playerBg.body.immovable = true;
        this.container.addChild(this.playerBg);

    /* FRAME */
        this.frame = game.add.sprite(0, 0, 'player_frame');
        game.physics.enable(this.frame, Phaser.Physics.ARCADE);
        // frame.body.collideWorldBounds = true;
        // this.frame.scale.x = 0.5;
        // this.frame.scale.y = 0.5;
        this.frame.y = -50;
        this.frame.anchor.set(0.5, 0.5);
        this.frame.body.immovable = true;
        this.container.addChild(this.frame);

    /* GLOW */
        this.frame = game.add.sprite(0, 0, 'player_glow');
        game.physics.enable(this.frame, Phaser.Physics.ARCADE);
        // frame.body.collideWorldBounds = true;
        // this.frame.scale.x = 0.5;
        // this.frame.scale.y = 0.5;
        this.frame.y = -47;
        this.frame.anchor.set(0.5, 0.5);
        this.frame.body.immovable = true;
        this.container.addChild(this.frame);

        // start glow annimation
        game.add.tween(this.frame).to( { alpha: 0.3 }, 1000, "Power0", true, 0, -1, true);

    /* MAGNET HIT AREA */
        this.magnetHitArea = game.add.sprite(0, 0, 'magnetHitAreaImg');
        game.physics.enable(this.magnetHitArea, Phaser.Physics.ARCADE);
        // this.magnetHitArea.body.collideWorldBounds = true;
        this.magnetHitArea.width = 400;
        this.magnetHitArea.height = 300;
        this.magnetHitArea.anchor.set(0.5, 1);
        this.magnetHitArea.body.immovable = true;
        
        this.container.addChild(this.magnetHitArea);
    };

    Player.prototype.expandBg = function(){
        if ( this.playerBg.height < this.playerBg.texture.height ) {
            this.playerBg.height += 15/2;
        }
    };

    return Player;
});