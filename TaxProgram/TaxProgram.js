
import { Dates }			from "../Library/Classes/Dates.js";
import { Debug }			from "../Library/Classes/Debug.js";
import { File }				from "../Library/Classes/File.js";
import { Forms }			from "../Library/Classes/Forms.js";
import { HTML }				from "../Library/Classes/HTML.js";
import { HTMLDoc }			from "../Library/Classes/HTMLDoc.js";
import { Taxpayer }			from "../Library/Classes/Taxpayer.js";
import { TaxTable }			from "../Library/Classes/TaxTable.js";

import { Taxpayer_HTML }	from "../Library/Forms-HTML/Taxpayer-HTML.js";
import { F1040_HTML }		from "../Library/Forms-HTML/F1040-HTML.js";
import { W2_HTML }			from "../Library/Forms-HTML/W2-HTML.js";

import { TAX_PROGRAM_SAVE_FILE } from "../Library/TaxTools/TaxTools.js";

function calculateHandler(event) {
	//
	// This function is called when the Calculate button is pressed. It causes
	// the tax return to be generated.
	//
	//try {
		// Reset static (global) variables to erase information from a previous calculation.
		Debug.reset();
		Forms.reset();
		HTMLDoc.reset();
		Taxpayer.reset();

		const tax_year	= HTML.getUserInput("tax-year");
		const tax_table	= TaxTable.getTaxTable(tax_year);			// Initialize tax tables
		const taxpayer	= getTaxpayer();							// Create and initialize taxpayer
		createTaxForms();											// Create tax forms from user input
		const f1040 = Forms.getForm("F1040") || Forms.createForm("F1040");
		f1040.calculate();
		putOutputs();
	//} catch (err) {
		//HTML.putElementValue("ErrorMessageOutput", err);
		//document.getElementById("ErrorMessageOutput").scrollIntoView();
	//}
}

function changeHandler(event) {
	//
	// This function is called when any of the input fields are changed. It hides any
	// information from a previous calculation and updates the fields that are shown
	// when the filing status changes.
	//
	// HTML.hideElement("TaxReturnContainer");
	HTML.hideElement("debug-container")
	HTML.putElementValue("ErrorMessageOutput", "");

	// Remove the tax return.
	const htmldoc = HTMLDoc.getDoc();
	if (htmldoc) {
		htmldoc.remove();
	}
	
	const filing_status = HTML.getUserInput("FilingStatus", "text").toUpperCase();
	HTML.hideElement("SpouseContainer");
	if (filing_status === "MFJ") {
		HTML.showElement("SpouseContainer");
	} else {
		HTML.hideElement("SpouseContainer");
	}
}

function createTaxForms() {
	// Input forms
	W2_HTML.getUserInput(0);

	// Additional Tax Forms
	F1040_HTML.getUserInput();
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

function putOutputs() {
	//
	//	Print the tax forms that were created.
	//
	let tax_forms = "";

	tax_forms += Taxpayer.getTaxpayer().toPrint();

	let forms = Forms.formsToPrint();
	for (const form of forms) {
		tax_forms += form.toPrint();
	}

	const doc = new HTMLDoc();
	doc.startElement("div");
	doc.addElement("p", "", "This is the first dynamically added line.");
	doc.addElement("p", "", "This is the second dynamically added line.");
	doc.stopElement("div");
	doc.putAfter("TaxReturnContainer");

	// Close the input forms so they are in their colapsed state.
	HTML.closeAllDetails();

	// Copy the tax forms to the web page, show the area with the tax forms, and nove the focus to that area.
	HTML.putElementValue("TaxReturnOutput", tax_forms);
	HTML.showElement("TaxReturnContainer");
	document.getElementById("TaxReturnOutput").scrollIntoView({behavior: 'smooth', block: 'start'});
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
	let inputs = [];
	for (const formname of Forms.listAllTaxForms()) {
		let tmp = getFieldsForSave(formname);
		if (tmp.length > 0) {
			inputs.push(tmp);
		}
	}

	const data = {
		version:		HTML.getUserInput("TaxToolsVersion", "text"),
		tool:			HTML.getUserInput("title", "text"),
		todays_date:	new Date().toLocaleDateString(),
		input_data:		inputs,
	};

	File.saveToFile(data, TAX_PROGRAM_SAVE_FILE);
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	//
	HTML.addListener("calculate-button",	"click",  calculateHandler);
	HTML.addListener("save-button",			"click",  saveUserData);
	HTML.addListener("input-file",			"change", restoreUserData);
	HTML.addListener("tool-container",		"change", changeHandler);

	changeHandler();
});

