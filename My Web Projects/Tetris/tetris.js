window.onload = function () {
    var startNewGameButton = document.getElementById("startNewGame");
    addEventHandler(startNewGameButton, "click", startNewGame);
    var stopGameButton = document.getElementById("stopGame");
    addEventHandler(stopGameButton, "click", stopGame);
    var pauseGameButton = document.getElementById("pauseGame");
    addEventHandler(pauseGameButton, "click", pauseGame);
};

function addEventHandler(obj, eventName, handler) {
    if (document.attachEvent) {
        obj.attachEvent("on" + eventName, handler)
    } else if (document.addEventListener) {
        obj.addEventListener(eventName, handler, false);
    }
}

var game = "off";
var gameSpeed = 1000;
var moveable;
var FIELD_BORDER_LEFT = 0;
var FIELD_BORDER_RIGHT = 9;
var FIELD_BORDER_BOTTOM = 19;
var figure;
var nextFigure;
var rowsCleared = 0;
var level = 1;

var gameField = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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

var figureTypes = ["I", "J", "L", "O", "S", "T", "Z"];

function getFigureVariants(type) {
    // The first part's row of each figure variant equals the first row of the figure. This facilitate checkForFullRow() function.
    var variantsToReturn;
    switch (type) {
        case "I":
            variantsToReturn = [[0, 3, 0, 4, 0, 5, 0, 6], [0, 4, 1, 4, 2, 4, 3, 4]];
            break;
        case "J":
            variantsToReturn = [[0, 4, 2, 3, 1, 4, 2, 4], [0, 3, 1, 3, 1, 4, 1, 5], [0, 4, 1, 4, 2, 4, 0, 5], [0, 3, 0, 4, 0, 5, 1, 5]];
            break;
        case "L":
            variantsToReturn = [[0, 4, 1, 4, 2, 4, 2, 5], [0, 3, 1, 3, 0, 4, 0, 5], [0, 3, 1, 4, 2, 4, 0, 4], [0, 5, 1, 3, 1, 4, 1, 5]];
            break;
        case "O":
            variantsToReturn = [[0, 4, 1, 4, 0, 5, 1, 5], [0, 4, 1, 4, 0, 5, 1, 5]];
            break;
        case "S":
            variantsToReturn = [[0, 4, 1, 3, 1, 4, 0, 5], [0, 3, 1, 3, 2, 4, 1, 4]];
            break;
        case "T":
            variantsToReturn = [[0, 3, 1, 4, 0, 4, 0, 5], [0, 4, 1, 3, 2, 4, 1, 4], [0, 4, 1, 3, 1, 4, 1, 5], [0, 4, 1, 4, 2, 4, 1, 5]];
            break;
        case "Z":
            variantsToReturn = [[0, 3, 1, 4, 0, 4, 1, 5], [0, 5, 1, 4, 2, 4, 1, 5]];
            break;
        default:
            console.log("Invalid figure type: " + type);
            break;
    }

    return variantsToReturn;
}

var listener = function (e) {
    if (!e) {
        e = window.event;
    }

    var command = e.keyCode - 37;
    switch (command) {
        case 0: figure.moveLeft(); break;
        case 1: figure.rotate(); break;
        case 2: figure.moveRight(); break;
        case 3: figure.moveDown(); break;
        default: break;
    }
}

function startNewGame() {
    moveable = clearInterval(moveable);
    document.getElementById("gameOver").style.display = "none";
    clearGameField();
    document.getElementById("rowsCleared").innerHTML = 0;
    document.getElementById("currentLevel").innerHTML = 1;

    game = "on";
    document.body.addEventListener("keydown", listener, false);
    createNextFigure();
    createFigure();
}

function stopGame() {
    moveable = clearInterval(moveable);
    document.body.removeEventListener("keydown", listener, false);
    rowsCleared = 0;
    level = 1;
    gameSpeed = 1000;
    game = "off";
}

