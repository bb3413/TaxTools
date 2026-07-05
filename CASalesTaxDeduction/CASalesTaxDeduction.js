
import { Alert }				from "../Library/Classes/Alert.js";
import { Dates }				from "../Library/Classes/Dates.js";
import { Debug }				from "../Library/Classes/Debug.js";
import { fetchSalesTaxRate }	from "../Library/SalesTax/SalesTaxFromCDTFA.js";
import { Forms }				from "../Library/Classes/Forms.js";
import { HTML }					from "../Library/Classes/HTML.js";
import { Taxpayer }				from "../Library/Classes/Taxpayer.js";
import { TaxpayerForms }		from "../Library/Classes/TaxpayerForms.js";
import { TaxTable }				from "../Library/Classes/TaxTable.js";

let total_sales_tax			= 0;
let total_spendable_income	= 0;

async function changeAddressHandler(event) {
	const street_address	= HTML.getUserInput("StreetAddress",	"text");
	const city				= HTML.getUserInput("City",				"text");
	const zip_code			= HTML.getUserInput("ZipCode",			"text");

	total_sales_tax = 0;
	if (street_address && city && zip_code) {
		total_sales_tax = await fetchSalesTaxRate(street_address, city, zip_code);
	}

	changeHandler(event);
}

function changeHandler(event) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole deduction (not just the field tha was changed).
	//
	let taxpayer	= {};	// Object
	let tax_table	= {};	// Object
	let tax_data	= [];	// Array
	let inputs		= {};	// Object
	
	// Reset static (global) variables. This erases all information from a previous
	// calculation.
	Debug.reset();
	Forms.reset();
	Taxpayer.reset();
	
	inputs		= getInputs();
	tax_table	= TaxTable.getTaxTable(inputs.tax_year);	// Initialize tax tables; ignore return value.
	taxpayer	= createTaxpayer(inputs);					// Initialize taxpayer; ignore return value.
	tax_data	= mapInputValues(inputs);

	tax_data.loadForms();										// Load the taxpayer's data into tax forms.
	Forms.getForm("WS_SalesTax").calculate(total_sales_tax);
	putOutputs();

	// Forms.toConsole();										// Print all forms to the console.log().
	Debug.turnOn();
}

function createTaxpayer(inputs) {
	let taxpayer					= new Taxpayer();
	
	taxpayer.filing_status			= "Single";
	taxpayer.number_of_dependents	= inputs.family_size - 1;

	return taxpayer;
}

function getInputs() {
	//
	// Get the values from the web page. Put them in an object literal so the values
	// can be accessed by name.
	//
	let inputs = {};
	
	inputs.tax_year					= HTML.getUserInput("TaxYear");
	inputs.family_size				= HTML.getUserInput("FamilySize");
	inputs.extra_sales_tax			= HTML.getUserInput("ExtraSalesTax");

	inputs.wages					= HTML.getUserInput("Wages");
	inputs.tax_exempt_interest		= HTML.getUserInput("TaxExemptInterest");
	inputs.taxable_interest			= HTML.getUserInput("TaxableInterest");
	inputs.qualified_dividends		= HTML.getUserInput("QualifiedDividends");
	inputs.ordinary_dividends		= HTML.getUserInput("OrdinaryDividends");
	inputs.retirement_accounts		= HTML.getUserInput("RetirementAccounts");
	inputs.social_security			= HTML.getUserInput("SocialSecurity");
	inputs.capital_gains			= HTML.getUserInput("CapitalGains");
	inputs.self_employment_income	= HTML.getUserInput("SelfEmploymentIncome");
	inputs.other_income				= HTML.getUserInput("OtherIncome");
	
	total_spendable_income =		// Save for output.
		inputs.wages +
		inputs.tax_exempt_interest +
		inputs.taxable_interest +
		inputs.qualified_dividends +
		inputs.ordinary_dividends +
		inputs.retirement_accounts +
		inputs.social_security +
		inputs.capital_gains +
		inputs.self_employment_income + 
		inputs.other_income;

	return inputs;
}

function mapInputValues(inputs) {
	//
	// For each entry on the web page, figure out where it goes on the tax forms. Make a
	// list of the forms that are needed and the lines on those forms that need to be
	// initialized.
	//

	// Build an array with the tax forms entered by the taxpayer.
	let tax_data	= new TaxpayerForms();
	let f1040		= tax_data.addForm("F1040");
	let ws_salestax	= tax_data.addForm("WS_SalesTax");

	tax_data.addLine(ws_salestax,	"07",	inputs.extra_sales_tax,			);
	tax_data.addLine(f1040,			"01z",	inputs.wages,					);
	tax_data.addLine(f1040,			"02a",	inputs.tax_exempt_interest,		);
	tax_data.addLine(f1040,			"02b",	inputs.taxable_interest,		);
	tax_data.addLine(f1040,			"03a",	inputs.qualified_dividends,		);
	tax_data.addLine(f1040,			"03b",	inputs.ordinary_dividends,		);
	tax_data.addLine(f1040,			"04a",	inputs.retirement_accounts,		);
	tax_data.addLine(f1040,			"06a",	inputs.social_security,			);
	tax_data.addLine(f1040,			"07a",	inputs.capital_gains,			);
	tax_data.addLine(f1040,			"08",	inputs.self_employment_income + 
					 						inputs.other_income,			);
	return tax_data;
}

function putOutputs() {
	HTML.putUserOutput("TotalSpendableIncome",	total_spendable_income);
	HTML.putUserOutput("SalesTaxDeduction",		Forms.getValue("WS_SalesTax", "08"));
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	HTML.addListener("TaxYear",					"change", changeHandler);
	HTML.addListener("StreetAddress",			"change", changeAddressHandler);
	HTML.addListener("City",					"change", changeAddressHandler);
	HTML.addListener("ZipCode",					"change", changeAddressHandler);
	HTML.addListener("FamilySize",				"change", changeHandler);
	HTML.addListener("ExtraSalesTax",			"change", changeHandler);

	HTML.addListener("Wages",					"change", changeHandler);
	HTML.addListener("TaxExemptInterest",		"change", changeHandler);
	HTML.addListener("TaxableInterest",			"change", changeHandler);
	HTML.addListener("QualifiedDividends",		"change", changeHandler);
	HTML.addListener("OrdinaryDividends",		"change", changeHandler);
	HTML.addListener("RetirementAccounts",		"change", changeHandler);
	HTML.addListener("SocialSecurity",			"change", changeHandler);
	HTML.addListener("CapitalGains",			"change", changeHandler);
	HTML.addListener("SelfEmploymentIncome",	"change", changeHandler);
	HTML.addListener("OtherIncome",				"change", changeHandler);

	HTML.hideElement("DebugContainer");
});
