window.onload = function () {
    $("#startNewGame").on("click", startNewGame);
    $("#stopGame").on("click", stopGame);
};

var game = "off";
var gameSpeed = 1000;
var moveable;
var _fieldBorderLeft = 0;
var _fieldBorderRight = 9;
var _fieldBorderBottom = 19;
var variantIndex = 0;
var figure;
var nextFigure;
var rowsCleared = 0;

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
var getFigureVariants = function (type) {
    var variantsToReturn;
    switch (type) {
        case "I":
            variantsToReturn = [[0, 3, 0, 4, 0, 5, 0, 6], [0, 4, 1, 4, 2, 4, 3, 4]];
            break;
        case "J":
            variantsToReturn = [[2, 3, 0, 4, 1, 4, 2, 4], [0, 3, 1, 3, 1, 4, 1, 5], [0, 4, 1, 4, 2, 4, 0, 5], [0, 3, 0, 4, 0, 5, 1, 5]];
            break;
        case "L":
            variantsToReturn = [[0, 4, 1, 4, 2, 4, 2, 5], [0, 3, 1, 3, 0, 4, 0, 5], [0, 3, 1, 4, 2, 4, 0, 4], [1, 3, 1, 4, 0, 5, 1, 5]];
            break;
        case "O":
            variantsToReturn = [[0, 4, 1, 4, 0, 5, 1, 5], [0, 4, 1, 4, 0, 5, 1, 5]];
            break;
        case "S":
            variantsToReturn = [[1, 3, 0, 4, 1, 4, 0, 5], [0, 3, 1, 3, 2, 4, 1, 4]];
            break;
        case "T":
            variantsToReturn = [[0, 3, 1, 4, 0, 4, 0, 5], [1, 3, 0, 4, 2, 4, 1, 4], [1, 3, 0, 4, 1, 4, 1, 5], [0, 4, 1, 4, 2, 4, 1, 5]];
            break;
        case "Z":
            variantsToReturn = [[0, 3, 1, 4, 0, 4, 1, 5], [1, 4, 2, 4, 0, 5, 1, 5]];
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
    if (game == "on") {
        moveable = clearInterval(moveable);
    }

    $("#gameOver").css("display", "none");
    clearGameField();
    $("#rowsCleared").html(0);
    game = "on";
    document.body.addEventListener("keydown", listener, false);
    createNextFigure();
    createFigure();
}

function stopGame() {
    moveable = clearInterval(moveable);
    document.body.removeEventListener("keydown", listener, false);
    clearGameField();
    $("#rowsCleared").html(0);
    game = "off";
}

function gameOver() {
    $("#gameOver span:nth-of-type(2)").html(rowsCleared);
    $("#gameOver").css("display", "block");
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
    /* Clear the "#pannel"'s grid before showing next figure */
    var cell = $("#nextFigure table td");
    cell.css("backgroundColor", "transparent");

    // Move initial column coordinates to left so it will be easyer to place next figure in the "#pannel"'s grid
    var figureToShow = (nextFigure.currentVariant).slice(0, nextFigure.currentVariant.length);
    for (var column = 1; column < figureToShow.length; column += 2) {
        figureToShow[column] -= 3;
    }

    // Make next figure appear
    for (var i = 0; i < figureToShow.length; i += 2) {
        var row = figureToShow[i];
        var col = figureToShow[i + 1];
        var cell = $("#nextFigure table tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")");
        cell.css("backgroundColor", "#92d5ef");
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
            figure.currentVariant = currentFigureAllVariants[variantIndex];
            figure.gameFieldFigureAppearance(1);
            drawField();
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

            figure.currentVariant = currentFigureAllVariants[variantIndex];
            figure.gameFieldFigureAppearance(1);
            drawField();
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

            figure.currentVariant = currentFigureAllVariants[variantIndex];
            figure.gameFieldFigureAppearance(1);
            drawField();
        }
    };

    this.rotate = function () {
        if (checkIfFigureCanBeRotated()) {
            if (variantIndex < currentFigureAllVariants.length - 1) {
                figure.gameFieldFigureAppearance(0);
                variantIndex++;
                figure.currentVariant = currentFigureAllVariants[variantIndex];
                figure.gameFieldFigureAppearance(1);
                drawField();
            }
            else if (variantIndex == currentFigureAllVariants.length - 1) {
                figure.gameFieldFigureAppearance(0);
                variantIndex = 0;
                figure.currentVariant = currentFigureAllVariants[variantIndex];
                figure.gameFieldFigureAppearance(1);
                drawField();
            }
        }
    };

    var checkIfFigureCanMoveDown = function () {
        for (var i = 0; i < figure.currentVariant.length; i += 2) {
            currentCellRow = figure.currentVariant[i];
            currentCellCol = figure.currentVariant[i + 1];

            if (currentCellRow == _fieldBorderBottom) {
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

            if (currentCellCol == _fieldBorderLeft) {
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

            if (currentCellCol == _fieldBorderRight) {
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
        if (variantIndex < currentFigureAllVariants.length - 1) {
            nextVariant = currentFigureAllVariants[variantIndex + 1];
        }
        else if (variantIndex == currentFigureAllVariants.length - 1) {
            nextVariant = currentFigureAllVariants[0];
        }

        /* Check if next variant goes out of the game field or comes over already taken cells */
        figure.gameFieldFigureAppearance(0); // temporary clearning the figure on the field
        for (var col = 1; col < nextVariant.length; col += 2) {
            if (nextVariant[col] < _fieldBorderLeft || _fieldBorderRight < nextVariant[col]) {
                figure.gameFieldFigureAppearance(1);
                return false;
            }

            var nextvariantRow = nextVariant[col - 1];
            var nextVariantCol = nextVariant[col];

            if (gameField[nextvariantRow][nextVariantCol] == 1) {
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

            var cell = $("#field table tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")");
            if (clearParameter == 0) {
                cell.css("backgroundColor", "transparent");
            }
            else {
                cell.css("backgroundColor", "white");
            }
        }
    };   //............

    var getCurrentFigureCoordinates = function () {
        currentFigureCoordinates = [4];
        for (var i = 0, j = 0; i < figure.currentVariant.length; i += 2, j++) {
            currentFigureCoordinates[j] = figure.currentVariant[i].toString() + figure.currentVariant[i + 1];
        }

        return currentFigureCoordinates;
    };

    var checkForFullRow = function () {
        /* first, we find the first row of the current figure, after it stops. This will be the first row to check if full, then we check forward (the next 3 rows, because the longest figure takes 4 fows) */
        var firstFigureRow = figure.currentVariant[0];
        var lastRowToCheck = firstFigureRow + 3;

        /* Find at which gameField row the first figure row occures */
        for (var i = 2; i < figure.currentVariant.length; i += 2) {
            if (figure.currentVariant[i] < firstFigureRow) {
                firstFigureRow = figure.currentVariant[i];
            }
        }

        /* Check which rows to remove */
        var _fullRowTemplate = ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"];
        var rowsToDelete = [];

        for (var i = firstFigureRow; i <= lastRowToCheck; i++) { // check 4 rows
            if (gameField[i].toString() == _fullRowTemplate) {
                rowsToDelete.push(i);
            }
            if (i == gameField.length - 1) {
                break;
            }
        }

        /* Deleting full rows */
        var singleRowToDelete;
        for (var rowTodelete in rowsToDelete) {
            singleRowToDelete = gameField[rowsToDelete[rowTodelete]];
            gameField.splice(rowsToDelete[rowTodelete], 1); // what if we first put a new row
            gameField.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            drawField();
            rowsCleared++;
            updateClearedRows();
        }
    };
}

function getRandomNumber(max) {
    var index = Math.floor(Math.random() * max + 0);
    return index;
}

function drawField() {
    for (var row = 0; row < gameField.length; row++) {
        for (var col = 0; col < gameField[0].length; col++) {
            if (gameField[row][col] == 1) {
                var cell = $("#field table tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")");
                cell.css("backgroundColor", "white");
            }
            else if (gameField[row][col] == 0) {
                var cell = $("#field table tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")");
                cell.css("backgroundColor", "transparent");
            }
        }
    }
}

function clearGameField() {
    for (var row = 0; row < gameField.length; row++) {
        for (var col = 0; col < gameField[0].length; col++) {
            gameField[row][col] = 0;
            var cell = $("table tr:nth-child(" + (row + 1) + ") td:nth-child(" + (col + 1) + ")");
            cell.css("backgroundColor", "transparent");
        }
    }
}

function updateClearedRows() {
    $("#rowsCleared").html(rowsCleared);
}