
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { File }			from "../Library/Classes/File.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { Objects }		from "../Library/Classes/Objects.js";
import { TaxFormWeb }	from "../Library/Classes/TaxFormWeb.js";
import { TaxFormName }	from "../Library/Classes/TaxFormName.js";
import { TaxFormObj }	from "../Library/Classes/TaxFormObj.js";
import { Taxpayer }		from "../Library/Classes/Taxpayer.js";
import { TaxTable }		from "../Library/Classes/TaxTable.js";
import { F1040 }		from "../Library/TaxForms/F1040.js";

import { TAX_PROGRAM_SAVE_FILE } from "../Library/TAXTools/TAXTools.js";

function addForm(event) {
	//
	// This function is called when the user clicks on the "Add Form" button.
	//

	const formname = HTML.getElementValue("add-form-button");	// Get selected form name.
	HTML.putElementValue("add-form-button", "");				// Reset to "Add Form".

	if (formname === "") {
			return;
	}

	addInputForm(formname);
}

function addInputForm(formname) {
	let taxform_id;
	let html;
	let uid;	// Unique ID

	uid = TaxFormWeb.getUID(formname);
	[ taxform_id, html ] = TaxFormName.getInputHTML(formname, uid);
	TaxFormWeb.addInputForm(taxform_id, html);

	// Open the form and scroll the window to it.
	HTML.openDetails(taxform_id);
	document.getElementById(taxform_id).scrollIntoView({behavior: 'smooth', block: 'start'});

	return taxform_id;
}

function addOutputForm(form) {
	let taxform_id;
	let html;
	let uid;	// Unique ID

	if (typeof form.getOutputHTML !== 'function') {
		console.log(
			`${form.formname}.getOutputHTML does not exist; cannot add output form.`);
		return;
	}

	uid = TaxFormWeb.getUID(form.formname);
	[ taxform_id, html ] = form.getOutputHTML(uid);
	TaxFormWeb.addOutputForm(taxform_id, html);
	form.putInformation(uid);

	return taxform_id;
}