function pauseGame() {
    if (game == "on") {
        alert("The game is paused. Click \"OK\" to resume.");
    }
}

function gameOver() {
    document.getElementById("gameOver").getElementsByTagName("span")[0].innerHTML = level;
    document.getElementById("gameOver").getElementsByTagName("span")[1].innerHTML = rowsCleared;
    document.getElementById("gameOver").style.display = "block";
    stopGame();
}

function createNextFigure() {
    var nextFigureType = figureTypes[getRandomNumber(figureTypes.length)];
    nextFigure = new Figure(nextFigureType);
}

function createFigure() {
    figure = nextFigure;
    createNextFigure();
    checkIfFigureCanBePlaced();

    if (game == "off") {
        return;
    }

    figure.gameFieldFigureAppearance(1);
    showNextFigure();
    moveable = setInterval(figure.moveDown, gameSpeed);
}

function checkIfFigureCanBePlaced() {
    for (var i = 0; i < figure.currentVariant.length; i += 2) {
        var row = figure.currentVariant[i];
        var col = figure.currentVariant[i + 1];

        if (gameField[row][col] == 1) {
            gameOver();
            break;
        }
    }
}

function showNextFigure() {
    /* Clearing the "#pannel"'s grid before showing next figure */
    var cells = document.querySelectorAll("#nextFigure table td");
    for (var i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = "transparent";
    }

    var figureToShow = nextFigure.currentVariant;
    /* Making next figure appear */
    for (var i = 0; i < figureToShow.length; i += 2) {
        var row = figureToShow[i];
        var col = figureToShow[i + 1] - 3;  /* Moving initial column coordinates to left so it will be easier to place next figure in the "#pannel"'s grid */

        var cell = document.getElementById("nextFigure").getElementsByTagName("tr")[row].getElementsByTagName("td")[col];
        cell.style.backgroundColor = "#92d5ef";
    }
}

