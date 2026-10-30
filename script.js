const keys = document.getElementById("keys");
const history = document.getElementById("history");
const display = document.getElementById("display");
// REMEMBER THE CALCULATOR'S CURRENT STATE
let current = "0";
// previous stores the FIRST number when the user chooses an operator.
let previous = null;
// operator stores "+", "-", "*", or "/".
let operator = null;
// This is true after an operator or "=" is pressed.
// It tells us to REPLACE the display with the next digit, rather than append it.
let startNewNumber = false;

function updateDisplay() {
	display.textContent = current;
}

//when you enter the digit, we save it into the current variable, and then show it on the screen too.
function inputDigit(digit) {
	if (current === "Error") clearAll();
	if (startNewNumber) {
		current = digit;
		startNewNumber = false;
		if (operator === null) history.textContent = "";
	} else if (current === "0") {
		current = digit;
	} else if (current === "-0") {
		current = "-" + digit;
	} else if (current.length < 20) {
		// Limit the length to keep the number readable on the screen.
		current += digit;
	}
	updateDisplay();
}

function symbol(value) {
	// JavaScript uses * and / for multiplication and division,
	// but × and ÷ are easier for people to read on the display.
	if (value === "*") return "×";
	if (value === "/") return "÷";
	if (value === "-") return "−";
	if (value === "+") return "+";
	return "NOT SUPPORTED";
}

keys.addEventListener("click", function (event) {
	const button = event.target.closest("button");
	//if you click outside the button do nothing
	if (!button) {
		return;
	}
	if (button.dataset.digit !== undefined) {
		inputDigit(button.dataset.digit);
	} else if (button.dataset.operator !== undefined) {
		selectOperator(button.dataset.operator);
	} else {
		runAction(button.dataset.action);
	}
});

function runAction(action) {
	// HTML buttons use data-action values like "clear" or "equals".
	// This function translates those strings into function calls.
	if (action === "clear") clearAll();
	if (action === "decimal") inputDecimal();
	if (action === "equals") calculate();
	if (action === "backspace") backspace();
	if (action === "sign") changeTheSign();
	if (action === "percent") percent();
}

function clearAll() {
	current = "0";
	previous = null;
	operator = null;
	startNewNumber = false;
	history.textContent = "";
	updateDisplay();
}

function inputDecimal() {
	if (current === "Error") {
		clearAll();
	}
	if (startNewNumber) {
		current = "0.";
		startNewNumber = false;
		if (operator === null) history.textContent = "";
	} else if (!current.includes(".")) {
		// Only add a decimal point if one does not already exist.
		current += ".";
	}
	updateDisplay();
}

function calculate() {
	//to calculate we need all the variables to have values
	if (operator === null || previous === null || startNewNumber) return;

	// let result = eval(`${previous}${operator}${current}`); not good to use eval
	//  turn string into a number for actual arithmetic.
	const second = Number(current);
	const expression = previous + " " + symbol(operator) + " " + current + " =";
	// We declare result here so every operator can assign to it.
	let result;
	switch (operator) {
		case "+":
			result = previous + second;
			break;
		case "-":
			result = previous - second;
			break;
		case "/":
			result = previous / second;
			break;
		case "*":
			result = previous * second;
			break;
		default:
			console.log("Error: Unsupported operator");
	}

	// Division by zero produces Infinity (or NaN for 0 / 0).
	// Number.isFinite() checks that the answer is a normal, finite number.
	// toPrecision(12) also removes most visible floating-point artifacts,
	// such as 0.30000000000000004 instead of 0.3.
	// Convert back to a string because the display and digit input use text.
	if (Number.isFinite(result)) {
		current = String(Number(result.toPrecision(12)));
	} else {
		current = "Error";
	}
	history.textContent = expression;
	previous = null;
	operator = null;
	startNewNumber = true;
	updateDisplay();
}

function backspace() {
	if (current === "Error") {
		clearAll();
		return;
	}
	// If we are waiting for the next number, there is nothing new to delete.
	if (startNewNumber) return;
	// slice(0, -1) returns the text without its last character.
	// If deleting would leave nothing (or just '-'), show 0 instead.
	if (current.length <= 1 || (current.length === 2 && current[0] === "-")) {
		current = "0";
	} else {
		current = current.slice(0, -1);
	}
	updateDisplay();
}

function changeTheSign() {
	if (current === "Error") return;
	if (current[0] === "-") {
		current = current.slice(1);
	} else {
		current = "-" + current;
	}
	updateDisplay();
}

function percent() {
	if (current === "Error") return;
	// Basic calculator percentage: divide the displayed number by 100.
	// Example: 25 becomes 0.25.
	const result = Number(current) / 100;
	current = String(Number(result.toPrecision(12)));
	updateDisplay();
}

// HANDLE +, -, ×, ÷ BUTTONS
function selectOperator(nextOperator) {
	if (current === "Error") return;
	if (operator !== null && !startNewNumber) {
		calculate();
		if (current === "Error") return;
	}
	previous = Number(current);
	operator = nextOperator;
	startNewNumber = true;
	history.textContent = current + " " + symbol(operator);
}
