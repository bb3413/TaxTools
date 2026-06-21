
import {
	F1040,
	F1040S1,
	F1040S1A,
	F1040S2,
	F1040S3,
	F1040SA,
	F1040SB,
	F1040SC,
	F1040SD,
	F1099DIV,
	F1099INT,
	F1099R,
	F2441,
	F8812,
	F8839,
	F8839,
	F8863,
	F8919,
	F8995,
	FSSA1099,
	W2,
	WS_EIC,
	WS_IncTax,
	WS_Penalty,
	WS_SETax,
	WS_SSTax,
};
		
export class Form {
	static forms = {};	// The forms object is indexed by form name. For each form, it returns
						// an array with all the instances of that form.

	// The form registry maps the name of a form to its class constructor.
	form_registry = {
		"F1040":		F1040,
		"F1040S1":		F1040S1,
		"F1040S1A":		F1040S1A,
		"F1040S2":		F1040S2,
		"F1040S3":		F1040S3,
		"F1040SA":		F1040SA,
		"F1040SB":		F1040SB,
		"F1040SC":		F1040SC,
		"F1040SD":		F1040SD,
		"F1099DIV":		F1099DIV,
		"F1099INT":		F1099INT,
		"F1099R":		F1099R,
		"F2441":		F2441,
		"F8812":		F8812,
		"F8839":		F8839,
		"F8839":		F8839,
		"F8863":		F8863,
		"F8919":		F8919,
		"F8995":		F8995,
		"FSSA1099":		FSSA1099,
		"W2":			W2,
		"WS_EIC":		WS_EIC,
		"WS_IncTax":	WS_IncTax,
		"WS_Penalty":	WS_Penalty,
		"WS_SETax":		WS_SETax,
		"WS_SSTax":		WS_SSTax,
	};

	static getForm(formname) {
		// If the form has already been created, return it; otherwise, create one.
		let formlist = forms[formname];
		let classname = form_registry[formname];
		let instance;
		
		if (formlist.length === 0) {
			if (typeof classname === "function") {
				instance = new classname();
			} else {
				alert(`getForm: ${formname} not defined.`);
			}
		} else if (formlist.length === 1) {
			instance = formlist[0];
		} else {
			alert(`getForm: found more than one ${formname}.`);
		}

		return instance;
	}

	static getFormValue(formname, lineno) {
		let sum = 0;

		let formlist = forms[formname];
		if (formlist.length > 0) {
			formlist.foreach(function(form) {
				sum += form.lines[lineno].value;
			});
		}

		return sum;
	}

	constructor(formname) {
		this.name	= formname;
		this.lines	= [];

		let formlist = forms[formname];
		formlist.push(this);
	}

	calculate() {
	}

	printForm() {
		console.log(`Form: ${this.name}`);
		this.lines.forEach(function(line, index) {
			console.log(`	lines[${index}]:	${line.label}	$line.value}`);
		});
		console.log("");
	}

	addLines(...indexlist) {
		let sum = 0;
		for (let i = 0; i < indexlist.length; i++) {
			let index = indexlist[i];
			sum += this.lines[index].value
		}
		return sum;
	}

	subLines(line1, line2) {
		// Subtract line1 from line2.
		return this.lines[line2].value - this.lines[line1].value;
	}

	getLine(line) {
		return this.lines[line].value;
	}
}
