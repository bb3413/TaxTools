
export class Line {
	constructor(label)
	{
		this._label					= label;
		this._value					= 0;
		this._min_value				= undefined;
		this._max_value				= undefined;
		this._user_supplied_value	= false;
	}

	override_value(new_value) {
		// This method is called when the value is supplied by the user; not calculated
		// by the program (see also set value()).
		this.value = new_value;		// Don't use _value so it invokes the setter function.
		this._user_supplied_value = true;
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
			if (this._min_value !== undefined) {
				new_value = max(this._min_value, new_value);
			}
			if (this._max_value !== undefined) {
				new_value = min(this._max_value, new_value);
			}
			this._value = new_value;
		}
	}
	
	set min_value(new_min) {
		this._min_value = new_min;
		this._value = min(this._min_value, this._value);	// Update value
	}

	set max_value(new_max) {
		this._max_value = new_max;
		this._value = max(this._max_value, this._value);	// Update value
	}

	toString() {
		return `${this._label}:	${this._value}`;
	}
}