function calculateHandler(event) {
	//
	// This function is called when the Calculate button is pressed. It causes
	// the tax return to be generated.
	//
	try {
		// Remove information from previous calculation.
		resetCalculation();

		TaxTable.getTaxTable(HTML.getUserInput("tax-year"));	// Initialize tax tables
		Taxpayer.getTaxpayer();									// Initialize taxpayer
		createTaxForms();										// Create tax forms
		const f1040 = TaxFormObj.getForm("F1040") || TaxFormObj.createForm("F1040");
		f1040.calculate();
		putOutputs();
		Debug.turnOn();
	} catch (error) {
		HTML.putElementValue("error-message-output", error);
		console.log("Stack trace:", error.stack);
		document.getElementById("error-message-output")
			.scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

function changeHandler(event) {
	//
	// This function is called when any of the input fields are changed. It will reset
	// any information that may be affected.
	//
	HTML.putElementValue("error-message-output", "");	// Clear error message.

	// Reset information from previous calculation.
	resetCalculation();

	// See if filing status changed.
	const filing_status = HTML.getUserInput("filing-status", "text").toUpperCase();
	if (filing_status === "MFJ") {
		HTML.showElement("spouse-container");
	} else {
		HTML.hideElement("spouse-container");
	}
}

function createTaxForms() {
	//
	// When the user clicks on the "Calculate Tax Return" button, this function is called to
	// copy the information from the tax forms on the web page to objects instances of the
	// tax form.
	//
	for (let taxform_id of TaxFormWeb.getInputForms()) {
		let [ formname, uid ] = TaxFormWeb.parseTaxformID(taxform_id);
		TaxFormName.createForm(formname, uid);
	}
}

function putOutputs() {
	//
	//	Print the tax forms.
	//

	// Close the input forms so they do not distract from the tax return information.
	HTML.closeAllDetails();

	// Create the tax return web pages.
	for(const form of TaxFormObj.formsInPrintOrder()) {
		if (form.isUsed()) {
			addOutputForm(form);
		}
	}

	// Put the taxpayer information into form 1040.
	Taxpayer.getTaxpayer().putTaxpayerInformation();

	// Show the tax return forms.
	HTML.openDetails("f1040-1-details");
	HTML.showElement("output-forms-container");
	document.getElementById("output-forms-container")
		.scrollIntoView({behavior: 'smooth', block: 'start'});
}

function resetAll() {
	resetCalculation();						// Remove output calculations and web forms
	Taxpayer.reset();
	TaxFormWeb.removeInputForms();			// Remove input web forms.

	HTML.putUserOutput("tax-year", Dates.getTaxYear(), "text");
	HTML.putUserOutput("filing-status", "Single");
	HTML.hideElement("spouse-container");
	HTML.hideElement("debug-container");
	HTML.putElementValue("error-message-output", "");
}

function resetCalculation() {
	Debug.reset();
	Debug.set_strict();

	TaxFormObj.deleteAllForms();

	// Remove the output web form froms the previous calculation.
	TaxFormWeb.removeOutputForms();			// Remove output form web pages.
	HTML.hideElement("output-forms-container");
}

function restoreDataHandler(data) {
	//
	// This function is called when the user restores the input fields from a file.
	// The data that was copied from the file is passed a parameter.
	//
	try {
		const tool = HTML.getUserInput("title", "text");
		if (data.tool_name !== tool) {
			throw new Error(`Restored data file is intended for the ${data.tool} tool.`);
		}

		// Reset ewverything; do not save any previously input data.
		resetAll();

		// Restore the taxpayer information.
		Taxpayer.restoreTaxpayer(data["taxpayer"]);

		// Restore each input form.
		for (const forminfo of data["input_forms"]) {
			let formname	= forminfo[0];
			let lines		= forminfo[1];

			if (!TaxFormName.isInputForm(formname)) {
				throw new Error(`restoreDataHandler(): ${formname} ` +
					"in an output form, cannot restore.");
			}

			const taxform_id = addInputForm(formname);
			let [ notused, uid ] = TaxFormWeb.parseTaxformID(taxform_id);
			const element_id_prefix = `${formname.toLowerCase()}-${uid}-`;
			for (const lineno of Object.keys(lines)) {
				HTML.putElementValue(element_id_prefix + lineno, lines[lineno]);
			}
		}
	} catch (error) {
		HTML.putElementValue("error-message-output", error);
		console.log("Stack trace:", error.stack);
		document.getElementById("error-message-output")
			.scrollIntoView({behavior: 'smooth', block: 'start'});
	}
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

function saveUserSuppliedInputValues() {
	// Return array of: formName: [ formIndex, lineNumber, value ]
	// This method is used to save the current state to a file. It only saves the
	// values on the input form web pages, and it only saves the fields where the
	// user entered a value.
	let user_values = [];

	// For each form.
	for (let taxform_id of TaxFormWeb.getInputForms()) {
		let [ formname, uid ] = TaxFormWeb.parseTaxformID(taxform_id);
		let inputs = Objects.removeUnused(TaxFormName.saveUserInput(formname, uid));
		user_values.push( [ formname, inputs ] );
	}

	return user_values;
}

function saveUserSuppliedOutputValues() {
	// Return array of: formName: [ formIndex, { lineNumber: value } }
	// This method is used to save the current state to a file. It only saves the
	// values in the tax form objects, and it only saves the fields where the user
	// entered a value.
	let user_values = [];

	// For each form.
	for (const form of TaxFormObj.getAllForms()) {
		// For each line on the form, save the value if it was supplied by the user.
		let outputs = {};
		for (const lineno of Object.keys(form.lines)) {
			if (form.lines[lineno].isUserSuppliedValue()) {
				outputs[lineno] = form.lines[lineno].value;
			}
		}
		if (Objects.isUsed(outputs)) {
			user_values.push( [ form.formname, outputs ] );
		}
	}

	return user_values;
}

function saveUserData(event) {
	//
	// This function is called when the user wants to save the input fields to a file.
	//
	try {
		const input_taxforms	= saveUserSuppliedInputValues();
		const output_taxforms	= saveUserSuppliedOutputValues();

		const data = {
			"tool_name":	HTML.getUserInput("title", "text"),
			"version":		HTML.getUserInput("tax-tools-version", "text"),
			"todays_date":	new Date().toLocaleDateString(),
			"tax_year":		HTML.getUserInput("tax-year", "text"),
			"taxpayer":		Taxpayer.saveTaxpayer(),
			"input_forms":	input_taxforms,
			"output_forms":	output_taxforms,
		};

		File.saveToFile(data, TAX_PROGRAM_SAVE_FILE);
	} catch (error) {
		HTML.putElementValue("error-message-output", error);
		console.log("Stack trace:", error.stack);
		document.getElementById("error-message-output")
			.scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	//
	HTML.addListener("calculate-button",	"click",  calculateHandler);
	HTML.addListener("save-button",			"click",  saveUserData);
	HTML.addListener("add-form-button",		"click",  addForm);
	HTML.addListener("input-file",			"change", restoreUserData);
	HTML.addListener("tool-container",		"change", changeHandler);

	HTML.closeAllDetails();
	changeHandler();
});
