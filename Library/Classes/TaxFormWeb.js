
//
// This module manages the tax forms that are displayed on the web page.
//
import { TaxFormName }	from "../Classes/TaxFormName.js";
import { HTML }			from "../Classes/HTML.js";

// These arrays contain the container IDs, in order, for the tax forms that
// have been added to the web page.
let input_forms			= ["taxpayer-details"];		// Already entered in PHP file.
let output_forms		= [];

// The web pages need unique IDs to include in their element IDs to avoid name
// collisions when the same form is added more than once. This object is indexed
// by form name so each form has its own series of UIDs starting at 1.
let next_form_uid = {};

// The following element IDs identify the ontainers that will hold the tax forms.
const INPUT_LOCATION	= "input-forms-container";
const OUTPUT_LOCATION	= "output-forms-container";

export class TaxFormWeb {
	static addInputForm(taxform_id, taxform) {
		//
		// Determine where to insert the new form amoung the current forms.
		//
		let where;			// beforebegin, afterbegin, beforeend, afterend
		let element_id;

		if (input_forms.length === 0) {
			where		= "afterbegin";
			element_id	= INPUT_LOCATION;
			input_forms.push(taxform_id);
		} else {
			// Find the form to insert the new form after.
			const new_formname	= taxform_id.split('-')[0];
			let last_found		= -1;
			where				= "afterend";

			// Find the last form of the same type.
			for (let i = 0; i < input_forms.length; i++) {
				const old_formname = input_forms[i].split('-')[0];
				if (new_formname === old_formname) {
					last_found = i;
				}
			}

			if (last_found === -1) {
				// Add to the end of the current forms.
				element_id = input_forms[input_forms.length-1];
				input_forms.push(taxform_id);
			} else {
				// Insert the new form after the last form of the same type.
				element_id = input_forms[last_found];
				input_forms.splice(last_found, 0, taxform_id);
			}
		}

		// Insert the tax form.
		const element = document.getElementById(element_id);
		element.insertAdjacentHTML(where, taxform);

		// Open the form and scroll the window to it.
		HTML.openDetails(taxform_id)
		document.getElementById(taxform_id).scrollIntoView({behavior: 'smooth', block: 'start'});
	}

	static addOutputForm(taxform_id, taxform) {
		// Output forms are currently always added to the end of the current forms.
		output_forms.push(taxform_id);
		const element = document.getElementById(OUTPUT_LOCATION);
		element.insertAdjacentHTML("beforeend", taxform);
	}

	static getInputForms() {
		return input_forms;
	}

	static getUID(formname) {
		// Get a number that is unique to the type of the form.
		let form_uid = next_form_uid[formname];

		if (form_uid) {
			next_form_uid[formname]++;
		} else {
			form_uid = 1;
			next_form_uid[formname] = 2;
		}

		return form_uid;
	}

	static parseFormName(taxform_id) {
		const parts = taxform_id.split("-");
		return [ parts[0].toUpperCase(), parts[1].replace(/-/g, "") ];
	}

	static removeOutputForms() {
		while (output_forms.length > 0) {
			let taxform_id = output_forms.pop();
			let [ formname, uid ] = TaxFormWeb.parseFormName(taxform_id);
			next_form_uid[formname]--;
			document.getElementById(taxform_id).remove();
		}
	}
}
