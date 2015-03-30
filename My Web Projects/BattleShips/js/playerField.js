define(function (require) {
    "use strict";

    var Ship = require('ship'),
        config = require('config'),
        Signal = require('signals'),
        utils = require('utils'),
        soundPlayer = require('soundPlayer');

    var PlayerField = function( mainStage ){
    	this.mainStage = mainStage;
        this.marker = null;
        this.shipFound = false;
        this.shipSearchInterrupted = false;
        this.lastHitPos = {};
        this.lastDirection = '';
        this.directions = [ 'up', 'right', 'down', 'left' ];
        
    	this.ships = [];
        this.shipsRemaining = 7;
        this.lastClickedShip = null;
        this.cantRotateShadowTimeout = null;

        this.field = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.availableArea = new createjs.Container();
        this.mainStage.addChild(this.availableArea);

        this.shipsContainer = new createjs.Container();
        this.mainStage.addChild( this.shipsContainer );

        this.hitMarks = new createjs.Container();
        this.mainStage.addChild( this.hitMarks );

        this.cantRotateShadow = new createjs.Container();
        this.mainStage.addChild( this.cantRotateShadow );

        this.explosionAnim = new createjs.Sprite(new createjs.SpriteSheet({
            images: ["./img/explosion.png"],
            frames: {width: 50, height: 50},
            animations: {
                anim:[0, 32, false]
            }
        }));

        this.explosionAnim.frameRate = 60;

        this.explosionAnim.visible = false;
        this.mainStage.addChild(this.explosionAnim);

        this.waterSplashAnim = new createjs.Sprite(new createjs.SpriteSheet({
            images: ["./img/water_splash.png"],
            frames: {width: 50, height: 50},
            animations: {
                anim: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], next: false, speed: 0.5 }
            }
        }));

        this.waterSplashAnim.visible = false;
        this.mainStage.addChild(this.waterSplashAnim);

        this.events = {
            fullSectorMarked: new Signal(),
            emptySectorMarked: new Signal(),
            updateShipsRemainingText: new Signal(),
            endGame: new Signal()
        };

    	this.init();
    };

    $.extend(PlayerField.prototype, {
    	init: function(){
			// create ships and position them before arrange
			var shipsInitialNum = 7;
			for (var i = 0; i < shipsInitialNum; i++) {
				this.ships[i] = new Ship(config.shipsByType[i], this.field);
                this.ships[i].image.visible = true;
                this.shipsContainer.addChild( this.ships[i].image );

                this.ships[i].events.showAvailableArea.add(function(i){
                    this.showAvailableArea( this.ships[i] );
                }.bind(this, i));

                this.ships[i].events.hideAvailableArea.add(function(i){
                    this.availableArea.removeAllChildren();
                }.bind(this, i));
			}
    	},

        showAvailableArea: function( ship ){
            var availableSectors = [];
            // iterate all field sectors to find which are available (the ship can fit there)
            for (var y = 0; y < this.field.length; y++) {
                for (var x = 0; x < this.field.length; x++) {
                    var sectorIsAvailable = this.sectorIsAvailable( x, y );
                    if ( sectorIsAvailable ) {
                        // create Shape and add it to available sectors Container
                        var availableSector = new createjs.Shape();
                        availableSector.graphics.setStrokeStyle(1).beginFill('rgba(71, 216, 79, 1)').beginStroke('#fff').rect(0, 0, config.gridSize, config.gridSize );
                        availableSector.x = x * config.gridSize + config.playerFieldData.x;
                        availableSector.y = y * config.gridSize + config.playerFieldData.y;
                        
                        availableSectors.push( '' + y + x );
                        this.availableArea.addChild( availableSector );
                        ship.availableSectors = availableSectors;
                    }
                }
            }
        },

        sectorIsAvailable: function( currentSectorX, currentSectorY ){
            var startX = currentSectorX - 1,
                endX = currentSectorX + 1,
                startY = currentSectorY - 1,
                endY = currentSectorY + 1,
                sectorsToCheck = 9;

            // check all surrounding sectors
            for (var y = startY; y <= endY; y++) {
                for (var x = startX; x <= endX; x++) {

                    if ( y >= 0 && y < this.field.length && x >= 0 && x < this.field.length ) {
                        var sector = this.field[y][x];
                        
                        if ( sector == 1 || sector === 'x' || sector === '.' ) {
                            y = endY;
                            x = endX;
                            break;
                        }
                    }
                    
                    sectorsToCheck--;
                }
            }

            if ( sectorsToCheck === 0 ) {
                return true;
            }

            return false;
        },

    	enableShipsClick: function(){
            this.ships.forEach(function(ship){
                ship.clickEnabled = true;
            });
    	},

        disableShipsClick: function(){
            this.ships.forEach(function(ship){
                ship.clickEnabled = false;
            });
        },

        autoArrange: function(){
            this.clearField();
            this.lastClickedShip = null;

            this.ships.forEach(function(ship, idx){
                var rotate = utils.toBeRotated();

                if ( rotate ) {
                    ship.rotate();
                }

                this.drawShip(ship);
            }.bind(this));
        },

        drawShip: function( ship ){
            var that = this,
                allSquaresFree = false,
                randPosition = utils.getValidRandomPosition( ship, this.field );

            function drawShipImage () {
                var rotationOffset = ship.getRotationOffset();
                ship.image.x = config.playerFieldData.x + (randPosition.x * 50) + rotationOffset;
                ship.image.y = config.playerFieldData.y + (randPosition.y * 50);

                // save ship image coordinates after auto arrange
                ship.arrangedX = ship.image.x;
                ship.arrangedY = ship.image.y;
                ship.arrangedRotationType = ship.rotationType;
            }

            utils.checkSectors( ship, this.field, randPosition );
            utils.markSectorsAsFull( ship, this.field, randPosition );
            drawShipImage();
        },

        computersTurn: function(){
            if ( !this.shipFound ) {
                var randPosition = this.getNewPosition( this.field );
                this.checkHittedSector( randPosition );
            } else {
                this.searchForShipParts();
            }
        },

        getNewPosition: function( playerField ){
            var position = {},
                maxX = 10,
                maxY = 10;

            position.x = Math.floor( Math.random() * maxX );
            position.y = Math.floor( Math.random() * maxY );

            if ( playerField[position.y][position.x] === 'x' || playerField[position.y][position.x] === '.' ) {
                while ( playerField[position.y][position.x] === 'x' || playerField[position.y][position.x] === '.' ) {

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

        checkHittedSector: function( hitPosition ){
            if ( this.field[hitPosition.y][hitPosition.x] === 1 ) {
                if ( this.shipSearchInterrupted ) {
                    this.shipSearchInterrupted = false;
                }

                this.shipFound = true;
                this.lastHitPos.x = hitPosition.x;
                this.lastHitPos.y = hitPosition.y;
                this.markAsHit( hitPosition );
            } else if ( this.field[hitPosition.y][hitPosition.x] === 0 ) {
                if ( this.shipFound ) {
                    this.shipSearchInterrupted = true;
                }

                this.markAsEmpty( hitPosition );
            }
        },

        tryToRotateShip: function(){
            if ( this.lastClickedShip === null ) {
                return;
            }

            var testShipParams = this.createTestShipParams(),
                canBeDropped = true;

            for (var y = testShipParams.startY; y <= testShipParams.endY; y++) {
                for (var x = testShipParams.startX; x <= testShipParams.endX; x++) {
                    var sectorCode = "" + y + x;

                    if ( this.lastClickedShip.availableSectors.indexOf( sectorCode ) === -1 ) {
                        canBeDropped = false;
                        y = testShipParams.endY;
                        x = testShipParams.endX;
                    }
                }
            }

            // check if ship is dropped over available area
            if ( canBeDropped ) {
                this.lastClickedShip.emptySectorsUnderShip();
                this.lastClickedShip.rotate();
                this.lastClickedShip.arrangedX = this.lastClickedShip.image.x;
                this.lastClickedShip.arrangedY = this.lastClickedShip.image.y;

                this.lastClickedShip.markSectorsAsFull();
            } else {
                this.showCantRotateShadow( testShipParams );
            }
        },

        showCantRotateShadow: function( testShipParams ){
            if ( this.cantRotateShadow.children.length !== 0 ) {
                this.cantRotateShadow.removeAllChildren();
            }

            var cantRotateShadowImage = new createjs.Shape();
            cantRotateShadowImage.graphics.setStrokeStyle(1).beginFill('rgba(255, 43, 43, 0.7)').rect(0, 0, this.lastClickedShip.sectorsHeight * config.gridSize, this.lastClickedShip.sectorsWidth * config.gridSize);
            cantRotateShadowImage.x = testShipParams.startX * config.gridSize + config.playerFieldData.x;
            cantRotateShadowImage.y = testShipParams.startY * config.gridSize + config.playerFieldData.y;
            this.cantRotateShadow.addChild( cantRotateShadowImage );

            clearTimeout(this.cantRotateShadowTimeout);
            this.cantRotateShadowTimeout = setTimeout(function(){
                this.cantRotateShadow.removeAllChildren();
            }.bind(this), 600);
        },

        createTestShipParams: function(){
            var newEndSectorX = -1,
                newEndSectorY = -1;

            if ( this.lastClickedShip.rotationType === 'horizontal' ) {
                newEndSectorX = this.lastClickedShip.startSectorX;
                newEndSectorY = this.lastClickedShip.startSectorY + this.lastClickedShip.sectorsWidth - 1;
            } else {
                newEndSectorX = this.lastClickedShip.startSectorX + this.lastClickedShip.sectorsHeight - 1;
                newEndSectorY = this.lastClickedShip.startSectorY;
            }

            return {
                startX: this.lastClickedShip.startSectorX,
                startY: this.lastClickedShip.startSectorY,
                endX: newEndSectorX,
                endY: newEndSectorY
            };
        },

        markAsHit: function( hitPosition ){
            var that = this;

            function animEndHandler(){
                that.explosionAnim.removeEventListener('animationend', animEndHandler);
                that.explosionAnim.visible = false;

                var newHitMark = new createjs.Bitmap("img/hitted_mark.png");
                newHitMark.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
                newHitMark.y = hitPosition.y * config.gridSize + config.playerFieldData.y;
                that.hitMarks.addChild( newHitMark );
                
                that.ships.forEach(function(ship, idx){
                    if ( (hitPosition.x >= ship.startSectorX && hitPosition.x <= ship.endSectorX) && (hitPosition.y >= ship.startSectorY && hitPosition.y <= ship.endSectorY) ) {
                        ship.sectorsHitted++;

                        // check if ship sunk
                        if ( ship.sectorsHitted === ship.size ) {
                            ship.sunk = true;
                            that.shipsRemaining--;
                            that.events.updateShipsRemainingText.dispatch();
                            that.markShipSunk( ship );
                            that.markSurroundingSectorsAsEmpty( ship );
                        }
                    }

                    if ( idx === that.ships.length - 1 ) {
                        // check if all ships sunk
                        if ( that.shipsRemaining === 0 ) {
                            that.events.endGame.dispatch();
                        } else {
                            that.events.fullSectorMarked.dispatch();
                        }
                    }
                });
            }

            this.field[hitPosition.y][hitPosition.x] = 'x';

            this.explosionAnim.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
            this.explosionAnim.y = hitPosition.y * config.gridSize + config.playerFieldData.y;

            this.explosionAnim.addEventListener('animationend', animEndHandler);

            this.explosionAnim.visible = true;
            soundPlayer.playExplosionSound();
            this.explosionAnim.gotoAndPlay('anim');
        },

        searchForShipParts: function(){
            var that = this,
                 newHitPosition = {};

            newHitPosition.x = this.lastHitPos.x;
            newHitPosition.y = this.lastHitPos.y;

            if ( this.lastDirection === '' || this.shipSearchInterrupted ) {
                this.lastDirection = this.getNewDirection();
            }

            function check(){
                switch( that.lastDirection ){
                    case 'up': newHitPosition.y -= 1; break;
                    case 'right': newHitPosition.x += 1; break;
                    case 'down': newHitPosition.y += 1; break;
                    case 'left': newHitPosition.x -= 1; break;
                }

                if ( newHitPosition.x < 0 || newHitPosition.x > 9 || newHitPosition.y < 0 || newHitPosition.y > 9 ) {
                    // newHitPosition is outside field
                    that.lastDirection = '';
                    that.searchForShipParts();
                } else if ( that.field[newHitPosition.y][newHitPosition.x] === 'x' ){
                    // newHitPosition already hitted
                    check();
                } else if ( that.field[newHitPosition.y][newHitPosition.x] === '.' ){
                    that.lastDirection = '';
                    that.searchForShipParts();
                } else {
                    that.checkHittedSector( newHitPosition );
                }
            }
            
            check();
        },

        markAsEmpty: function( hitPosition ){
            var that = this;

            function animEndHandler(){
                that.waterSplashAnim.removeEventListener('animationend', animEndHandler);
                that.waterSplashAnim.visible = false;

                that.addEmptyHitMark( hitPosition );
                that.events.emptySectorMarked.dispatch();
            }

            this.field[hitPosition.y][hitPosition.x] = '.';

            this.waterSplashAnim.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
            this.waterSplashAnim.y = hitPosition.y * config.gridSize + config.playerFieldData.y;

            this.waterSplashAnim.addEventListener('animationend', animEndHandler);

            this.waterSplashAnim.visible = true;
            soundPlayer.playWateronSound();
            this.waterSplashAnim.gotoAndPlay('anim');
        },

        addEmptyHitMark: function( hitPosition ){
            var newHitMark = new createjs.Bitmap("img/empty_mark.png");
            newHitMark.x = hitPosition.x * config.gridSize + config.playerFieldData.x;
            newHitMark.y = hitPosition.y * config.gridSize + config.playerFieldData.y;
            this.hitMarks.addChild( newHitMark );
        },

        markShipSunk: function( ship ){
            var sunkMark = new createjs.Shape();
            sunkMark.graphics.setStrokeStyle(1).beginFill('rgba(0, 101, 155, 0.7)').rect(0, 0, ship.sectorsWidth * config.gridSize, ship.sectorsHeight * config.gridSize);
            
            sunkMark.x = ship.startSectorX * config.gridSize + config.playerFieldData.x;
            sunkMark.y = ship.startSectorY * config.gridSize + config.playerFieldData.y;
            this.hitMarks.addChild( sunkMark );

            this.shipFound = false;
            this.lastHitPos = {};
            this.lastDirection = '';
            this.directions = [ 'up', 'right', 'down', 'left' ];
        },

        markSurroundingSectorsAsEmpty: function( ship ){
            for (var y = ship.startSectorY - 1; y <= ship.endSectorY + 1; y++) {
                for (var x = ship.startSectorX - 1; x <= ship.endSectorX + 1; x++) {
                    if ( y >= 0 && y < this.field.length && x >= 0 && x < this.field.length ) {
                        var sector = this.field[y][x];
                        if ( sector == 0 ) {
                            this.field[y][x] = '.';
                            this.addEmptyHitMark( {x: x, y: y} );
                        }
                    }
                }
            }
        },

        getNewDirection: function(){
            if ( this.shipSearchInterrupted ) {
                // check if the opposite direction is available
                var oppositeDirectionIndex = this.getOppositeDirectionIndex();

                if ( oppositeDirectionIndex !== -1 ) {
                    return this.directions.splice( oppositeDirectionIndex, 1 ).toString();
                }
            }

            // get any available direction
            var idx = Math.floor(Math.random() * this.directions.length );
            return this.directions.splice( idx, 1 ).toString();
        },

        getOppositeDirectionIndex: function(){
            var newDir = null;

            switch( this.lastDirection ){
                case 'up': newDir = 'down'; break;
                case 'right': newDir = 'left'; break;
                case 'down': newDir = 'up'; break;
                case 'left': newDir = 'right'; break;
            }

            return this.directions.indexOf( newDir );
        },

        clearField: function(){
            for (var i = 0; i < this.field.length; i++) {
                for (var j = 0; j < this.field.length; j++) {
                    this.field[i][j] = 0;
                }
            }
        },

        reset: function(){
            this.hitMarks.removeAllChildren();
            this.shipsRemaining = 7;
            this.lastClickedShip = null;

            this.ships.forEach(function(ship){
                ship.sectorsHitted = 0;
                ship.sunk = false;
            });
        }
    });
    
    return PlayerField;
});