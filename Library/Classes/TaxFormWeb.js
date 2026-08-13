
//
// This module manages the tax forms that are displayed on the web page.
//
import { TaxFormName }	from "../Classes/TaxFormName.js";
import { HTML }			from "../Classes/HTML.js";

// These arrays contains the names, in order, of the container element for the
// tax forms that have been added to the web page
let input_forms		= [];
let output_forms	= [];

function insertInputForm(name, tax_forms) {
	//
	// Determine which element to insert the tax form after.
	//
	let insert_after = undefined;

	if (tax_forms.length === 0) {
		insert_after = "insert-input-forms-here";
		tax_forms.push(name);
	} else if (tax_forms.length === 1) {
		insert_after = tax_forms[0];
		tax_forms.push(name);
	} else {
		// Find a place to insert the form.
		const new_formname = name.split('-')[0];
		let last_form = -1;

		// Find the last form of the same type.
		for (let i = 0; i < tax_forms.length; i++) {
			const old_formname = tax_forms[i].split('-')[0];
			if (new_formname === old_formname) {
				last_form = i;
			}
		}

		if (last_form === -1) {
			// Add to the end of the current forms.
			insert_after = tax_forms[tax_forms.length-1];
			tax_forms.push(name);
		} else {
			// Insert the new form after the last form of the same type.
			insert_after = tax_forms[last_form];
			tax_forms.splice(last_form, 0, name);
		}
	}

	return insert_after;
}

function insertOutputForm(name, tax_forms) {
	//
	// Determine which element to insert the tax form after.
	//
	let insert_after = undefined;

	if (tax_forms.length === 0) {
		insert_after = "insert-output-forms-here";
		tax_forms.push(name);
	} else {
		// Add to the end of the current forms.
		insert_after = tax_forms[tax_forms.length-1];
		tax_forms.push(name);
	}

	return insert_after;
}
	
function addForm(taxform_id, taxform, after_id) {
		// The taxform ID is ID value of the form container. It is used to determine
		// where to insert the taxform amongst the current tax forms. Taxform is a string
		// containing HTML code that will be added to the current web page.

		const where			= "afterend";	// beforebegin, afterbegin, beforeend, afterend
		const element		= document.getElementById(after_id);

		// Insert the tax form.
		element.insertAdjacentHTML(where, taxform);
		
		HTML.openDetails(taxform_id)
		// Scroll the window to the new tax form.
		document.getElementById(taxform_id).scrollIntoView({behavior: 'smooth', block: 'start'});
}

export class TaxFormWeb {
	static addInputForm(taxform_id, taxform) {
		const after_id = insertInputForm(taxform_id, input_forms);
		addForm(taxform_id, taxform, after_id);
	}

	static addOutputForm(taxform_id, taxform) {
		const after_id = insertOutputForm(taxform_id, output_forms);
		addForm(taxform_id, taxform, after_id);
	}

	static getInputForms() {
		return input_forms;
	}

	static parseFormName(name) {
		const parts = name.split("-");
		const classname = TaxFormName.getClass(parts[0]);
		if (parts.length === 2) {
			return [ classname, -1 ];
		} else {
			return [ classname, parts[1] ];
		}
	}

	static removeOutputForms(taxform_id, taxform) {
		while (output_forms.length > 0) {
			document.getElementById(output_forms.pop()).remove();
		}
	}
}
