# JavaScript Calculator

A simple, responsive calculator built with HTML, CSS, and vanilla JavaScript. It supports basic arithmetic and displays the current calculation separately from the result.

## Features

- Addition, subtraction, multiplication, and division
- Decimal input, sign toggle, and percentage
- Backspace and clear controls
- Calculation history line and result display
- Responsive layout for smaller and larger screens
- Error display for results that are not finite, such as division by zero

## How to use

1. Enter a number using the digit buttons.
2. Select an operator, then enter the next number.
3. Press `=` to calculate.
4. Use `AC` to clear, `←` to backspace, `±` to change the sign, or `%` to divide the displayed number by 100.

The history line shows the expression (for example, `2 + 3 =`); the main display shows the result.

## Project structure

- `index.html` — calculator structure and controls
- `styles.css` — layout, colors, and responsive styling
- `script.js` — calculator state, input handling, and arithmetic
