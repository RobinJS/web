(function () {
    var ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
	
    //drawing the house
    ctx.fillStyle = "#975B5B";
    ctx.strokeStyle = "black";
    ctx.fillRect(10, 150, 250, 150);
    ctx.strokeRect(10, 150, 250, 150);
    // top left window
    ctx.clearRect(30, 170, 40, 20);
    ctx.clearRect(73, 170, 40, 20);
    ctx.clearRect(30, 193, 40, 20);
    ctx.clearRect(73, 193, 40, 20);
    // top right window
    ctx.clearRect(155, 170, 40, 20);
    ctx.clearRect(198, 170, 40, 20);
    ctx.clearRect(155, 193, 40, 20);
    ctx.clearRect(198, 193, 40, 20);
    // bottom right window
    ctx.clearRect(155, 233, 40, 20);
    ctx.clearRect(198, 233, 40, 20);
    ctx.clearRect(155, 256, 40, 20);
    ctx.clearRect(198, 256, 40, 20);
    // door
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(70, 270, 40, -0.5, 3.6, true);
    ctx.moveTo(35, 300);
    ctx.lineTo(35, 250);
    ctx.moveTo(105, 300);
    ctx.lineTo(105, 250);
    ctx.moveTo(70, 300);
    ctx.lineTo(70, 230);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(62, 280, 3, 0, 7, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(78, 280, 3, 0, 7, false);
    ctx.stroke();
    // roof
    ctx.beginPath();
    ctx.fillStyle = "#975B5B";
    ctx.moveTo(10, 150);
    ctx.lineTo(135, 50);
    ctx.lineTo(260, 150);
    ctx.lineTo(10, 150);
    ctx.fill();
    ctx.stroke();
    // chimney
    ctx.beginPath();
    ctx.fillStyle = "#975B5B";
    ctx.moveTo(190, 130);
    ctx.lineTo(190, 70);
    ctx.lineTo(210, 70);
    ctx.lineTo(210, 130);
    ctx.fill();
    ctx.stroke();

    // drawing bicycle
    // back wheel
    ctx.fillStyle = "#90CAD7";
    ctx.strokeStyle = "#348194";
    ctx.beginPath();
    ctx.arc(300, 280, 25, 0, 7, false);
    ctx.fill();
    ctx.stroke();
    // front wheel
    ctx.beginPath();
    ctx.arc(405, 280, 25, 0, 7, false);
    ctx.fill();
    // frame
    ctx.beginPath();
    ctx.moveTo(300, 280);
    ctx.lineTo(350, 280);
    ctx.lineTo(400, 245);
    ctx.lineTo(335, 245);
    ctx.lineTo(300, 280);
    ctx.moveTo(350, 280);
    ctx.lineTo(328, 230);
    ctx.moveTo(315, 230);
    ctx.lineTo(340, 230);
    ctx.moveTo(405, 280);
    ctx.lineTo(400, 230);
    ctx.lineTo(415, 220);
    ctx.moveTo(400, 230);
    ctx.lineTo(380, 225);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(350, 280, 8, 0, 7, false);
    ctx.moveTo(345, 275);
    ctx.lineTo(335, 270);
    ctx.moveTo(355, 285);
    ctx.lineTo(365, 290);
    ctx.stroke();
}());
