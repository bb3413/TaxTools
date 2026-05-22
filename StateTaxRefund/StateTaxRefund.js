
let previous_tax_year			= 0;
let filing_status				= 0;
let taxpayers_birthday			= 0;
let spouses_birthday			= 0;
let taxpayer_is_blind			= false;
let spouse_is_blind				= false;
let state_tax_refund			= 0;
	
// Information from last year
let state_income_tax			= 0;
let sales_tax					= 0;
let sales_tax_used				= 0;
let real_estate_taxes			= 0;
let personal_property_taxes 	= 0;
let itemized_deductions			= 0;

// Output fields
let taxable_amount				= 0;
let explanation					= "";

// Debugging fields
let standard_deduction			= 0;
let salt_with_income_tax		= 0;
let salt_with_sales_tax			= 0;
let line_5d						= 0;
let line_5e						= 0;
let line_1						= 0;
let line_2						= 0;
let line_3						= 0;
let line_4						= 0;
let line_5						= 0;
let line_6						= 0;
let line_7						= 0;
let line_8						= 0;
let line_9						= 0;

function CalculateTaxableAmount() {
	let end_of_year				= 0;
	let taxpayers_age			= 0;
	let spouses_age				= 0;
	let max_salt				= 0;
	
	InitializeTaxTables(filing_status, previous_tax_year);
	
	end_of_year				= new Date("12/31/" + previous_tax_year);
	taxpayers_age			= Age(taxpayers_birthday, end_of_year);
	spouses_age				= Age(spouses_birthday, end_of_year);
	max_salt				= getTaxValue("MaxSALT");

	standard_deduction		= getStandardDeduction(
									filing_status,
									taxpayers_age, spouses_age,
									taxpayer_is_blind, spouse_is_blind);

	if (state_tax_refund === 0) {
		taxable_amount		= 0;
		explanation			= "Tax refund is $0.";
		return;
	}

	if (state_income_tax === 0) {
		taxable_amount		= 0;
		explanation			= "State income tax is $0; state income tax was not used as a deduction.";
		return;
	}

	if (sales_tax_used) {
		taxable_amount		= 0;
		explanation			= "State income tax was not used as a deduction.";
		return;
	}

	if (sales_tax >= state_income_tax) {
		taxable_amount		= 0;
		explanation			= "Sales tax is greater that state income tax; sales tax could have " +
								"used instead of state income tax for the same or better result.";
		return;
	}

	salt_with_income_tax	= Min(state_income_tax + real_estate_taxes + personal_property_taxes, max_salt);
	salt_with_sales_tax		= Min(sales_tax + real_estate_taxes + personal_property_taxes, max_salt);
	
	if (salt_with_sales_tax >= salt_with_income_tax) {
		taxable_amount		= 0;
		explanation			= "Sales tax could have used instead of state income tax for the " +
								"same or better result";
		return;
	}

	line_5d		= state_income_tax + real_estate_taxes + personal_property_taxes;
	line_5e		= Min(line_5d, max_salt);
	
	Worksheet(
		filing_status,
		taxpayers_age,
		spouses_age,
		taxpayer_is_blind,
		spouse_is_blind,
		state_tax_refund,
		line_5d,
		line_5e,
		itemized_deductions);
	
	return;
}

function Worksheet(
	filing_status,
	taxpayers_age,
	spouses_age,
	taxpayer_is_blind,
	spouse_is_blind,
	refund,
	sched_a_5d,		// Total SALT
	sched_a_5e,		// Limited SALT
	itemized_deductions) {

	//
	// Compute the taxable portion of the state income tax refund.
	//
	// IRS Publication: 1040 Instructions, see section Additional Income, Line 1.
	// State and Local Income Tax Refund Worksheet—Schedule 1, Line 1
	//
	
	// When filing MFS, if one spouse itemizes then the other spouse is required to itemize as well. Since
	// it is only necessary to determine if a tax refund is taxable if the taxpayer itemized, we can assume
	// that if the filing status is MFS, the taxpayer is required to itemize.
	let spouse_itemized = true;
	
	line_1 = refund;						// Income tax refund from 1099-G
	if (sched_a_5d > sched_a_5e) {			// Total taxes > Taxes limited SALT cap
		// Limited by SALT cap
		line_2 = sched_a_5d - sched_a_5e;	// Amount of taxes limited by SALT cap
		
		if (line_1 > line_2) {
			line_3	= line_1 - line_2;		// Amount of refund not covered by excess SALT.
			explanation			= "Part of refund is less than the amount of the state and local taxes " +
									"that are over the SALT cap. The remainder of the refund is taxable.";
		} else {
			taxable_amount		= 0;
			explanation			= "All of refund is less than the amount of state and local taxes " +
									"that are over the SALT cap. The refund is not taxable.";
			return;
		}
	} else {
		// Not limited by SALT cap
		line_3 = line_1;
		explanation				= "The state and local taxes are not limited by the SALT cap. " +
									"The refund is taxable.";
	}
	
	line_4 = itemized_deductions;
	if (strCaseEqual(filing_status, "MFS") && spouse_itemized) {
		line_8 = line_4;
	} else {
		line_5	= 0;	// Get base standard deduction
		line_6	= 0;	// Get extra standard deduction
		line_7	= getStandardDeduction(filing_status,
							taxpayers_age, spouses_age,
							taxpayer_is_blind, spouse_is_blind);
		if (line_7 < line_4) {
			line_8	= line_4 - line_7;	// Itemized deductions - standard deduction
		} else {
			taxable_amount		= 0;
			explanation			= "Itemized deductions were less than the standard deduction. The " +
									"taxpayer could have used the standard deduction.";
			return;
		}
	}
	
	if (line_8 < line_3) {	// Itemized deductions - standard deduction < taxable part of refund?
		line_9 = line_8;
		explanation			= "Taxable part of refund was greater than the difference between itemized " +
								"and standard deductions, so taxable amount is limited to that difference.";
	} else {
		line_9 = line_3;
		// Line =_3 explanation was set above.
	}
	
	taxable_amount = line_9;
	return;
}

