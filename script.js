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


function clickHandler(e) {

    // Handle clicks outside of a button
    let button = (e.target.tagName === "BUTTON")
        ? buttonMap[e.target.id]
        : null;
    if (button === null) {return};

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
    if (operation.result) {
        clearScreens();
    }
    lowerScreen.textContent += number;
}


function operatorInput(operator) {
    // Case: There is a result on screen
    if (operation.result) {
        updateOperation({
            firstNum: operation.result,
            secondNum: null,
            result: null,
        });
    // Case: There is a firstNum, an operator and a typed number but no result
    } else if (operation.operator && readLowerScreen()) {
        updateOperation({
            secondNum: readLowerScreen(),
        })
        computeResult();
        updateOperation({
            firstNum: operation.result,
            secondNum: null,
            result: null,
        });
    // Case: There is only a number on the lower screen
    } else if (!operation.operator && readLowerScreen()) {
        updateOperation({
            firstNum: readLowerScreen(),
        });
    };
    // Finally, update operator if there's a number ready or there's a first but no secondNum
    if (operation.firstNum && !operation.secondNum || readLowerScreen()) {
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
    if (
        operation.firstNum &&
        operation.operator &&
        readLowerScreen() &&
        !operation.result
    ) {
        updateOperation({
            secondNum: readLowerScreen(),
        });
        computeResult();
    };
}


function clearScreens() {
    resetOperation();
    upperScreen.textContent = "";
    clearLowerScreen();
}


function clearLowerScreen() {
    lowerScreen.textContent = ""
}


function resetOperation() {
    operation = {
        firstNum: null,
        operator: null,
        secondNum: null,
        result: null,
    };
}


function readLowerScreen() {
    return Number(lowerScreen.textContent)
}


function updateScreens() {
    let upperScreenFactors = [
        "firstNum",
        "operator",
        "secondNum",
    ];
    let upperScreenString = "";
    for (let factor of upperScreenFactors) {
        if (operation[factor]) {
            upperScreenString += `${operation[factor]} `
        };
    };
    if (operation.result) {
        upperScreenString += "= ";
        lowerScreen.textContent = operation.result;
    };
    upperScreen.textContent = upperScreenString;
}


function updateOperation(obj) {
    for (let factor in obj) {
        operation[factor] = obj[factor];
    }
}


function computeResult() {
    operation.result = operate(
        operation.firstNum,
        operation.operator,
        operation.secondNum,
    );
}


const upperScreen = document.querySelector("#upper-display");
const lowerScreen = document.querySelector("#lower-display");
let operation;
resetOperation();
