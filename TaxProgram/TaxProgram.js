
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { File }			from "../Library/Classes/File.js";
import { Forms }		from "../Library/Classes/Forms.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { Str }			from "../Library/Classes/Str.js";
import { Taxpayer }		from "../Library/Classes/Taxpayer.js";
import { TaxData }		from "../Library/Classes/TaxData.js";
import { TaxTable }		from "../Library/Classes/TaxTable.js";

import { TAX_PROGRAM_SAVE_FILE } from "../Library/TaxTools/TaxTools.js";

function changeHandler(inputs) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole return (not just the field tha was changed).
	//
	try {
		// Reset static (global) variables to erase information from a previous calculation.
		HTML.putElementValue("ErrorMessageOutput", "");
		Debug.reset();
		Forms.reset();
		Taxpayer.reset();
		throw new Error(`Test error message.`);

		let tax_year = Dates.getTaxYear();
		if (inputs?.TaxYear !== undefined) {
			tax_year = inputs?.TaxYear;
		}

		const tax_table	= TaxTable.getTaxTable(tax_year);			// Initialize tax tables; ignore return value.
		const taxpayer	= createTaxpayer(inputs);					// Initialize taxpayer; ignore return value.
		TaxData.loadForms(inputs.Forms);							// Create tax forms with the taxpayer's data
		const f1040 = Forms.getForm("F1040");
		if (f1040) {
			f1040.calculate();
		}

		putOutputs(tax_year);
	} catch (err) {
		HTML.putElementValue("ErrorMessageOutput", err);
		document.getElementById("ErrorMessageOutput").scrollIntoView();
	}
}

function createTaxpayer(inputs) {
	const taxpayer = new Taxpayer();

	if (inputs.TaxYear !== undefined) {
		taxpayer.tax_year = inputs.TaxYear;
	}

	for (const key of Object.keys(inputs.Taxpayer)) {
		// Keys in the JSON file use camel case. Convert it to snake case, which is
		// used for variable names.
		let fieldname = Str.camelToSnakeCase(key);
		taxpayer[fieldname] = inputs.Taxpayer[key];
	}

	return taxpayer;
}

function getFieldsForInput(input) {
	// Gets the fields from the web page, process any debug keywords,
	// and convert to an integer. Put the values into the object passed
	// as a parameter.

	if (typeof form_class.listFields !== "function") {
		return [];
	}

	const fields = form_class.listFields()
	for (const line of fields) {
		const lineno		= line[0];
		const element_name	= line[1];
		const var_name		= Str.toSnake(label);
		if ([ "09", "15", "20" ].includes(lineno)) {
			let value = HTML.getUserInput(label, "text");
		} else {
			let value = HTML.getUserInput(line[1]);
		}
		input[var_name] = value;
	}
}

function getFieldsForSave(formname) {
	// This method gets the fields from the web page and create an array in the
	// format needed to save the value to a file.
	const title			= [ formname ];
	const form			= [];
	const form_class	= Forms.getClass(formname);

	if (typeof form_class.listFields !== "function") {
		return [];
	}

	const fields = form_class.listFields();
	for (const line of fields) {
		const lineno		= line[0];
		const element_name	= line[1];
		const value			= HTML.getElementValue(`${formname}-${element_name}`);
		if (value) {	// Don't save blank lines.
			form.push( [ lineno, value ] );
		}
	}

	if (form.length > 0) {
		return title.concat(form);
	} else {
		return [];
	}
}

function putFieldsFormRestore(form) {
	// This method puts the fields read from a saved file back onto the
	// web page.
	form.pop();		// Ignore the form name.

	for (const line of form) {
		let lineno			= line[0];
		let element_name	= line[1];
		HTML.putElementValue(element_name, value);
	}
}

function putOutputs(tax_year) {
	//
	//	Print Any Tax Forms that were created
	//
	let tax_forms = "";

	// Print the Taxpayer information
	// Print the 1040
	// Print the 1040S1
	// Print the 1040S1A
	// Print the 1040S2
	// Print the 1040S3
	// Print the Schedule A
	// Print the Schedule B
	// Print the Schedule C
	// Print the Schedule D
	// Print the Schedule E
	// Print the 540
	// Print the 540 CA

	// Close the input forms so they are in their colapsed state.
	HTML.closeAllDetails();

	HTML.putElementValue("TaxReturnOutput", tax_forms);
	HTML.showElement("TaxReturnContainer");
	document.getElementById("TaxReturnOutput").scrollIntoView({behavior: 'smooth', block: 'start'});
}

function restoreDataHandler(data) {
	//
	// This function is called when the user restores the input fields from a file.
	// The data that was copied from the file is passed a parameter.
	//
	let inputs;
/*
	// There are currently 2 formats in use; select which one this is.
	if (data.input_data) {
		inputs = data.input_data;
	} else {
		inputs = data;
	}

	// Restore the input fields
	HTML.putElementValue("TaxYear",							inputs.tax_year);

	// Taxpayer Information
	HTML.putElementValue("TaxpayersName",					inputs.taxpayers_name);
	HTML.putElementValue("FilingStatus",					inputs.filing_status);
*/
}

function restoreUserData(event) {
	//
	// The file selection dialog gets a list of files, but only one should be passed
	// in our case; select the first file and ignore the rest.
	//
	const filename = event.target.files[0];
	if (!filename) {
		throw new Error("No file selected.");
		return;
	}

	File.restoreFromFile(filename, restoreDataHandler);
}

function saveUserData(event) {
	//
	// This function is called when the user wants to save the input fields to a file.
	//
	let inputs = [];
	for (const formname of Forms.listAllTaxForms()) {
		let tmp = getFieldsForSave(formname);
		if (tmp.length > 0) {
			inputs.push(tmp);
		}
	}

	const data = {
		version:		HTML.getUserInput("TaxToolsVersion", "text"),
		tool:			HTML.getUserInput("Title", "text"),
		todays_date:	new Date().toLocaleDateString(),
		input_data:		inputs,
	};

	File.saveToFile(data, TAX_PROGRAM_SAVE_FILE);
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	//
	HTML.addListener("CalculateButton",	"click",  changeHandler);
	HTML.addListener("SaveButton",		"click",  saveUserData);
	HTML.addListener("InputFile",		"change", restoreUserData);

	HTML.hideElement("TaxReturnContainer");
	HTML.hideElement("DebugContainer");
});
