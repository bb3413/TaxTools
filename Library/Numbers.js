
import { strEmpty }				from "./Strings.js";
import { evalExpression }		from "./EvalExpression.js";

// Aliases for Math library functions.
function abs		(...rest) {return Math.abs(...rest)}
function min		(...rest) {return Math.min(...rest)}
function max		(...rest) {return Math.max(...rest)}
function round		(...rest) {return Math.round(...rest)}

function formatNum(num) {
	// Convert a number to a comma separated string, foormatted for output.
	return num.toLocaleString();
}

function isNum(num) {
	// Returns true if num is a valid number; otherwise, false.
	const n = Number(num);
	return !Number.isNaN(n);
}

function limit(value, minval = null, maxval = null) {
	if (isNum(minval))
		value = Math.max(value, minval);

	if (isNum(maxval))
		value = Math.min(value, maxval);

	return value;
}

function toInteger(str) {
	// Convert the string to a number. If the string contains commas, dollar
	// signs, or whitespace they will be removed. The string is then evaluated
	// as a mathematical expression. The string will then be converted to a
	// number or zero if it is not a number. Then, it will be rounded to the
	// nearest whole number.

	const clean_str = str.replace(/[$,\s]/g, "");
	if (strEmpty(clean_str))
		return 0;

	let num = evalExpression(clean_str);
	if (Number.isNaN(num))
		num = 0;

	return Math.round(num);
}

export {
	abs,
	formatNum,
	isNum,
	limit,
	min,
	max,
	round,
	toInteger,
};
