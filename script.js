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
    "equals-button":    {emits:"=",  type:"equals"   },
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
            drawNumberOutput(button.emits);
            break;

        case "operator":
            drawOperatorOutput(button.emits);
            break;

        case "backspace":
            drawBackspaceOutput();
            break;

        case "clear":
            clearScreens();
            break;

        case "equals":
            drawEqualsOutput(button.emits);
            break;
    };
}


function drawNumberOutput(number) {
    if (operation.result) {
        clearScreens();
    }
    lowerScreen.textContent += number;
}


function drawOperatorOutput(operator) {
    if (operation.operator && !readLowerScreen()) {
        updateOperation({
            "operator": operator,
        });
    } else if (operation.operator && readLowerScreen()) {
        updateOperation({
            secondNum: readLowerScreen(),
        })
        computeResult();
        updateOperation({
            firstNum: operation.result,
            secondNum: null,
            "operator": operator,
            result: null,
        });
    } else {
        updateOperation({
            firstNum: readLowerScreen(),
            "operator": operator,
        });
    };
    updateScreens();
    lowerScreen.textContent = "";
}


function drawBackspaceOutput() {
    lowerScreen.textContent = lowerScreen.textContent.slice(0, -1);
}


function drawEqualsOutput() {
    if (
        operation.firstNum &&
        operation.operator &&
        !operation.secondNum &&
        !operation.result
    ) {
        updateOperation({
            secondNum: readLowerScreen(),
        });
        computeResult();
    };
    updateScreens();
}


function clearScreens() {
    resetOperation();
    upperScreen.textContent = "";
    lowerScreen.textContent = "";
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
        readLowerScreen(),
    );
}


const upperScreen = document.querySelector("#upper-display");
const lowerScreen = document.querySelector("#lower-display");
let operation;
resetOperation();
