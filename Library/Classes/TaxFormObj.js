
//
// This module manages tax forms that have been created as objects of the TaxForm class.
//
import { Debug }		from "../Classes/Debug.js";
import { TaxFormName }	from "../Classes/TaxFormName.js";

let instances = {};		// This variable is indexed by form name. For each form, it
						// returns an array with all the instances of that form.

function addForm(formname, form) {
	if (!formname) {
		throw new Error("TaxFormObj.addForm(): Form name is not set.");
	}

	let form_list = instances[formname];
	if (!form_list) {
		// This is the first form of this type.
		instances[formname] = [];
		form_list = instances[formname];
	}

	if ((form_list.length > 0) && TaxFormName.isSingleton(formname)) {
		throw new Error(`TaxFormObj.addForm(): Singleton form ${formname} already exists; cannot add.`)
		return;
	}

	form_list.push(form);
}

export class TaxFormObj {
	static reset() {
		instances		= {};
	}

	static createForm(formname) {
		const form_class = TaxFormName.getClass(formname);

		if (form_class) {
			const form = new form_class(formname);
			addForm(formname, form);
			return form;
		}

		return undefined;
	}

	static deleteAllForms() {
		// Called when input information has changed so the forms can be recalculated.
		instances = {};
	}

	static earnedIncome() {
		return TaxFormObj.getValue( "F1040",   "01z") +		// Wages
				TaxFormObj.getValue("F1040S1", "03" ) +		// Business income
				TaxFormObj.getValue("F1040S1", "06" ) +		// Farm income
				TaxFormObj.getValue("F1040S1", "08r") +		// Scholarship
				TaxFormObj.getValue("F1040S1", "08t") +		// Pension
				TaxFormObj.getValue("F1040S1", "08u") -		// Wages earned while incarcerated
				TaxFormObj.getValue("F1040S1", "015");		// Deductible part of self-employment tax
	}

	static formsInPrintOrder() {
		let forms = [];

		for (let formname of TaxFormName.printOrder()) {
			let more_forms = TaxFormObj.getAllForms(formname);
			for (let next_form of more_forms) {
				forms.push(next_form);
			}
		}

		return forms;
	}

	static getAllForms(formname = "") {
		// Get all the form objects that have been created, or all the forms of a
		// particular type.
		let all_forms	= [];
		let formnames	= [];

		if (formname) {
			formnames = [ formname ];
		} else {
			formnames = Object.keys(instances);
		}

		for (const formname of formnames) {
			let form_list = instances[formname];
			if (form_list) {
				for (const form of form_list) {
					all_forms.push(form);
				}
			}
		}
		return all_forms;
	}

	static getForm(formname) {
		//
		// Get an instance of a form. If it has not been created, undefined will be returned.
		//
		let instance;
		let form_list = instances[formname];
		if (form_list) {
			if (form_list.length > 1) {
				throw new Error(`TaxFormObj.getForm(): More than one instance of form ${formname}.`);
			} else {
				instance = form_list[0];
			}
		}

		return instance;
	}

	static getTextValue(formname, ...lineno) {
		// This method will get a text value from a tax form. If the form does not exist,
		// it will try to create it. If it has not been calculated, it will be calculated.
		// If the form has not been implemented, "" will be returned. If there is more than
		// one instance of the form, the lines from all the instances are concatinated
		// together.
		Debug.enter(`TaxFormObj.getTextValue(${formname}, ${lineno})`);
		let str = "";
		let form_list = instances[formname];
		if (!form_list && TaxFormName.createOnDemand(formname)) {
			// Try to create; not an error if it fails; it may be a form that is not
			// implemented yet.
			TaxFormObj.createForm(formname);
			form_list = instances[formname];
		}

		if (form_list) {
			for (const form of form_list) {
				if (!form.calculated) {
					form.calculate();
				}
				for (let ln of lineno) {
					if (form.lines[ln] !== undefined) {
						if (str) {
							str += " ";
						}
						str += form.lines[ln].value;
					}
				}
			}
		}
		Debug.exit(`TaxFormObj.getTextValue(${str})`);
		return str;
	}

	static getUserSuppliedValues() {
		// Return array of: formName, formIndex, lineNumber, value
		// This method is used to save the current state to a file. It only saves the user
		// supplied values; the rest are calculated and do no need to be saved,
		let user_values = [];

		// For each type of form.
		for (const formname of Object.keys(instances)) {
			let form_list = instances[formname];
			// For each instance of a particilar form.
			for (let index = 0; index < form_list.length; index++) {
				let form = form_list[index];
				// For each line on the form, see if the value was supplied by the user or
				// calculated by the form.
				for (const lineno of Object.keys(form.lines)) {
					if (form.lines[lineno].isUserSuppliedValue()) {
						let info = [ formname, index, lineno, form.lines[lineno].value ];
						user_values.push(info);
					}
				}
			}
		}

		return user_values;
	}

	static getValue(formname, ...lineno) {
		// This method will get a value from a tax form. If the form does not exist, it wlll
		// try to create it. If it has not been calculated, it will be calculated. If the
		// form has not been implemented, zero will be returned. If there is more than one
		// instance of the form, the lines from all the instances are added together.
		Debug.enter(`TaxFormObj.getValue(${formname}, ${lineno})`);
		let sum = 0;
		let form_list = instances[formname];
		if (!form_list && TaxFormName.createOnDemand(formname)) {
			// Try to create; not an error if it fails; it may be a form that is not
			// implemented yet.
			TaxFormObj.createForm(formname);
			form_list = instances[formname];
		}

		if (form_list) {
			for (const form of form_list) {
				if (!form.calculated) {
					form.calculate();
				}
				for (let ln of lineno) {
					if (form.lines[ln] !== undefined) {
						sum += form.lines[ln].value;
					}
				}
			}
		}
		Debug.exit(`TaxFormObj.getValue(${sum})`);
		return sum;
	}

	static toConsole() {
		let form_list = getAllFotms();
		for (const form of form_list) {
			form.toConsole();
		}
	}

	static unearnedIncome() {
		return Math.max(0,
				TaxFormObj.getValue("F1040",   "09" ) +		// Total income
				TaxFormObj.getValue("F1040S1", "24j") -		// Housing deduction from form 2555
				TaxFormObj.getValue("F1040",   "01z") -		// Wages
				TaxFormObj.getValue("F1040S1", "03" ) -		// Business income
				TaxFormObj.getValue("F1040S1", "06" ) -		// Farm income
				TaxFormObj.getValue("F1040S1", "08a") -		// Net operating loss
				TaxFormObj.getValue("F1040S1", "08d") -		// Foreign earned income exclusion from Form 2555
				TaxFormObj.getValue("F1040S1", "08u") -		// Wages earned while incarcerated
				TaxFormObj.getValue("F1040S1", "18" ) );	// Penalty on early withdrawal of savings
	}
}
