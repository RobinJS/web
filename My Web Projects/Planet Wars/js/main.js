require([ "settings", "planet" ],
	function( settings, Planet ) {

	var game = new Phaser.Game(1280, 770, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
	// var planets = new PIXI.DisplayObjectContainer();
	var planets = [],
		line;
	// create planes
	// set starting planet
	// set opponent(s) planets
	// start producing inhabitants
	// create functionality
	// create score and hud

	function preload() {
        game.scale.maxWidth = 1280;
        game.scale.maxHeight = 770;
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        // game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.scale.setScreenSize();

        // game.scale.compatibility.supportsFullScreen = true;
        game.scale.fullScreenTarget = game.canvas;
        // game.scale.compatibility.orientationFallback = 'viewport';
        game.scale.setupScale(1280, 770);

        // game.load.spritesheet("planets", "img/planets.png", 720, 1280);
        // game.load.json("planets", "img/planets.json");
        game.load.atlasJSONHash("planetsAtlas", "img/planets.png", "img/planets.json");
        game.load.image('touchMarker', 'img/touchMarker.png');
        game.load.image('destinationMarker', 'img/destinationMarker.png');

        
    }

    function create() {
        game.stage.setBackgroundColor("#000000");
        debug = game.add.text(0, 50, " ", { font: "42px Verdana", fill: "#ffffff", align: "center" });

        //  The scrolling starfield background
        // backgroundImage = game.add.tileSprite(0, 0, 1280, 770, 'bgImage');
        // game.add.existing(planets);
        var planet1 = new Planet( game, "1", 250, 250 );
        planet1.setTeam( settings.TEAMS.PLAYER );
        planets.push(planet1);

        var planet2 = new Planet( game, "2", 650, 450 );
        planet2.setTeam( settings.TEAMS.OPPONENT );
        planets.push(planet2);

        var planet3 = new Planet( game, "3", 1050, 250 );
        planet3.setTeam( settings.TEAMS.EMPTY );
        planets.push(planet3);

        // window.line = new Phaser.Line(0, 0, 0, 0);
        window.line = game.add.graphics(0, 0);
        window.line.lineStyle(10, 0xffd900, 1);

        // window.line.lineTo(350, 350);
        // window.line.width = 3;
        // game.add

        planets.forEach(function(planet){
        	planet.events._inputUp.add(function(){
        		planets.forEach(function(planet){
        			planet.destinationMarker.visible = false;
        		});
        	});

        	planet.events._inputDown.add(function(x, y){
        		moveMarker(x, y);
        	});
        });

        function moveMarker(x, y){
        	lineX = x;
        	lineY = y;
        	// window.line.x = x;
        	// window.line.y = y;
        	window.line.moveTo(x, y);
        }

        // this.planet1 = game.add.sprite(0, 0, 'planetsAtlas');
        // this.planet1.frameName = "greenPlanet.png";
        // game.physics.enable(this.planet1, Phaser.Physics.ARCADE);
        // planet1.body.collideWorldBounds = true;
        // this.planet1.scale.x = 0.5;
        // this.planet1.scale.y = 0.5;
        // this.planet1.x = 150;
        // this.planet1.y = 50;
        // this.planet1.anchor.set(0.5, 0.5);
        // this.planet1.body.immovable = true;
        // this.container.addChild(this.planet1);
	    game.input.mouse.mouseMoveCallback = function(){
	    	console.log(1);
	    	window.line.moveTo(game.input.x, game.input.y);
			window.line.lineTo(300, 30);
	    	window.line.endFill();
	    };
    }


    var lineX = lineY = 0;
    function update() {
    	// window.line.clear();
    	// window.line.update();
    	// console.log( game.input.x, game.input.y );
    	// line.setTo( lineX, lineY, game.input.x, game.input.y );
  //   	config.line.graphics.clear();
		// config.line.graphics.setStrokeStyle(3).beginStroke("#FFD800");
		// config.line.graphics.moveTo(lineX, lineY);
		// config.line.graphics.lineTo(game.input.x, game.input.y);

        // game.physics.arcade.overlap(player.container.children[1], [crystals, coins], collisionHandler, null, this);
    }

    function render() {
    	// game.debug.geom(line);
    }

	// window.planets = [
	// 	new Planet( 1, 'player', 30, "#ffffff", 70, 70),
	// 	new Planet( 2, 'empty', 30, "#C3C3C3", 200, 200),
	// 	new Planet( 3, 'opponent', 30, "#ff0000", 400, 400)
	// ];
		
	// planets.forEach(function(planet){
	// 	planet.draw();
	// });

	
	// function findDestinationPlanet( mouseX, mouseY ){
	// 	var destPlanet = false;
	// 	planets.forEach(function(planet){
	// 		if ( (mouseX >= (planet.x - planet.size) && mouseX <= (planet.x + planet.size)) && (mouseY >= (planet.y - planet.size) && mouseY <= (planet.y + planet.size)) ) {
	// 			destPlanet = planet;
	// 		}
	// 	});

	// 	return destPlanet;
	// }

	// mainStage.on('stagemouseup', function(e){
		
	// 	mainStage.removeEventListener('stagemousemove', arrow.drawArrow);
	// 	markers.removeTouchMarker();
	// 	markers.removeDestinationMarker();
	// 	config.line.graphics.clear();

	// 	if ( config.destinationPlanet = findDestinationPlanet( e.stageX, e.stageY ) ) {
			
	// 		window.newGroupOfShips = new Ships( config.clickedPlanet, config.destinationPlanet );
	// 		window.newGroupOfShips.sendShips();
	// 	}

	// 	config.clickedPlanet = null;
	// });


});