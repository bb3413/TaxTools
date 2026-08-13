
//
// This module manages tax forms that have been created as objects of the TaxForm class.
//
import { Debug }		from "../Classes/Debug.js";
import { TaxFormName }	from "../Classes/TaxFormName.js";

let instances	= {};	// This variable is indexed by form name. For each form, it
						// returns an array with all the instances of that form.

function addForm(formname, form) {
	if (!formname) {
		throw new Error("Forms addForm: Form name is not set.");
	}

	let formlist = instances[formname];
	if (!formlist) {
		// This is the first form of this type.
		instances[formname] = [];
		formlist = instances[formname];
	}

	if ((formlist.length > 0) && (form.isSingleton)) {
		throw new Error(`Forms addForm: Singleton form ${formname} already exists; cannot add.`)
		return;
	}

	formlist.push(form);
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

	static dataChanged() {
		// Called when input information has changed so the forms can be recalculated.
		for (const form of TaxFormObj.getAllForms()) {
			form.calculated = false;
		}
	}
	
	static formsToPrint() {
		const forms = [];

		for (const formname of TaxFormNames.printOrder()) {
			let formlist = instances[formname];
			if (formlist) {
				for (const form of formlist) {
					forms.push(form);
				}
			}
		}

		return forms;
	}

	static getAllForms(formname = "") {
		// Get all the form objects that have been created, or all the forms of a particular type.
		let all_forms	= [];
		let formnames	= [];

		if (formname) {
			formnames = [ formname ];
		} else {
			formnames = Object.keys(instances);
		}

		for (const formname of formnames) {
			let formlist = instances[formname];
			for (const form of formlist) {
				all_forms.push(form);
			}
		}
		return all_forms;
	}

	static getForm(formname, index = 0) {
		//
		// Get an instance of a form. If it has not been created, undefined will be returned.
		//
		let formlist = instances[formname];
		let instance = undefined;

		if (!formlist) {
			// Return undefined.
			// throw new Error(`TaxFormObj.getForm: Form ${formname} not found.`);
		} else {
			if (formlist.length === 0) {
				// Return undefined.
				// throw new Error(`TaxFormObj.getForm: No instances of form ${formname}.`);
			} else if ((formlist.length-1) < index) {
				throw new Error(`TaxFormObj.getForm: Index (${index}) is > last instance of form.`);
			} else {
				instance = formlist[index];
			}
		}

		return instance;
	}

	static getTextValue(formname, ...lineno) {
		// This method will get a text value from a tax form. If the form does not exist, it wll try to
		// create it. If it has not been calculated, it will be calculated. If the form has not been
		// implemented, "" will be returned. If there is more than one instance of the form, the lines
		// from all the instances are concatinated together.
		Debug.enter(`TaxFormObj.getTextValue(${formname}, ${lineno})`);
		let str = "";
		let formlist = instances[formname];
		if (!formlist && TaxFormName.createOnDemand(formname)) {
			// Try to create; not an error if it fails; it may be a form that is not implemented yet.
			TaxFormObj.createForm(formname);
			formlist = instances[formname];
		}

		if (formlist) {
			for (const form of formlist) {
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
			let formlist = instances[formname];
			// For each instance of a particilar form.
			for (let index = 0; index < formlist.length; index++) {
				let form = formlist[index];
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
		// This method will get a value from a tax form. If the form does not exist, it wlll try to
		// create it. If it has not been calculated, it will be calculated. If the form has not been
		// implemented, zero will be returned. If there is more than one instance of the form, the lines
		// from all the instances are added together.
		Debug.enter(`TaxFormObj.getValue(${formname}, ${lineno})`);
		let sum = 0;
		let formlist = instances[formname];
		if (!formlist && TaxFormName.createOnDemand(formname)) {
			// Try to create; not an error if it fails; it may be a form that is not implemented yet.
			TaxFormObj.createForm(formname);
			formlist = instances[formname];
		}

		if (formlist) {
			for (const form of formlist) {
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
		let formlist = getAllFotms();
		for (const form of formlist) {
			form.toConsole();
		}
	}
}
