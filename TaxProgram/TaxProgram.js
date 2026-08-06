
import { Dates }			from "../Library/Classes/Dates.js";
import { Debug }			from "../Library/Classes/Debug.js";
import { File }				from "../Library/Classes/File.js";
import { Forms }			from "../Library/Classes/Forms.js";
import { HTML }				from "../Library/Classes/HTML.js";
import { HTMLTaxForms }		from "../Library/Classes/HTMLTaxForms.js";
import { Taxpayer }			from "../Library/Classes/Taxpayer.js";
import { TaxTable }			from "../Library/Classes/TaxTable.js";
	
import { W2 }				from "../Library/TaxForms/W2.js";

// Save information about which tax forms have been added to the web page.
let next_w2					= 1;

import { TAX_PROGRAM_SAVE_FILE } from "../Library/TaxTools/TaxTools.js";

function addForm(event) {
	//
	// This function is called when the user wants to add another input tax form.
	//
	let form_id	= "";
	let html	= "";
	
	const form_name = HTML.getElementValue("add-form-button");
	HTML.putElementValue("add-form-button", "");	// Reselect the "Add Form" entry.
	
	switch (form_name) {
		case "":
			break;

		case "W-2":
			[ form_id, html ] = W2.getHTML(next_w2++);
			HTMLTaxForms.addForm(form_id, html);
			break;
	}
}

function calculateHandler(event) {
	//
	// This function is called when the Calculate button is pressed. It causes
	// the tax return to be generated.
	//
	//try {
		TaxTable.getTaxTable(HTML.getUserInput("tax-year"));	// Initialize tax tables
		Taxpayer.initializeTaxpayer();							// Create and initialize taxpayer
		createTaxForms();										// Create tax forms from user input
		const f1040 = Forms.getForm("F1040") || Forms.createForm("F1040");
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
	// This function is called when any of the input fields are changed.
	//

	// Reset debugging and error information.
	Debug.reset();
	Debug.set_strict();
	HTML.putElementValue("error-message-output", "");

	// Reset tax return information.
	Forms.dataChanged();	// Reset forms so they will be recalculated.
	HTML.hideElement("tax-return-container");

	// See if filing status changed.
	const filing_status = HTML.getUserInput("filing-status", "text").toUpperCase();
	if (filing_status === "MFJ") {
		HTML.showElement("spouse-container");
	} else {
		HTML.hideElement("spouse-container");
	}
}

function createTaxForms() {
	W2.getUserInput(1);
	// W2.getUserInput(2);
	// W2.getUserInput(3);
	// W2.getUserInput(4);
}

function putOutputs() {
	//
	//	Print the tax forms that were created.
	//
	const taxpayer	= Taxpayer.getTaxpayer();
	const f1040		= Forms.getForm("F1040");

	// Close the input forms so they do not distract from the tax return information.
	HTML.closeAllDetails();

	taxpayer.putTaxpayerInformation();
	f1040.put1040Information();
	const elements = document.querySelectorAll("tax-return-container");
	HTML.showElement("tax-return-container");
	document.getElementById("tax-return-container").scrollIntoView({behavior: 'smooth', block: 'start'});
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
		formname = form[0];
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
	const taxforms = Forms.getUserSuppliedValues()

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