//
// Get Input from the Web
//
function getTaxpayer() {
	let inputs = {};

	const taxpayer = new Taxpayer();

	taxpayer.tax_year						= HTML.getUserInput("tax-year");
	taxpayer.filing_status					= HTML.getUserInput(`filing-status`,	"text").toUpperCase();

	taxpayer.taxpayers_name					= HTML.getUserInput(`taxpayers-name`,	"text");
	taxpayer.street_address					= HTML.getUserInput(`street-address`,	"text");
	taxpayer.city							= HTML.getUserInput(`city`,				"text");
	taxpayer.zip_code						= HTML.getUserInput(`zip-code`,			"text");

	// Taxpayer
	taxpayer.taxpayers_birthday				= HTML.getUserInput(`taxpayers-birthday`, "text");
	taxpayer.is_taxpayer_blind				= HTML.getUserInput(`is-taxpayer-blind`, "");
	// taxpayer.is_taxpayer_citizen			= HTML.getUserInput(`is-taxpayer-citizen`, "");
	// taxpayer.taxpayer_has_ssn			= HTML.getUserInput(`taxpayer-has-ssn`, "");
	// taxpayer.lived_with_spouse			= HTML.getUserInput(`lived-with-spouse`, "");
	// taxpayer.can_be_dependent			= HTML.getUserInput(`can-be-dependent`, "");
	// taxpayer.rents_home					= HTML.getUserInput(`rents-home`, "");
	taxpayer.taxpayer_educator_expenses		= HTML.getUserInput(`tp-taxpayer-educator-expenses`, "");
	taxpayer.taxpayer_ltc_premiums			= HTML.getUserInput(`tp-taxpayer-ltc-premiums`, "");

	// Spouse
	taxpayer.spouses_birthday				= HTML.getUserInput(`spouses-birthday`, "text");
	taxpayer.is_spouse_blind				= HTML.getUserInput(`is-spouse-blind`, "");
	// taxpayer.is_spouse_citizen			= HTML.getUserInput(`is-spouse-citizen`, "");
	// taxpayer.spouse_has_ssn				= HTML.getUserInput(`spouse-has-ssn`, "");
	taxpayer.spouse_educator_expenses		= HTML.getUserInput(`tp-spouse-educator-expenses`, "");
	taxpayer.spouse_ltc_premiums			= HTML.getUserInput(`tp-spouse-ltc-premiums`, "");

	// Taxpayer and spouse
	// taxpayer.number_of_dependents		= HTML.getUserInput(`tp--number-of-dependents`, "");
	taxpayer.alimony_paid					= HTML.getUserInput(`tp-alimony-paid`, "");
	taxpayer.alimony_received				= HTML.getUserInput(`tp-alimony-received`, "");
	taxpayer.divorce_date					= HTML.getUserInput(`tp-divorce-date`, "text");
	taxpayer.federal_estimated_payments		= HTML.getUserInput(`tp-federal-estimated-payments`, "");
	taxpayer.state_estimated_payments		= HTML.getUserInput(`tp-state-estimated-payments`, "");
	taxpayer.medical_insurance_premiums		= HTML.getUserInput(`tp-medical-insurance-premiums`, "");
	taxpayer.medicare_repremiums			= HTML.getUserInput(`tp-medicare-premiums`, "");
	taxpayer.other_medical_expenses			= HTML.getUserInput(`tp-other-medical-expenses`, "");
	taxpayer.medical_miles					= HTML.getUserInput(`tp-medical-miles`, "");
	taxpayer.property_tax					= HTML.getUserInput(`tp-property-tax`, "");
	taxpayer.personal_property_tax			= HTML.getUserInput(`tp-personal-property-tax`, "");
	taxpayer.extra_sales_tax				= HTML.getUserInput(`tp-extra-sales-tax`, "");
	taxpayer.cash_gift_to_charity			= HTML.getUserInput(`tp-cash-gift-to-charity`, "");
	taxpayer.noncash_gift_to_charity		= HTML.getUserInput(`tp-noncash-gift-to-charity`, "");
	taxpayer.tax_preparation_fees			= HTML.getUserInput(`tp-tax-preparation-fees`, "");
	taxpayer.investment_expenses			= HTML.getUserInput(`tp-investment-expenses`, "");
	taxpayer.unreimbursed_employee_expenses	= HTML.getUserInput(`tp-unreimbursed-employee-expenses`, "");

	return taxpayer;
}