
let tax_year				= 0;
let family_size				= 0;
let extra_sales_tax			= 0;
let total_sales_tax			= 0;	// Lookup on web.
let sales_tax_deduction		= 0;

async function calculateAmount() {
	let base_sales_tax		= 0;
	let local_sales_tax		= 0;
	let spendable_income	= 0;

	InitializeTaxTables("single", tax_year);
	
	family_size			= Limit(family_size, 1, 6);
	spendable_income	= getSpendableIncome();
	base_sales_tax		= getTaxValue("CA_BaseSalesTax");
	if (total_sales_tax > 0) {
		local_sales_tax = Max(total_sales_tax - base_sales_tax, 0);
	}

	sales_tax_deduction = salesTaxWorksheet(
								spendable_income,
								family_size,
								local_sales_tax,
								base_sales_tax,
								extra_sales_tax);
	
	putUserOutput("TotalSpendableIncome",	spendable_income);
	putUserOutput("SalesTaxDeduction",		sales_tax_deduction);
	
	putDebugOutput("Debug01", total_sales_tax,	"Total Sales Tax");
	putDebugOutput("Debug02", base_sales_tax,	"Base Sales Tax");
	putDebugOutput("Debug03", local_sales_tax,	"Local Sales Tax");
	putDebugOutput("Debug04", family_size,		"Family Size");
}

function getInputValues() {
	tax_year			= getUserInput("TaxYear");
	family_size			= getUserInput("FamilySize");
	extra_sales_tax		= getUserInput("ExtraSalesTax");
}

function getSpendableIncome() {
	return getUserInput("Wages") +
		getUserInput("TaxExemptInterest") +
		getUserInput("TaxableInterest") +
		getUserInput("QualifiedDividends") +
		getUserInput("OrdinaryDividends") +
		getUserInput("RetirementAccounts") +
		getUserInput("SocialSecurity") +
		getUserInput("CapitalGains") +
		getUserInput("SelfEmploymentIncome") +
		getUserInput("OtherIncome");
}

function salesTaxWorksheet(
	spendable_income,
	family_size,
	local_sales_tax,
	base_sales_tax,
	extra_sales_tax)
{
	let line_1 = 0;
	let line_2 = 0;
	let line_3 = 0;
	let line_4 = 0;
	let line_5 = 0;
	let line_6 = 0;
	let line_7 = 0;
	let line_8 = 0;
	
	line_1	= getSalesTaxDeduction(spendable_income, family_size);
	line_2	= 0;	// 0 for California
	if (local_sales_tax === 0) {
		line_6 = 0;
	} else {
		line_3	= local_sales_tax;
		if (line_2 === 0) {
			line_4	= base_sales_tax;
			line_5	= line_3 / line_4;
			line_6	= Round(line_1 * line_5);
		} else {
			line_6 = line_2 * line_3;
		}
	}
	line_7	= extra_sales_tax;
	line_8	= Round(line_1 + line_6 + line_7);
	
	putDebugOutput("Debug05", line_1,	"Line 1");
	putDebugOutput("Debug06", line_2,	"Line 2");
	putDebugOutput("Debug07", line_3,	"Line 3");
	putDebugOutput("Debug08", line_4,	"Line 4");
	putDebugOutput("Debug09", line_5,	"Line 5");
	putDebugOutput("Debug10", line_6,	"Line 6");
	putDebugOutput("Debug11", line_7,	"Line 7");
	putDebugOutput("Debug12", line_8,	"Line 8");

	return line_8;
}

async function changeAddressHandler(event) {
	const street_address	= getUserInput("StreetAddress",	"text");
	const city				= getUserInput("City",			"text");
	const zip_code			= getUserInput("ZipCode",		"text");

	total_sales_tax = 0;
	if (street_address && city && zip_code) {
		total_sales_tax = await fetchSalesTaxRate(street_address, city, zip_code);
	}
	
	changeHandler(event);
}

function changeHandler(event) {
	TurnOffDebug();
	getInputValues();
	calculateAmount();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	addListener("TaxYear",					"change", changeHandler);
	addListener("StreetAddress",			"change", changeAddressHandler);
	addListener("City",						"change", changeAddressHandler);
	addListener("ZipCode",					"change", changeAddressHandler);
	addListener("FamilySize",				"change", changeHandler);
	addListener("ExtraSalesTax",			"change", changeHandler);

	addListener("Wages",					"change", changeHandler);
	addListener("TaxExemptInterest",		"change", changeHandler);
	addListener("TaxableInterest",			"change", changeHandler);
	addListener("QualifiedDividends",		"change", changeHandler);
	addListener("OrdinaryDividends",		"change", changeHandler);
	addListener("RetirementAccounts",		"change", changeHandler);
	addListener("SocialSecurity",			"change", changeHandler);
	addListener("CapitalGains",				"change", changeHandler);
	addListener("SelfEmploymentIncome",		"change", changeHandler);
	addListener("OtherIncome",				"change", changeHandler);

	TurnOffDebug();
});
