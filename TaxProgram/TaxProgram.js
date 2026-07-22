
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { File }			from "../Library/Classes/File.js";
import { Forms }		from "../Library/Classes/Forms.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { Str }			from "../Library/Classes/Str.js";
import { Taxpayer }		from "../Library/Classes/Taxpayer.js";
import { TaxData }		from "../Library/Classes/TaxData.js";
import { TaxTable }		from "../Library/Classes/TaxTable.js";

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
		Forms.getForm("F1040").calculate();							// Calculate the tax forms
		Forms.getForm("F540").calculate();							// Calculate the tax forms
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

	Object.keys(inputs.Taxpayer).forEach(function(key) {
		// Keys in the JSON file use camel case. Convert it to snake case, which is
		// used for variable names.
		let fieldname = Str.toSnakeCase(key);
		taxpayer[fieldname] = inputs.Taxpayer[key];
	});

	return taxpayer;
}

function putOutputs(tax_year) {
	HTML.putUserOutput("TaxYear", tax_year, "text");		// Default tax year.
	Debug.getKeywords("Debug");								// Use the Debug module to print the results
	Debug.turnOn();											// Put debug info on web page if enabled
}

function readTaxData(event) {
	//
	// Read the file with the tax data.
	//
	// The file selection dialog gets a list of files, but only one should be passed
	// in our case; select the first file and ignore the rest.
	//
	const filename = event.target.files[0];
	if (!filename) {
		throw new Error("No file selected.");
		return;
	}

	File.restoreFromFile(filename, changeHandler);
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	//
	HTML.addListener("InputFile", "change", readTaxData);
	HTML.hideElement("DebugContainer");
});
