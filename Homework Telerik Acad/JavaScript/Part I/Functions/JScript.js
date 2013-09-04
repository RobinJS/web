
// 1. Write a function that returns the last digit of given integer as an English word. Examples: 512 -> "two", 1024 -> "four", 12309 -> "nine"
function ReturnWord() {
    var number = document.getElementById("userInput").value.toString();
    var digit = number.substring(number.length - 1, number.length);
    var lastDigit;

    switch (digit) {
        case "0": lastDigit = "zero"; break;
        case "1": lastDigit = "one"; break;
        case "2": lastDigit = "two"; break;
        case "3": lastDigit = "three"; break;
        case "4": lastDigit = "four"; break;
        case "5": lastDigit = "five"; break;
        case "6": lastDigit = "six"; break;
        case "7": lastDigit = "seven"; break;
        case "8": lastDigit = "eight"; break;
        case "9": lastDigit = "nine"; break;
        default: lastDigit = "<span style='color:red'>invalid number</span>"; break;
    }
    document.getElementById("resultDiv").innerHTML = "Task 1 result: ";
    document.getElementById("result").innerHTML = (lastDigit);
}

// 2. Write a function that reverses the digits of given decimal number. Example: 256 -> 652
function ReverseDigits() {

    document.getElementById("resultDiv").innerHTML = "Task 2 result: "; // printing in result field
    var digits = document.getElementById("userInput");  // getting user input

    if (!isNaN(digits.value)) {     // check if user iput is a number 

        digits = digits.value.toString();
        var array = new Array(digits.length);

        for (var i = 0; i < digits.length; i++) {
            array[i] = digits[i];
        }
        array.reverse();    //reverse the digits
        document.getElementById("result").innerHTML = (array.join("").toString());  // printing result
    }
    else {
        document.getElementById("result").innerHTML = ("<span style='color: red;'>invalid number</span>");
    }
}

// 3. Write a function that finds all the occurrences of word in a text. The search can case sensitive or case insensitive. Use function overloading
var isCaseSensitive = false;

function setCaseSensitive() {
    if (isCaseSensitive == false) {
        isCaseSensitive = true;
    }
    else if (isCaseSensitive == true) {
        isCaseSensitive = false;
    }
}

function FindOccurences() {

    document.getElementById("resultDiv").innerHTML = "Task 3 result: "; // printing in result field

    var userText = document.getElementById("userInput");
    var wordToCheck = document.getElementById("word");

    var textArray = new Array(); // put user text into array
    textArray = userText.value.split(' ');

    if (isCaseSensitive == true) {
        searchCaseSensitive();
    }
    if (isCaseSensitive == false) {
        searchCaseInSensitive();
    }

    var count = 0;

    function searchCaseSensitive() {
        count = 0;
        for (var i = 0; i < textArray.length; i++) {
            if (textArray[i] === wordToCheck.value) {
                count++;
            }
        }
        document.getElementById("result").innerHTML = count;  // printing result
    }

    function searchCaseInSensitive() {
        count = 0;
        for (var i = 0; i < textArray.length; i++) {
            if (textArray[i].toLowerCase() == wordToCheck.value.toLowerCase()) {
                count++;
            }
        }
        document.getElementById("result").innerHTML = count;  // printing result
    }
}

// 4. Write a function to count the number of divs on the web page
var str;
function DivCounter() {
    document.getElementById("resultDiv").innerHTML = "Task 4 result: "; // printing in result field
    var divs = document.getElementsByTagName('div').length;
    document.getElementById("result").innerHTML = divs;
}


// 5. Write a function that counts how many times given number appears in given array. Write a test function to check if the function is working correctly.

