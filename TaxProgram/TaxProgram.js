
import { Dates }			from "../Library/Classes/Dates.js";
import { Debug }			from "../Library/Classes/Debug.js";
import { File }				from "../Library/Classes/File.js";
import { HTML }				from "../Library/Classes/HTML.js";
import { TaxFormWeb }		from "../Library/Classes/TaxFormWeb.js";
import { TaxFormName }		from "../Library/Classes/TaxFormName.js";
import { TaxFormObj }		from "../Library/Classes/TaxFormObj.js";
import { Taxpayer }			from "../Library/Classes/Taxpayer.js";
import { TaxTable }			from "../Library/Classes/TaxTable.js";

import { F1040 }			from "../Library/TaxForms/F1040.js";
import { W2 }				from "../Library/TaxForms/W2.js";

import { TAX_PROGRAM_SAVE_FILE } from "../Library/TaxTools/TaxTools.js";

function addForm(event) {
	//
	// This function is called when the user clicks on the "Add Form" button.
	//
	
	const formname = HTML.getElementValue("add-form-button");	// Get selected form name.
	HTML.putElementValue("add-form-button", "");				// Change selection back to the "Add Form" entry.

	if (formname === "") {
			return;
	}

	addInputForm(formname);
}

function addInputForm(formname) {
	let form_id;
	let html;
	let uid;	// Unique ID

	uid = TaxFormWeb.getUID(formname);
	[ form_id, html ] = TaxFormName.getInputHTML(formname, uid);
	TaxFormWeb.addInputForm(form_id, html);
}

function addOutputForm(form) {
	let form_id;
	let html;
	let uid;	// Unique ID

	if (typeof form.getOutputHTML !== 'function') {
		console.log(`${form.formname}.getOutputHTML does not exist; cannot add output form.`);
		return;
	}

	uid = TaxFormWeb.getUID(form.formname);
	[ form_id, html ] = form.getOutputHTML(uid);
	TaxFormWeb.addOutputForm(form_id, html);
	form.putInformation(uid);

	return form_id;
}

function calculateHandler(event) {
	//
	// This function is called when the Calculate button is pressed. It causes
	// the tax return to be generated.
	//
	//try {
		// Remove information from previous calculation.
		resetCalculation();
		
		TaxTable.getTaxTable(HTML.getUserInput("tax-year"));	// Initialize tax tables
		Taxpayer.initializeTaxpayer();							// Create and initialize taxpayer
		createTaxForms();										// Create tax forms from user input
		const f1040 = TaxFormObj.getForm("F1040") || TaxFormObj.createForm("F1040");
		f1040.calculate();
		putOutputs();
		Debug.turnOn();
	//} catch (err) {
		//HTML.putElementValue("error-message-output", err);
		//document.getElementById("error-message-output").scrollIntoView();
	//}
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
		let [ formname, uid ] = TaxFormWeb.parseFormName(taxform_id);
		// window[class_name].getUserInput(index);
		TaxFormName.getUserInput(formname, uid);
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
	document.getElementById("output-forms-container").scrollIntoView({behavior: 'smooth', block: 'start'});
}

function resetCalculation() {
	Debug.reset();
	Debug.set_strict();

	TaxFormObj.deleteAllForms();

	// Remove the output web form from the previous calculation.
	TaxFormWeb.removeOutputForms();			// Remove form web pages.
	HTML.hideElement("output-forms-container");
}

function restoreDataHandler(data) {
	//
	// This function is called when the user restores the input fields from a file.
	// The data that was copied from the file is passed a parameter.
	//
	const tool = HTML.getUserInput("title", "text");
	if (data.tool !== tool) {
		throw new Error(`Restored data file is intended for the ${data.tool} tool.`);
	}

	// For each form.
	for (const form of data.inputs) {
		// Puts the fields read from a saved file back onto the web page.
		for (let i = 1; i < form.length; i++) {
			let line			= form[i];
			let lineno			= line[0];
			let element_name	= line[1];
			HTML.putElementValue(element_name, value);
		}
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

function saveUserData(event) {
	//
	// This function is called when the user wants to save the input fields to a file.
	//
	const taxpayer = Taxpayer.getTaxpayer();
	const taxforms = TaxFormObj.getUserSuppliedValues()

	const data = {
		"tool_name":	HTML.getUserInput("title", "text"),
		"version":		HTML.getUserInput("TaxToolsVersion", "text"),
		"todays_date":	new Date().toLocaleDateString(),
		"taxpayer":		taxpayer,
		"taxforms":		taxforms,
	};

	File.saveToFile(data, TAX_PROGRAM_SAVE_FILE);
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
