
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { File }			from "../Library/Classes/File.js";
import { Forms }		from "../Library/Classes/Forms.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { Str }			from "../Library/Classes/Str.js";
import { Taxpayer }		from "../Library/Classes/Taxpayer.js";
import { TaxData }		from "../Library/Classes/TaxData.js";
import { TaxTable }		from "../Library/Classes/TaxTable.js";

import { F1040_HTML }	from "../Library/Forms-HTML/F1040-HTML.js";
import { W2_HTML }		from "../Library/Forms-HTML/W2-HTML.js";

import { TAX_PROGRAM_SAVE_FILE } from "../Library/TaxTools/TaxTools.js";

function changeHandler(event) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole return (not just the field tha was changed).
	//
	//try {
		const tax_year	= HTML.getUserInput("TaxYear");
		const tax_table	= TaxTable.getTaxTable(tax_year);			// Initialize tax tables; ignore return value.
		const taxpayer	= createTaxpayer();							// Initialize taxpayer; ignore return value.
		const tax_data	= mapInputValues();							// Map input values to tax forms
		TaxData.loadForms(tax_data);								// Create tax forms with the taxpayer's data
		const f1040 = Forms.getForm("F1040") || Forms.createForm("F1040");
		f1040.calculate();
		putOutputs(tax_year);
	//} catch (err) {
		//HTML.putElementValue("ErrorMessageOutput", err);
		//document.getElementById("ErrorMessageOutput").scrollIntoView();
	//}
}

function createTaxpayer() {
	const taxpayer = new Taxpayer();

	taxpayer.tax_year = HTML.getUserInput("TaxYear");

	for (const key of Object.keys(inputs.Taxpayer)) {
		// Keys in the JSON file use camel case. Convert it to snake case, which is
		// used for variable names.
		let fieldname = Str.camelToSnakeCase(key);
		taxpayer[fieldname] = inputs.Taxpayer[key];
	}
/*
	inputs.AlimonyPaid				= HTML.getUserInput(`TP-${index}-AlimonyPaid`);
	inputs.AlimonyReceived			= HTML.getUserInput(`TP-${index}-AlimonyReceived`);
	inputs.DivorceDate				= HTML.getUserInput(`TP-${index}-DivorceDate`,	"text");
	inputs.FederalEstimatedPayments	= HTML.getUserInput(`TP-${index}-FederalEstimatedPayments`);
	inputs.StateEstimatedPayments	= HTML.getUserInput(`TP-${index}-StateEstimatedPayments`);
	inputs.MedicalInsurancePremiums	= HTML.getUserInput(`TP-${index}-MedicalInsurancePremiums`);
	inputs.MedicarePremiums			= HTML.getUserInput(`TP-${index}-MedicarePremiums`);
	inputs.TaxpayerLTCPremiums		= HTML.getUserInput(`TP-${index}-TaxpayerLTCPremiums`);
	inputs.SpouseLTCPremiums		= HTML.getUserInput(`TP-${index}-SpouseLTCPremiums`);
	inputs.OtherMedicalExpenses		= HTML.getUserInput(`TP-${index}-OtherMedicalExpenses`);
	inputs.MedicalMiles				= HTML.getUserInput(`TP-${index}-MedicalMiles`);
	inputs.PropertyTax				= HTML.getUserInput(`TP-${index}-PropertyTax`);
	inputs.PersonalPropertyTax		= HTML.getUserInput(`TP-${index}-PersonalPropertyTax`);
	inputs.ExtraSalesTax			= HTML.getUserInput(`TP-${index}-ExtraSalesTax`);
	inputs.CashGiftToCharity		= HTML.getUserInput(`TP-${index}-CashGiftToCharity`);
	inputs.NoncashGiftToCharity		= HTML.getUserInput(`TP-${index}-NoncashGiftToCharity`);
	inputs.TaxPreparationFees		= HTML.getUserInput(`TP-${index}-TaxPreparationFees`);
	inputs.InvestmentExpenses		= HTML.getUserInput(`TP-${index}-LocalityName`);
	inputs.UnreimbursedEmployeeExpenses	= HTML.getUserInput(`TP-${index}-UnreimbursedEmployeeExpenses`);
	inputs.TaxpayerEducatorExpenses= HTML.getUserInput(`TP-${index}-TaxpayerEducatorExpenses`);
	inputs.SpouseEducatorExpenses	= HTML.getUserInput(`TP-${index}-SpouseEducatorExpenses`);
*/
	return taxpayer;
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

function mapInputValues() {
	const tax_data	= new TaxData();

	W2_HTML.getHTMLInput(tax_data, 0);
	F1040_HTML.getHTMLInput(tax_data);

	return tax_data;
}

function putFieldsFromRestore(form) {
	// This method puts the fields read from a saved file back onto the
	// web page.
	formname = form[0];

	for (let i = 1; i < form.length; i++) {
		let line			= form[i];
		let lineno			= line[0];
		let element_name	= line[1];
		HTML.putElementValue(element_name, value);
	}
}

function putOutputs(tax_year) {
	//
	//	Print the tax forms that were created.
	//
	let tax_forms = "";

	let tp = Taxpayer.getTaxpayer();
	tax_forms += tp.toString();
							   
	for (const form in Forms.formsToPrint()) {
		tax_forms += form.toString();
	}

	// Close the input forms so they are in their colapsed state.
	// HTML.closeAllDetails();

	// Copy the tax forms to the web page, show the area with the tax forms, and nove the focus to that area.
	HTML.putElementValue("TaxReturnOutput", tax_forms);
	HTML.showElement("TaxReturnContainer");
	document.getElementById("TaxReturnOutput").scrollIntoView({behavior: 'smooth', block: 'start'});
}

function refresh(event) {
	HTML.hideElement("TaxReturnContainer");
	HTML.hideElement("DebugContainer")
	HTML.putElementValue("ErrorMessageOutput", "");
	
	const filing_status = HTML.getUserInput("FilingStatus", "text");
	HTML.hideElement("SpouseContainer");
	if (Str.caseEqual(filing_status, "MFJ")) {
		HTML.showElement("SpouseContainer");
	} else {
		HTML.hideElement("SpouseContainer");
	}

	// Reset static (global) variables to erase information from a previous calculation.
	Debug.reset();
	Forms.reset();
	Taxpayer.reset();
}

function restoreDataHandler(data) {
	//
	// This function is called when the user restores the input fields from a file.
	// The data that was copied from the file is passed a parameter.
	//
	const tool = HTML.getUserInput("Title", "text");
	if (data.tool !== tool) {
		throw new Error(`Restored data file is intended for the ${data.tool} tool.`);
	}

	let inputs = data.inputs;
	for (const form of inputs) {
		putFieldsFromRestore(form);
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
	HTML.addListener("ToolContainer",	"change", refresh);

	refresh();
});