function Figure(currentType) {
    this.currentType = currentType;
    var currentFigureAllVariants = getFigureVariants(currentType);
    var variantIndex = getRandomNumber(currentFigureAllVariants.length);
    this.currentVariant = currentFigureAllVariants[variantIndex];
    var currentFigureCoordinates;
    var currentCellRow;
    var currentCellCol;

    this.moveDown = function () {
        var figureCanMoveDown = checkIfFigureCanMoveDown();

        if (figureCanMoveDown) {
            figure.gameFieldFigureAppearance(0);

            /* Moving all variants of the current figure at the same time so the rotation be easier */
            for (var i = 0; i < currentFigureAllVariants.length; i++) {
                for (var j = 0; j < currentFigureAllVariants[0].length; j += 2) {
                    currentFigureAllVariants[i][j]++;
                }
            }

            /* Updating currentVariant */
            figure.gameFieldFigureAppearance(1);
        }
        else {
            moveable = clearInterval(moveable);
            checkForFullRow();
            createFigure();
        }
    };

    this.moveLeft = function () {
        var figureCanMoveLeft = checkIfFigureCanMoveLeft();

        if (figureCanMoveLeft) {
            figure.gameFieldFigureAppearance(0);
            for (var i = 0; i < currentFigureAllVariants.length; i++) {
                for (var j = 1; j < currentFigureAllVariants[0].length; j += 2) {
                    currentFigureAllVariants[i][j]--;
                }
            }

            //figure.currentVariant = currentFigureAllVariants[variantIndex];
            figure.gameFieldFigureAppearance(1);
        }
    };

    this.moveRight = function () {
        var figureCanMoveRight = checkIfFigureCanMoveRight();

        if (figureCanMoveRight) {
            figure.gameFieldFigureAppearance(0);
            for (var i = 0; i < currentFigureAllVariants.length; i++) {
                for (var j = 1; j < currentFigureAllVariants[0].length; j += 2) {
                    currentFigureAllVariants[i][j]++;
                }
            }

            //figure.currentVariant = currentFigureAllVariants[variantIndex];
            figure.gameFieldFigureAppearance(1);
        }
    };

    this.rotate = function () {
        if (checkIfFigureCanBeRotated()) {
            figure.gameFieldFigureAppearance(0);
            if (variantIndex < currentFigureAllVariants.length - 1) { // if variantIndex is not the last array of currentFigureAllVariants
                variantIndex++;
            }
            else if (variantIndex == currentFigureAllVariants.length - 1) { // if variantIndex points to the last array of currentFigureAllVariants, make variantIndex point to the first variant 
                //figure.gameFieldFigureAppearance(0);
                variantIndex = 0;
            }

            figure.currentVariant = currentFigureAllVariants[variantIndex];
            figure.gameFieldFigureAppearance(1);
        }
    };

    var checkIfFigureCanMoveDown = function () {
        for (var i = 0; i < figure.currentVariant.length; i += 2) {
            currentCellRow = figure.currentVariant[i];
            currentCellCol = figure.currentVariant[i + 1];

            if (currentCellRow == FIELD_BORDER_BOTTOM) {
                return false;
            }

            currentFigureCoordinates = getCurrentFigureCoordinates(); // Example: ["01", "02", "03", "04"]
            var nextCellBelowThisCell = gameField[currentCellRow + 1][currentCellCol];
            var isNextDownCellPartOfCurrentFigure = currentFigureCoordinates.indexOf((currentCellRow + 1).toString() + currentCellCol);
            if (nextCellBelowThisCell == 1 && isNextDownCellPartOfCurrentFigure == -1) {
                return false;
            }
        }

        return true;
    }

    var checkIfFigureCanMoveLeft = function () {
        for (var i = 0; i < figure.currentVariant.length; i += 2) {
            currentCellRow = figure.currentVariant[i];
            currentCellCol = figure.currentVariant[i + 1];

            if (currentCellCol == FIELD_BORDER_LEFT) {
                return false;
            }

            currentFigureCoordinates = getCurrentFigureCoordinates();
            var isNextLeftCellPartOfCurrentFigure = currentFigureCoordinates.indexOf(currentCellRow.toString() + (currentCellCol - 1));
            var nextCellLeftOfThisCell = gameField[currentCellRow][currentCellCol - 1];
            if (nextCellLeftOfThisCell == 1 && isNextLeftCellPartOfCurrentFigure == -1) {
                return false;
            }
        }

        return true;
    }

    var checkIfFigureCanMoveRight = function () {
        for (var i = figure.currentVariant.length - 2; i >= 0; i -= 2) {
            currentCellRow = figure.currentVariant[i];
            currentCellCol = figure.currentVariant[i + 1];

            if (currentCellCol == FIELD_BORDER_RIGHT) {
                return false;
            }

            currentFigureCoordinates = getCurrentFigureCoordinates();
            var isNextRightCellPartOfCurrentFigure = currentFigureCoordinates.indexOf(currentCellRow.toString() + (currentCellCol + 1));
            var nextCellRightOfThisCell = gameField[currentCellRow][currentCellCol + 1];
            if (nextCellRightOfThisCell == 1 && isNextRightCellPartOfCurrentFigure == -1) {
                return false;
            }
        }

        return true;
    }

    var checkIfFigureCanBeRotated = function () {
        var nextVariant;
        /* Getting next variant */
        if (variantIndex < currentFigureAllVariants.length - 1) {
            nextVariant = currentFigureAllVariants[variantIndex + 1];
        }
        else if (variantIndex == currentFigureAllVariants.length - 1) {
            nextVariant = currentFigureAllVariants[0];
        }

        /* Check if next variant goes out of the game field or comes over already taken cells */
        figure.gameFieldFigureAppearance(0); // temporary clearing the figure on the field
        for (var col = 1; col < nextVariant.length; col += 2) {
            if (nextVariant[col] < FIELD_BORDER_LEFT || FIELD_BORDER_RIGHT < nextVariant[col]) {
                figure.gameFieldFigureAppearance(1);
                return false;
            }

            var nextvariantRow = nextVariant[col - 1];
            var nextVariantCol = nextVariant[col];

            if (gameField[nextvariantRow] == undefined) {
                figure.gameFieldFigureAppearance(1);
                return false;
            }
            else if (gameField[nextvariantRow][nextVariantCol] == 1) {
                figure.gameFieldFigureAppearance(1);
                return false;
            }
        }

        figure.gameFieldFigureAppearance(1);
        return true;
    }

    this.gameFieldFigureAppearance = function (clearParameter) {
        for (var i = 0; i < figure.currentVariant.length; i += 2) {
            var row = figure.currentVariant[i];
            var col = figure.currentVariant[i + 1];
            gameField[row][col] = clearParameter;

            var cell = document.getElementById("field").getElementsByTagName("tr")[row].getElementsByTagName("td")[col];
            if (clearParameter == 0) {
                cell.style.backgroundColor = "transparent";
            }
            else {
                cell.style.backgroundColor = "white";
            }
        }
    };

    var getCurrentFigureCoordinates = function () {
        currentFigureCoordinates = [4];
        for (var i = 0, j = 0; i < figure.currentVariant.length; i += 2, j++) {
            currentFigureCoordinates[j] = figure.currentVariant[i].toString() + figure.currentVariant[i + 1];
        }

        return currentFigureCoordinates;
    };

    var checkForFullRow = function () {
        /* first, we find the first row of the current figure, after it stops. This will be the first row to check if full, then we check forward (the next 3 rows, because the longest figure takes 4 fows) */
        var firstFigureRow = figure.currentVariant[0]; // The first digit of all variants represents the first row of the current figure.
        var lastRowToCheck = firstFigureRow + 3;

        /* Check which rows to remove */
        var FULL_ROW_TEMPLATE = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];
        var rowsToDelete = [];

        for (var i = firstFigureRow; i <= lastRowToCheck; i++) { // check 4 rows
            if (gameField[i].toString() == FULL_ROW_TEMPLATE) {
                rowsToDelete.push(i);
            }
            if (i == gameField.length - 1) {
                break;
            }
        }

        /* Deleting full rows */
        if (rowsToDelete.length != 0) {
            for (var i = 0; i < rowsToDelete.length; i++) {
                gameField.splice(rowsToDelete[i], 1);
                gameField.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                updateGameFieldVisual();
                rowsCleared++;
                updateClearedRows();
                newLevelCheck();
            }
        }
    };
}