function GetInputValues() {
	previous_tax_year					= getUserInput("PreviousTaxYear");
	filing_status						= getUserInput("FilingStatus",		"text");
	taxpayers_birthday					= getUserInput("TaxpayersBirthday",	"text");
	taxpayer_is_blind					= getUserInput("TaxpayerIsBlind");
	state_tax_refund					= getUserInput("StateTaxRefund");
	spouses_birthday					= getUserInput("SpousesBirthday",	"text");
	spouse_is_blind						= getUserInput("SpouseIsBlind");
	
	// Information from last year
	state_income_tax					= getUserInput("StateIncomeTax");
	sales_tax							= getUserInput("SalesTax");
	sales_tax_used						= getUserInput("SalesTaxUsed");
	real_estate_taxes					= getUserInput("RealEstateTaxes");
	personal_property_taxes 			= getUserInput("PersonalPropertyTaxes");
	itemized_deductions					= getUserInput("ItemizedDeductions");
	
	// Output fields
	taxable_amount						= 0;
	explanation							= "";

	// Debugging fields
	standard_deduction					= 0;
	salt_with_income_tax				= 0;
	salt_with_sales_tax					= 0;
	line_5d								= 0;
	line_5e								= 0;
	line_1								= 0;
	line_2								= 0;
	line_3								= 0;
	line_4								= 0;
	line_5								= 0;
	line_6								= 0;
	line_7								= 0;
	line_8								= 0;
	line_9								= 0;
}

function PutResults() {
	putUserOutput("TaxableAmount",	taxable_amount);
	putUserOutput("Explanation",	explanation,	"text");
	
	putDebugOutput("Debug01", standard_deduction, 	"Standard Deduction");
	putDebugOutput("Debug02", salt_with_income_tax,	"State and Local Taxes using Income Tax");
	putDebugOutput("Debug03", salt_with_sales_tax,	"State and Local Taxes using Sales Tax");
	putDebugOutput("Debug04", line_5d,				"Line 5d");
	putDebugOutput("Debug05", line_5e,				"Line 5e");
	putDebugOutput("Debug06", line_1,				"Line 1");
	putDebugOutput("Debug07", line_2,				"Line 2");
	putDebugOutput("Debug08", line_3,				"Line 3");
	putDebugOutput("Debug09", line_4,				"Line 4");
	putDebugOutput("Debug10", line_5,				"Line 5");
	putDebugOutput("Debug10", line_6,				"Line 6");
	putDebugOutput("Debug10", line_7,				"Line 7");
	putDebugOutput("Debug10", line_8,				"Line 8");
	putDebugOutput("Debug10", line_9,				"Line 9");
}

function ChangeHandler(event) {
	// This is the function that is called if any input field is changed.
	TurnOffDebug();
	GetInputValues();
	CalculateTaxableAmount();
	PutResults();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	addListener("PreviousTaxYear",			"change", ChangeHandler);
	addListener("FilingStatus",				"change", ChangeHandler);
	addListener("TaxpayersBirthday",		"change", ChangeHandler);
	addListener("SpousesBirthday",			"change", ChangeHandler);
	addListener("TaxpayerIsBlind",			"change", ChangeHandler);
	addListener("SpouseIsBlind",			"change", ChangeHandler);
	addListener("StateTaxRefund",			"change", ChangeHandler);

	// Information from last year
	addListener("StateIncomeTax",			"change", ChangeHandler);
	addListener("SalesTax",					"change", ChangeHandler);
	addListener("SalesTaxUsed",				"change", ChangeHandler);
	addListener("RealEstateTaxes",			"change", ChangeHandler);
	addListener("PersonalPropertyTaxes",	"change", ChangeHandler);
	addListener("ItemizedDeductions",		"change", ChangeHandler);
	
	ChangeHandler();
});