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
	display.textContent = `${previous ?? ""}${operator ?? ""}${current ?? ""}`;
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

function clearAll() {
	current = "0";
	previous = null;
	operator = null;
	startNewNumber = false;
	history.textContent = "";
	updateDisplay();
}
//when you enter the operator, you save the current into the previous, save the operator too. And clear current digit?
function inputOperator(inputtedOperator) {
	if (operator === null && startNewNumber === false) {
		operator = inputtedOperator;
		previous = current;
		current = "";
		startNewNumber = true;
		updateDisplay();
	}
}

function calculate() {
	if (operator === null || previous === null || startNewNumber) return;
	// let result = eval(`${previous}${operator}${current}`); not good to use eval
	//  turn string into a number for actual arithmetic.
	const second = Number(current);
	let expression = `${previous} ${operator} ${current} =`;
	// We declare result here so every operator can assign to it.
	let result;

	if (operator === "+") {
		result = previous + current;
	}
	if (operator === "-") current = result;
	previous = null;
	operator = null;
	updateDisplay();
	current = "0";
}

keys.addEventListener("click", function (event) {
	const button = event.target.closest("button");
	//if you click outside the button do nothing
	if (!button) {
		return;
	}
	if (button.dataset.digit !== undefined) {
		inputDigit(button.dataset.digit);
	}
	if (button.dataset.operator !== undefined) {
		inputOperator(button.dataset.operator);
	}
	if (button.dataset.action !== undefined) {
		if (button.dataset.action === "equal") {
			calculate();
		} else if (button.dataset.action === "clear") {
			clearAll();
		}
	}
});

function symbol(value) {
	// JavaScript uses * and / for multiplication and division,
	// but × and ÷ are easier for people to read on the display.
	if (value === "*") return "×";
	if (value === "/") return "÷";
	if (value === "-") return "−";
	return "+";
}

// HANDLE +, -, ×, ÷ BUTTONS
function selectOperator(nextOperator) {
	if (current === "Error") return;
	// Allow calculations to be chained, such as 5 + 2 + 3.
	// When the second + is pressed, calculate 5 + 2 first.
	if (operator !== null && !startNewNumber) {
		calculate();
		if (current === "Error") return;
	}
	// Convert the displayed STRING into a NUMBER before doing arithmetic.
	// We save it because the next digits will replace current.
	previous = Number(current);
	// Remember which calculation the user wants to perform.
	operator = nextOperator;
	// The NEXT digit should start the second number.
	startNewNumber = true;
	// Example history: "8 +".
	history.textContent = current + " " + symbol(operator);
}
