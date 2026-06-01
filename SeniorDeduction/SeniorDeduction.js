
let tax_year				= 0;
let adjusted_gross_income	= 0;
let taxpayers_birthday		= "";
let taxpayers_age			= 0;
let spouses_birthday		= "";
let spouses_age				= 0;
let senior_deduction		= 0;
let input_color				= "";
let output_color			= "";


function CalculateSeniorDeduction() {
	const end_of_year			= new Date("12/31/" + tax_year).toLocaleDateString();;
	let period					= 0;

	if (strCaseEqual(filing_status, "MFJ")) {
		showElement("SpouseContainer");
	} else {
		hideElement("SpouseContainer");
	}
	
	if (tax_year === 0) {
		tax_year = getTaxYear();
		putUserOutput("TaxYear", tax_year, "text");
	}

	InitializeTaxTables(filing_status, tax_year);

	if (taxpayers_birthday !== "") {
		taxpayers_age = Age(taxpayers_birthday, end_of_year);
		changeBackgroundColor("TaxpayersAge", output_color);
	} else {
		changeBackgroundColor("TaxpayersAge", input_color);
	}
	
	if (spouses_birthday !== "") {
		spouses_age = Age(spouses_birthday, end_of_year);
		changeBackgroundColor("SpousesAge", output_color);
	} else {
		changeBackgroundColor("SpousesAge", input_color);
	}

	senior_deduction = getSeniorDeduction(filing_status, adjusted_gross_income, taxpayers_age, spouses_age);
}

function PutOutput() {
	putUserOutput("TaxpayersAge",		taxpayers_age);
	putUserOutput("SpousesAge",			spouses_age);
	putUserOutput("SeniorDeduction",	senior_deduction);
}

function GetInput() {
	tax_year				= getUserInput("TaxYear");
	filing_status			= getUserInput("FilingStatus",		"text");
	adjusted_gross_income	= getUserInput("AdjustedGrossIncome");
	taxpayers_birthday		= getUserInput("TaxpayersBirthday",	"text");
	taxpayers_age			= getUserInput("TaxpayersAge");
	spouses_birthday		= getUserInput("SpousesBirthday",	"text");
	spouses_age				= getUserInput("SpousesAge");
	
	senior_deduction		= 0;
}

function ChangeSpousesAge(event) {
	const spouses_age = getUserInput("SpousesAge");
	if (spouses_age !== 0)
		putUserOutput("SpousesBirthday", "");
		
	ChangeHandler(event);
}

function ChangeTaxpayersAge(event) {
	const taxpayers_age = getUserInput("TaxpayersAge");
	if (taxpayers_age !== 0)
		putUserOutput("TaxpayersBirthday", "");
		
	ChangeHandler(event);
}

function ChangeHandler(event) {
	// This is the function that is called if any input field is changed.
	TurnOffDebug();
	GetInput();
	CalculateSeniorDeduction();
	PutOutput();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.
	
	addListener("TaxYear",				"change", ChangeHandler);
	addListener("FilingStatus",			"change", ChangeHandler);
	addListener("AdjustedGrossIncome",	"change", ChangeHandler);
	addListener("TaxpayersBirthday",	"change", ChangeHandler);
	addListener("TaxpayersAge",			"change", ChangeTaxpayersAge);
	addListener("SpousesBirthday",		"change", ChangeHandler);
	addListener("SpousesAge",			"change", ChangeSpousesAge);

	output_color	= getCSSGlobalVariable("--output-color");
	input_color		= getCSSGlobalVariable("--input-color");

	ChangeHandler();
});