function getRandomNumber(max) {
    var index = Math.floor(Math.random() * max + 0);
    return index;
}

function updateGameFieldVisual() {
    for (var row = 0; row < gameField.length; row++) {
        for (var col = 0; col < gameField[0].length; col++) {
            var cells = document.getElementById("field").getElementsByTagName("tr")[row].getElementsByTagName("td")[col];

            if (gameField[row][col] == 1) {
                cells.style.backgroundColor = "white";
            }
            else if (gameField[row][col] == 0) {
                cells.style.backgroundColor = "transparent";
            }
        }
    }

}

function clearGameField() {
    var cells = document.getElementById("field").getElementsByTagName("td");
    var currentCell = 0;
    for (var row = 0; row < gameField.length; row++) {
        for (var col = 0; col < gameField[0].length; col++) {
            gameField[row][col] = 0;
            cells[currentCell].style.backgroundColor = "transparent";
            currentCell++;
        }
    }
}

function updateClearedRows() {
    document.getElementById("rowsCleared").innerHTML = rowsCleared;
}

function newLevelCheck() {
    if (rowsCleared % 10 == 0) {
        changeLevel();
    }
}

function changeLevel() {
    level++;
    gameSpeed -= 150;
    document.getElementById("currentLevel").innerHTML = level;
}