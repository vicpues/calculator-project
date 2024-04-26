function clickHandler(e) {
    // Handle clicks outside of a button
    let button = (e.target.tagName === "BUTTON")
        ? buttonMap[e.target.id]
        : null;
    if (button === null) {return;};
    
    // Choose which behaviour to activate
    switch (button.type) {
        case "number":
            numberInput(button.emits);
            break;

        case "operator":
            operatorInput(button.emits);
            break;

        case "backspace":
            backspaceInput();
            break;

        case "clear":
            clearScreens();
            break;

        case "equals":
            equalsInput();
            break;
        };
        
    updateScreens();
}
        
        
function numberInput(number) {
    if (operation.result !== null) {
        clearScreens();
    };
    
    if (number === ".") {
        if (!readLowerScreen()) {
            lowerScreen.textContent += "0.";
        } else if (!readLowerScreen().includes(".")) {
            lowerScreen.textContent += number;
        };
    } else {
        lowerScreen.textContent += number;
    };
}


function operatorInput(operator) {
    // Case: There is a result on screen
    if (operation.result !== null) {
        updateOperation({
            firstNum: operation.result,
            secondNum: null,
            result: null,
        });
    // Case: There is a firstNum, an operator and a typed number but no result
    } else if (operation.operator && parseLowerScreen() !== null) {
        if (operation.operator === "/" && parseLowerScreen() === 0) {
            zeroDivisionAlert();
        } else {
            updateOperation({
                secondNum: parseLowerScreen(),
            });
            computeResult();
            updateOperation({
                firstNum: operation.result,
                secondNum: null,
                result: null,
            });
        }
    // Case: There is only a number on the lower screen
    } else if (!operation.operator && parseLowerScreen() !== null) {
        updateOperation({
            firstNum: parseLowerScreen(),
        });
    };
    // Finally, update operator if there's a number ready or there's a first but no secondNum
    if (
        operation.firstNum !== null &&
        operation.secondNum === null ||
        parseLowerScreen() !== null)
    {
        updateOperation({
            operator: operator,
        });
    }

    clearLowerScreen();
}


function backspaceInput() {
    lowerScreen.textContent = lowerScreen.textContent.slice(0, -1);
}


function equalsInput() {
    if (operation.operator === "/" && parseLowerScreen() === 0) {
        zeroDivisionAlert();

    } else if (
        operation.firstNum !== null &&
        operation.operator &&
        parseLowerScreen() !== null &&
        operation.result === null
    ) {
        updateOperation({
            secondNum: parseLowerScreen(),
        });
        computeResult();

    } else if (operation.result !== null) {
        updateOperation({
            firstNum: operation.result,
        });
        computeResult();
    };
}

function zeroDivisionAlert() {
    alert("The universe self-destructs... :(");
}


function clearScreens() {
    resetOperation();
    upperScreen.textContent = "";
    clearLowerScreen();
}

function clearLowerScreen() {
    lowerScreen.textContent = "";
}

function readLowerScreen() {
    return lowerScreen.textContent;
}

function parseLowerScreen() {
    if (readLowerScreen() === "") {
        return null;
    }
    return Number(readLowerScreen());
}

function updateScreens() {
    let upperScreenString = "";
    let upperScreenFactors = [
        "firstNum",
        "operator",
        "secondNum",
    ];
    
    for (let factor of upperScreenFactors) {
        if (operation[factor] !== null) {
            upperScreenString += `${operation[factor]} `;
        };
    };

    if (operation.result !== null) {
        upperScreenString += "=";
        lowerScreen.textContent = operation.result;
    };

    upperScreen.textContent = upperScreenString;
}


function updateOperation(obj) {
    for (let factor in obj) {
        operation[factor] = obj[factor];
    };
}

function resetOperation() {
    operation = {
        firstNum: null,
        operator: null,
        secondNum: null,
        result: null,
    };
}

function computeResult() {
    operation.result = operate(
        operation.firstNum,
        operation.operator,
        operation.secondNum,
    );
}


function operate(firstNum, operator, secondNum) {
    switch (operator) {
        case "+":
            return add(firstNum, secondNum);
        case "-":
            return subtract(firstNum, secondNum);
        case "*":
            return multiply(firstNum, secondNum);
        case "/":
            return divide(firstNum, secondNum);   
        default:
            console.log("Error: either the operator or the numbers are not valid");
    };
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}


const buttonMap = {
    "one-button":       {emits:"1",  type:"number"   },
    "two-button":       {emits:"2",  type:"number"   },
    "three-button":     {emits:"3",  type:"number"   },
    "four-button":      {emits:"4",  type:"number"   },
    "five-button":      {emits:"5",  type:"number"   },
    "six-button":       {emits:"6",  type:"number"   },
    "seven-button":     {emits:"7",  type:"number"   },
    "eight-button":     {emits:"8",  type:"number"   },
    "nine-button":      {emits:"9",  type:"number"   },
    "zero-button":      {emits:"0",  type:"number"   },
    "dot-button":       {emits:".",  type:"number"   },
    "add-button":       {emits:"+",  type:"operator" },
    "subtract-button":  {emits:"-",  type:"operator" },
    "multiply-button":  {emits:"*",  type:"operator" },
    "divide-button":    {emits:"/",  type:"operator" },
    "backspace-button": {emits:null, type:"backspace"},
    "clear-button":     {emits:null, type:"clear"    },
    "equals-button":    {emits:null, type:"equals"   },
};

const buttonPad = document.querySelector("#button-pad");
buttonPad.addEventListener("click", (e) => clickHandler(e));

const upperScreen = document.querySelector("#upper-display");
const lowerScreen = document.querySelector("#lower-display");
let operation;
resetOperation();