function DigitCounter() {
    var digitToCheck = document.getElementById("digit");

    if (!isNaN(digitToCheck.value)) {
        document.getElementById("resultDiv").innerHTML = "Task 5 result: "; // printing in result field

        var userNumbers = document.getElementById("userInput");


        var numArray = new Array(); // put user text into array
        numArray = userNumbers.value.split(',');

        var digitsCounter = 0;

        for (var index = 0; index < numArray.length; index++) {

            if (numArray[index] == digitToCheck.value) {
                digitsCounter++;
            }
        }
        document.getElementById("result").innerHTML = digitsCounter;
    }
    else {
        document.getElementById("result").innerHTML = ("<span style='color: red;'>invalid number</span>");
    }
}

// Test
function Test() {
    document.getElementById("resultDiv").innerHTML = "Task 5 test result: ";
    var testArray = [6, 2, 90, 6, 4, 3, 6, 12];
    var testDigit = 6;
    var testCounter = 0;
	var expectedResult = 3;

    for (var index = 0; index < testArray.length; index++) {

        if (testArray[index] == testDigit) {
            testCounter++;
        }
    }
	if	(testCounter == expectedResult) {
		document.getElementById("result").innerHTML = "Test successfull!";
	}
	else {
		document.getElementById("result").innerHTML = ("<span style='color: red;'>Test failed!</span>");
	}
    
}

// 6. Write a function that checks if the element at given position in given array of integers is bigger than its two neighbors (when such exist).

function IsItBigger(elementPosition) {

    var userArray = document.getElementById("userInput");
    var numArray = new Array(); // put user text into array
    numArray = userArray.value.split(',');

    switch (arguments.length) {
        case 0: FirstBigger(numArray); break;   // you can find this function's code below
        case 1: BiggestNeighbour(); break;
        default: alert("wrong function call"); break;
    }

    function BiggestNeighbour() {
        document.getElementById("resultDiv").innerHTML = "Task 6 result: "; // printing in result field
        var elementPosition = parseInt(document.getElementById("elementPosition").value);

        if (!isNaN(elementPosition)) {  // if elementPosition IS number
            var userArray = document.getElementById("userInput");

            var numArray = new Array(); // put user text into array
            numArray = userArray.value.split(',');

            if (elementPosition > numArray.length - 1 || elementPosition < 0) { // if index out of range
                document.getElementById("result").innerHTML = ("<span style='color: red;'>invalid position</span>");
            }
            else {
                if (elementPosition == 0 || elementPosition == numArray.length - 1) { // if the first or the last index is chosen

                    document.getElementById("result").innerHTML = "<span style='color: red;'>only one neighbour</span>";
                }
                else { // if any other position
                    if (parseInt(numArray[elementPosition]) > parseInt(numArray[elementPosition - 1]) && parseInt(numArray[elementPosition]) > parseInt(numArray[elementPosition + 1])) {
                        document.getElementById("result").innerHTML = "true";   // if bigger
                    }
                    else {
                        document.getElementById("result").innerHTML = ("<span style='color: red;'>false</span>");   // if not bigger
                    }
                }
            } //end of first else
        }
        else {
            document.getElementById("result").innerHTML = ("<span style='color: red;'>invalid position</span>");
        }
    } // end of BiggestNeighbour()

} // IsItBigger()


// 7. Write a Function that returns the index of the first element in array that is bigger than its neighbors, or -1, if there’s no such element. Use the function from the previous exercise.
function FirstBigger(numArray) {
    document.getElementById("resultDiv").innerHTML = "Task 7 result: "; // printing in result field

    var firstBiggerIndex;
    var firstBigger;
    var isBigger = false;

    for (var i = 1; i < numArray.length - 1; i++) {
        if (parseInt(numArray[i]) > parseInt(numArray[i - 1]) && parseInt(numArray[i]) > parseInt(numArray[i + 1])) {
            firstBiggerIndex = i;
            var firstBigger = numArray[i];
            isBigger = true;
            break;
        }
    }
    if (isBigger) {
        document.getElementById("result").innerHTML = "Index = " + firstBiggerIndex + " Which is number: " + firstBigger;
    }
    else {
        document.getElementById("result").innerHTML = ("<span style='color: red;'>-1</span>");
    }

}
