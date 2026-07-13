
let tax_year				= 0;
let filing_status			= "";
let adjusted_gross_income	= 0;
let taxpayers_birthday		= "";
let taxpayers_age			= 0;
let spouses_birthday		= "";
let spouses_age				= 0;
let senior_deduction		= 0;
let input_color				= "";
let output_color			= "";

function calculateSeniorDeduction() {
	const end_of_year			= new Date("12/31/" + tax_year).toLocaleDateString();
	let period					= 0;

	if (strCaseEqual(filing_status, "MFJ")) {
		showElement("SpouseContainer");
	} else {
		hideElement("SpouseContainer");
	}

	if (tax_year === 0) {
		tax_year = getTaxYear();
		HTML.putUserOutput("TaxYear", tax_year, "text");
	}

	initializeTaxTables(filing_status, tax_year);

	if (taxpayers_birthday !== "") {
		taxpayers_age = Dates.getAge(taxpayers_birthday, end_of_year);
		HTML.changeBackgroundColor("TaxpayersAge", output_color);
	} else {
		HTML.changeBackgroundColor("TaxpayersAge", input_color);
	}

	if (spouses_birthday !== "") {
		spouses_age = getAge(spouses_birthday, end_of_year);
		HTML.changeBackgroundColor("SpousesAge", output_color);
	} else {
		HTML.changeBackgroundColor("SpousesAge", input_color);
	}

	senior_deduction = getSeniorDeduction(filing_status, adjusted_gross_income, taxpayers_age, spouses_age);
}

function putOutput() {
	HTML.putUserOutput("TaxpayersAge",		taxpayers_age);
	HTML.putUserOutput("SpousesAge",			spouses_age);
	HTML.putUserOutput("SeniorDeduction",	senior_deduction);
}

function getInput() {
	tax_year				= HTML.getUserInput("TaxYear");
	filing_status			= HTML.getUserInput("FilingStatus",		"text");
	adjusted_gross_income	= HTML.getUserInput("AdjustedGrossIncome");
	taxpayers_birthday		= HTML.getUserInput("TaxpayersBirthday",	"text");
	taxpayers_age			= HTML.getUserInput("TaxpayersAge");
	spouses_birthday		= HTML.getUserInput("SpousesBirthday",	"text");
	spouses_age				= HTML.getUserInput("SpousesAge");

	senior_deduction		= 0;
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

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	Debug.reset();
	getInput();
	calculateSeniorDeduction();
	putOutput();
	Debug.turnOn();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	HTML.addListener("TaxYear",				"change", changeHandler);
	HTML.addListener("FilingStatus",			"change", changeHandler);
	HTML.addListener("AdjustedGrossIncome",	"change", changeHandler);
	HTML.addListener("TaxpayersBirthday",	"change", changeHandler);
	HTML.addListener("TaxpayersAge",			"change", changeTaxpayersAge);
	HTML.addListener("SpousesBirthday",		"change", changeHandler);
	HTML.addListener("SpousesAge",			"change", changeSpousesAge);

	output_color	= HTML.getCSSGlobalVariable("--output-color");
	input_color		= HTML.getCSSGlobalVariable("--input-color");

	HTML.hideElement("SpouseContainer");
	HTML.hideElement("DebugContainer");
});
