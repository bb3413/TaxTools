
import { MAX_DOLLAR, MIN_DOLLAR }	from "../TaxTools/TaxTools.js";
import { Debug }					from "../Classes/Debug.js";
import { Num }						from "../Classes/Num.js";

export class Line {
	constructor(label)
	{
		this._label					= label;
		this._value					= 0;
		this._min_value				= MIN_DOLLAR;
		this._max_value				= MAX_DOLLAR;
		this._user_supplied_value	= false;
	}

	override_value(new_value) {
		// This method is called when the value is supplied by the user; not calculated
		// by the program (see also set value()).
		
		if (new_value === "") {
			// If the user did not enter a value or cleared it, use the default for the line,
			// which will allows the form's steps to calculate the value. If the user
			// explicitly entered 0, use it.
			this._user_supplied_value = false;
			return;
		}
		
		this.value = new_value;		// Don't use _value so it invokes the setter function.
		this._user_supplied_value = true;
	}

	get label() {
		return this._label;
	}

	get value() {
		return this._value;
	}

	set label(new_label) {
		this._label = new_label;
	}

	set value(new_value) {
		// This method is called when the value is calculated by the program, not suplied by
		// the user (see also override_value()).
		if (!this._user_supplied_value) {
			if (Num.isNum(this._min_value) && Num.isNum(new_value)) {
				if (new_value < this._min_value) {
					Debug.warn(`${this._label}: Value too small (${new_value}).`)
				}
				new_value = Math.max(this._min_value, new_value);
			}
			if (Num.isNum(this._max_value) && Num.isNum(new_value)) {
				if (new_value > this._max_value) {
					Debug.warn(`${this._label}: Value too large (${new_value}).`)
				}
				new_value = Math.min(this._max_value, new_value);
			}
			this._value = new_value;
		}
	}

	set min_value(new_min) {
		this._min_value = new_min;
		this._value = Math.min(this._min_value, this._value);	// Update value
	}

	set max_value(new_max) {
		this._max_value = new_max;
		this._value = Math.max(this._max_value, this._value);	// Update value
	}

	toString() {
		let str = `${this._label}:`;
		return str.padEnd(50, " ") + this._value;
	}
}
