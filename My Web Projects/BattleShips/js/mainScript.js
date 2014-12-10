require(["stage", "config" ],
	function( stage, config ) {

	var grid = 50,
		x = 0,
		y = 0,
		strikeFieldLeftOffset = 600,
		strikeFieldTopOffset = 250,
		fieldWidth = 500,
		fieldHeight = 500;


	$('#mainCanvas').css('background-position', strikeFieldLeftOffset + 'px ' + strikeFieldTopOffset + 'px');

	var marker = new createjs.Shape();
	marker.graphics.setStrokeStyle(1).beginFill("#000").rect(strikeFieldLeftOffset, strikeFieldTopOffset, 50, 50);
	marker.visible = false;
	

	// var border = new createjs.Shape();
	// border.graphics.setStrokeStyle(1).beginStroke("#000").rect(100, 100, 10 * 50, 10 * 50);
	// mainStage.addChild(border);

	// var container = new createjs.Container();
	// container.addChild(rect);
	// container.shadow = 1;
	// container.x = 100;
	// container.y = 100;

	mainStage.addChild(marker);

	mainStage.on('stagemousemove', function(e) {
		if ( (e.stageX <= strikeFieldLeftOffset || e.stageY <= strikeFieldTopOffset) || (e.stageX >= strikeFieldLeftOffset + fieldWidth || e.stageY >= strikeFieldTopOffset + fieldHeight ) ) return;

		marker.x = Math.floor( ( e.stageX / grid) ) * grid - strikeFieldLeftOffset;
		marker.y = Math.floor( ( e.stageY / grid) ) * grid - strikeFieldTopOffset;
	});

	mainStage.on('mouseenter', function(e){
		;;;console.log(1);
		if ( (e.stageX <= strikeFieldLeftOffset || e.stageY <= strikeFieldTopOffset) || (e.stageX >= strikeFieldLeftOffset + fieldWidth || e.stageY >= strikeFieldTopOffset + fieldHeight ) ) return;
		
		marker.visible = true;
	});

	mainStage.on('mouseleave', function(){
		marker.visible = false;
	});

	// $('#mainCanvas').css('-webkit-transform', 'scale(0.5)');

});