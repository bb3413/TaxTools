
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { Forms }		from "../Library/Classes/TaxForms.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { Str }			from "../Library/Classes/Str.js";
import { Taxpayer }		from "../Library/Classes/Taxpayer.js";
import { TaxTable }		from "../Library/Classes/TaxTable.js";

let input_color			= "";
let output_color		= "";

function changeHandler(event) {
	//
	// This function is called when any input field is changed.
	//
	try {
		// Reset static (global) variables to erase information from a previous calculation.
		HTML.putElementValue("error-message-output", "");
		Debug.reset();
		TaxForms.reset();
		Taxpayer.reset();

		const inputs	= getInputs();								// Get inputs from the web page
		const tax_table	= TaxTable.getTaxTable(inputs.tax_year);	// Initialize tax tables; ignore return value.
		const taxpayer	= createTaxpayer(inputs);					// Initialize taxpayer; ignore return value.
		mapInputValues(inputs);										// Map input values to tax forms
		TaxForms.getForm("F1040S1A").calculate();						// Calculate the tax forms
		putOutputs(taxpayer);										// Put results on web page
		Debug.turnOn();												// Put debug info on web page if enabled
	} catch (err) {
		HTML.putElementValue("error-message-output", err);
		document.getElementById("error-message-output").scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

function changeSpousesAge(event) {
	const spouses_age = HTML.getUserInput("SpousesAge");
	if (spouses_age !== 0)
		HTML.putUserOutput("SpousesBirthday", "");

	changeHandler(event);
}

function changeTaxpayersAge(event) {
	const taxpayers_age = HTML.getUserInput("TaxpayersAge");
	if (taxpayers_age !== 0)
		HTML.putUserOutput("TaxpayersBirthday", "");

	changeHandler(event);
}

function createTaxpayer(inputs) {
	const taxpayer					= new Taxpayer();

	taxpayer.tax_year				= inputs.tax_year;
	taxpayer.filing_status			= inputs.filing_status;
	taxpayer.taxpayers_birthday		= inputs.taxpayers_birthday;
	taxpayer.taxpayers_age			= inputs.taxpayers_age;
	taxpayer.spouses_birthday		= inputs.spouses_birthday;
	taxpayer.spouses_age			= inputs.spouses_age;

	return taxpayer;
}

function getInputs() {
	//
	// Get the values from the web page. Put them in an object literal so the values
	// can be accessed by name.
	//
	const inputs = {};

	inputs.tax_year					= HTML.getUserInput("TaxYear");
	inputs.filing_status			= HTML.getUserInput("FilingStatus",		"text").toUpperCase();
	inputs.adjusted_gross_income	= HTML.getUserInput("AdjustedGrossIncome");
	inputs.taxpayers_birthday		= HTML.getUserInput("TaxpayersBirthday","text");
	inputs.taxpayers_age			= 0;
	if (Str.empty(inputs.taxpayers_birthday)) {
		inputs.taxpayers_age		= HTML.getUserInput("TaxpayersAge");
	}
	inputs.spouses_birthday			= HTML.getUserInput("SpousesBirthday",	"text");
	inputs.spouses_age				= 0;
		if (Str.empty(inputs.spouses_birthday)) {
		inputs.spouses_age		= HTML.getUserInput("SpousesAge");
	}

	return inputs;
}

function mapInputValues(inputs) {

	const f1040S1A = TaxForms.createForm("F1040S1A");

	f1040S1A.lines["01"].user_value = inputs.adjusted_gross_income;
}

function putOutputs(taxpayer) {
	if (taxpayer.filing_status === "MFJ") {
		HTML.showElement("SpouseContainer");
	} else {
		HTML.hideElement("SpouseContainer");
	}

	if (taxpayer.taxpayers_birthday !== "") {
		HTML.changeBackgroundColor("TaxpayersAge", output_color);
	} else {
		HTML.changeBackgroundColor("TaxpayersAge", input_color);
	}

	if (taxpayer.spouses_birthday !== "") {
		HTML.changeBackgroundColor("SpousesAge", output_color);
	} else {
		HTML.changeBackgroundColor("SpousesAge", input_color);
	}

	HTML.putUserOutput("TaxpayersAge",			taxpayer.taxpayers_age);
	HTML.putUserOutput("SpousesAge",			taxpayer.spouses_age);
	HTML.putUserOutput("SeniorDeduction", 		TaxForms.getValue("F1040S1A", "37"));
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	//
	HTML.addListener("TaxYear",				"change", changeHandler);
	HTML.addListener("FilingStatus",		"change", changeHandler);
	HTML.addListener("AdjustedGrossIncome",	"change", changeHandler);
	HTML.addListener("TaxpayersBirthday",	"change", changeHandler);
	HTML.addListener("TaxpayersAge",		"change", changeTaxpayersAge);
	HTML.addListener("SpousesBirthday",		"change", changeHandler);
	HTML.addListener("SpousesAge",			"change", changeSpousesAge);

	output_color	= HTML.getCSSGlobalVariable("--output-color");
	input_color		= HTML.getCSSGlobalVariable("--input-color");

	HTML.putUserOutput("TaxYear", Dates.getTaxYear(), "text");		// Default tax year.
	HTML.hideElement("SpouseContainer");
	HTML.hideElement("debug-container");
});
