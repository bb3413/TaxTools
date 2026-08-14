
//
// This module manages tax forms that have been created as objects of the TaxForm class.
//
import { Debug }		from "../Classes/Debug.js";
import { TaxFormName }	from "../Classes/TaxFormName.js";

let instances	= {};	// This variable is indexed by form name. For each form, it
						// returns an array with all the instances of that form.

function addForm(form_name, form) {
	if (!form_name) {
		throw new Error("TaxFormObj.addForm(): Form name is not set.");
	}

	let form_list = instances[form_name];
	if (!form_list) {
		// This is the first form of this type.
		instances[form_name] = [];
		form_list = instances[form_name];
	}

	if ((form_list.length > 0) && TaxFormName.isSingleton(form_name)) {
		throw new Error(`TaxFormObj.addForm(): Singleton form ${form_name} already exists; cannot add.`)
		return;
	}

	form_list.push(form);
}

export class TaxFormObj {
	static reset() {
		instances		= {};
	}

	static createForm(form_name) {
		const form_class = TaxFormName.getClass(form_name);

		if (form_class) {
			const form = new form_class(form_name);
			addForm(form_name, form);
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

		for (const form_name of TaxFormNames.printOrder()) {
			let form_list = instances[form_name];
			if (form_list) {
				for (const form of form_list) {
					forms.push(form);
				}
			}
		}

		return forms;
	}

	static getAllForms(form_name = "") {
		// Get all the form objects that have been created, or all the forms of a particular type.
		let all_forms	= [];
		let form_names	= [];

		if (form_name) {
			form_names = [ form_name ];
		} else {
			form_names = Object.keys(instances);
		}

		for (const form_name of form_names) {
			let form_list = instances[form_name];
			if (form_list) {
				for (const form of form_list) {
					all_forms.push(form);
				}
			}
		}
		return all_forms;
	}

	static getForm(form_name, index = 0) {
		//
		// Get an instance of a form. If it has not been created, undefined will be returned.
		//
		let form_list = instances[form_name];
		let instance = undefined;

		if (!form_list) {
			// Return undefined.
			// throw new Error(`TaxFormObj.getForm(): Form ${form_name} not found.`);
		} else {
			if (form_list.length === 0) {
				// Return undefined.
				// throw new Error(`TaxFormObj.getForm(): No instances of form ${form_name}.`);
			} else if ((form_list.length-1) < index) {
				throw new Error(`TaxFormObj.getForm(): Index (${index}) is > last instance of form.`);
			} else {
				instance = form_list[index];
			}
		}

		return instance;
	}

	static getTextValue(form_name, ...lineno) {
		// This method will get a text value from a tax form. If the form does not exist, it wll try to
		// create it. If it has not been calculated, it will be calculated. If the form has not been
		// implemented, "" will be returned. If there is more than one instance of the form, the lines
		// from all the instances are concatinated together.
		Debug.enter(`TaxFormObj.getTextValue(${form_name}, ${lineno})`);
		let str = "";
		let form_list = instances[form_name];
		if (!form_list && TaxFormName.createOnDemand(form_name)) {
			// Try to create; not an error if it fails; it may be a form that is not implemented yet.
			TaxFormObj.createForm(form_name);
			form_list = instances[form_name];
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
		for (const form_name of Object.keys(instances)) {
			let form_list = instances[form_name];
			// For each instance of a particilar form.
			for (let index = 0; index < form_list.length; index++) {
				let form = form_list[index];
				// For each line on the form, see if the value was supplied by the user or
				// calculated by the form.
				for (const lineno of Object.keys(form.lines)) {
					if (form.lines[lineno].isUserSuppliedValue()) {
						let info = [ form_name, index, lineno, form.lines[lineno].value ];
						user_values.push(info);
					}
				}
			}
		}

		return user_values;
	}

	static getValue(form_name, ...lineno) {
		// This method will get a value from a tax form. If the form does not exist, it wlll try to
		// create it. If it has not been calculated, it will be calculated. If the form has not been
		// implemented, zero will be returned. If there is more than one instance of the form, the lines
		// from all the instances are added together.
		Debug.enter(`TaxFormObj.getValue(${form_name}, ${lineno})`);
		let sum = 0;
		let form_list = instances[form_name];
		if (!form_list && TaxFormName.createOnDemand(form_name)) {
			// Try to create; not an error if it fails; it may be a form that is not implemented yet.
			TaxFormObj.createForm(form_name);
			form_list = instances[form_name];
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
}
