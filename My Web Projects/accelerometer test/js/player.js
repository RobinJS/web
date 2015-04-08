define(function (require) {
    "use strict";

    var settings = require('js/settings');

    var Player = function( game ){
    	this.playerContainer = game.add.group();
        this.playerContainer.x = game.world.centerX;
        this.playerContainer.y = game.world.height - settings.player.bottomOffset;
        this.playerContainer.enableBody = true;
        game.physics.enable(this.playerContainer, Phaser.Physics.ARCADE);
        // player.body.collideWorldBounds = true;
        
        this.player = game.add.sprite(0, 0, 'player');
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        // player.body.collideWorldBounds = true;

        this.player.anchor.set(0.5, 1);
        this.player.body.immovable = true;
        this.playerContainer.addChild(this.player);

        this.magnetHitArea = game.add.sprite(0, 0, 'magnetHitAreaImg');
        game.physics.enable(this.magnetHitArea, Phaser.Physics.ARCADE);
        // this.magnetHitArea.body.collideWorldBounds = true;
        this.magnetHitArea.width = 400;
        this.magnetHitArea.height = 300;
        this.magnetHitArea.anchor.set(0.5, 1);
        this.magnetHitArea.body.immovable = true;
        
        this.playerContainer.addChild(this.magnetHitArea);

        return this.playerContainer;
    };

    return Player;
});