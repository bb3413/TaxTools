
import { Forms } from "../Classes/Forms.js";

//
// This object contains the user data that was provided to enter in the tax return.
// The object is an array of the names of forms to create. For each form, there is
// an array of line-number/value pairs with the data to enter on the form. For
// example:
//
// 		[ "F1040", [ ["1a", 123], ["1b", 456], ... ] ]
//
export class TaxData {
	constructor () {
		this.forms = [];
	}

	addForm(formname) {
		let formdata = [formname, []];
		this.forms.push(formdata);

		return formdata;
	}

	addLine(formdata, lineno, value) {
		let linedata = [lineno, value];
		formdata[1].push(linedata);
	}

	static loadForms(forms) {
		// Load the tax forms from the taxpayer.

		// For each form.
		for (const formdata of forms) {
			let formname	= formdata[0];
			let lines		= formdata[1];

			let form = Forms.createForm(formname);
			if (!form) {
				throw new Error(`Forms.createForm failed to create form ${formname}`);
				return;
			}

			// For each line of data, put it on the form.
			for (const linedata of lines) {
				let lineno		= linedata[0];
				let value		= linedata[1];

				let line = form.lines[lineno];
				if (!line) {
					throw new Error(`Form ${formname}, Line[${lineno}] is not initialized.`);
				} else {
					line.override_value(value);
					// form.lines[lineno].override_value(value);
				}
			}
		}
	}
}
