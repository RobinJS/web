 var mainStage = new createjs.Stage("mainCanvas");
 createjs.Ticker.addEventListener("tick", handleTick);
 mainStage.enableMouseOver(10)

 function handleTick(event) {
    
    mainStage.update();
 }