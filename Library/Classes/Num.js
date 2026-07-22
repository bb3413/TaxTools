
import { Eval }		from "../Classes/Eval.js";
import { Str }		from "../Classes/Str.js";

export class Num {
	// Aliases for Math library functions.
	static abs		(...rest) {return Math.abs(...rest)}
	static max		(...rest) {return Math.max(...rest)}
	static min		(...rest) {return Math.min(...rest)}
	static round	(...rest) {return Math.round(...rest)}

	static format(num) {
		// Convert a number to a comma separated string, foormatted for output.
		return num.toLocaleString();
	}

	static isNum(num) {
		// Returns true if num is a valid number; otherwise, false.
		const n = Number(num);
		return !Number.isNaN(n);
	}

	static limit(value, minval = null, maxval = null) {
		if (Num.isNum(minval))
			value = Math.max(value, minval);

		if (Num.isNum(maxval))
			value = Math.min(value, maxval);

		return value;
	}

	static toInteger(str) {
		// Convert the string to a number. If the string contains commas, dollar
		// signs, or whitespace they will be removed. The string is then evaluated
		// as a mathematical expression. The string will then be converted to a
		// number or zero if it is not a number. Then, it will be rounded to the
		// nearest whole number.

		const clean_str = str.replace(/[$,\s]/g, "");
		if (Str.empty(clean_str))
			return 0;

		let num = Eval.expression(clean_str);
		if (Number.isNaN(num))
			num = 0;

		return Math.round(num);
	}
}
