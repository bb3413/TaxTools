
import { getAge }									from "../Library/Dates.js";
import { getTaxYear }								from "../Library/Dates.js";
import { turnOffDebug, turnOnDebug }				from "../Library/Debug.js";
import { strCaseEqual }								from "../Library/Strings.js";
import { addListener }								from "../Library/HTML.js";
import { changeBackgroundColor, changeTextColor }	from "../Library/HTML.js";
import { getCSSGlobalVariable }						from "../Library/HTML.js";
import { showElement, hideElement }					from "../Library/HTML.js";
import { getUserInput, putUserOutput }				from "../Library/HTML.js";
import { initializeTaxTables }						from "../Library/TaxTables/TaxTables.js";
import { getSeniorDeduction }						from "../Library/TaxTables/TaxTables.js";

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

	initializeTaxTables(filing_status, tax_year);

	if (taxpayers_birthday !== "") {
		taxpayers_age = getAge(taxpayers_birthday, end_of_year);
		changeBackgroundColor("TaxpayersAge", output_color);
	} else {
		changeBackgroundColor("TaxpayersAge", input_color);
	}

	if (spouses_birthday !== "") {
		spouses_age = getAge(spouses_birthday, end_of_year);
		changeBackgroundColor("SpousesAge", output_color);
	} else {
		changeBackgroundColor("SpousesAge", input_color);
	}

	senior_deduction = getSeniorDeduction(filing_status, adjusted_gross_income, taxpayers_age, spouses_age);
}

function putOutput() {
	putUserOutput("TaxpayersAge",		taxpayers_age);
	putUserOutput("SpousesAge",			spouses_age);
	putUserOutput("SeniorDeduction",	senior_deduction);
}

function getInput() {
	tax_year				= getUserInput("TaxYear");
	filing_status			= getUserInput("FilingStatus",		"text");
	adjusted_gross_income	= getUserInput("AdjustedGrossIncome");
	taxpayers_birthday		= getUserInput("TaxpayersBirthday",	"text");
	taxpayers_age			= getUserInput("TaxpayersAge");
	spouses_birthday		= getUserInput("SpousesBirthday",	"text");
	spouses_age				= getUserInput("SpousesAge");

	senior_deduction		= 0;
}

function changeSpousesAge(event) {
	const spouses_age = getUserInput("SpousesAge");
	if (spouses_age !== 0)
		putUserOutput("SpousesBirthday", "");

	changeHandler(event);
}

function changeTaxpayersAge(event) {
	const taxpayers_age = getUserInput("TaxpayersAge");
	if (taxpayers_age !== 0)
		putUserOutput("TaxpayersBirthday", "");

	changeHandler(event);
}

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	turnOffDebug();
	getInput();
	calculateSeniorDeduction();
	putOutput();
	turnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	addListener("TaxYear",				"change", changeHandler);
	addListener("FilingStatus",			"change", changeHandler);
	addListener("AdjustedGrossIncome",	"change", changeHandler);
	addListener("TaxpayersBirthday",	"change", changeHandler);
	addListener("TaxpayersAge",			"change", changeTaxpayersAge);
	addListener("SpousesBirthday",		"change", changeHandler);
	addListener("SpousesAge",			"change", changeSpousesAge);

	output_color	= getCSSGlobalVariable("--output-color");
	input_color		= getCSSGlobalVariable("--input-color");

	changeHandler();
});
