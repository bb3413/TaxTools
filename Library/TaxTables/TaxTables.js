
// Tax Tables Access
//
// This file provides a tax year indenendent way to access the information in
// the tax year specific tax tables.
//

let TT_values					= [];
let TT_amt_tax					= [];
let TT_income_tax_table			= [];
let TT_ltc_table				= [];
let TT_sales_tax_table			= [];
let TT_ca_income_tax_table		= [];

// Provide dummy functions in case the debugging code is not included.
globalThis.dbgEnter ??= () => {};
globalThis.dbgExit  ??= () => {};

function InitializeTaxTables(filing_status="single", tax_year=2025) {
	// Copy the tax year specific information to the generic variables.

	dbgEnter("InitializeTaxTables");
	
	switch (Number(tax_year)) {
		case 2026:
			TT_values					= TY26_values;
			TT_amt_tax					= TY26_amt_tax;
			TT_income_tax_table			= TY26_income_tax_table;
			TT_ltc_table				= TY26_ltc_table;
			TT_sales_tax_table			= TY26_sales_tax_table;
			TT_ca_income_tax_table		= TY26_ca_income_tax_table;
			break;

		case 2025:
			TT_values					= TY25_values;
			TT_amt_tax					= TY25_amt_tax;
			TT_income_tax_table			= TY25_income_tax_table;
			TT_ltc_table				= TY25_ltc_table;
			TT_sales_tax_table			= TY25_sales_tax_table;
			TT_ca_income_tax_table		= TY25_ca_income_tax_table;
			break;

		case 2024:
			TT_values					= TY24_values;
			TT_amt_tax					= TY24_amt_tax;
			TT_income_tax_table			= TY24_income_tax_table;
			TT_ltc_table				= TY24_ltc_table;
			TT_sales_tax_table			= TY24_sales_tax_table;
			TT_ca_income_tax_table		= TY24_ca_income_tax_table;
			break;
			
		default:
			alert("Invalid tax year: " + tax_year);
			break;
	}

	dbgExit("InitializeTaxTables");
}

function getBusinessMileageDeduction(miles) {
	return Round(miles * getTaxValue("BusinessMileage"));
}

function getIncomeTaxFromTable(filing_status, income) {
	dbgEnter("getIncomeTaxFromTable");
	// Note: there is another function named getIncomeTax() in
	// Library/IncomeTax/IncomeTax.js.
	//
	// Find the tax baracket for the filing status and income, then compute
	// the tax:
	//
	//		((income - start_of_bracket) * tax_rate) + cumulative_tax
	//
	let tax  = 0;
	for (let row = 0; row < TT_income_tax_table.length; row++) {
		if (strCaseEqual(filing_status, TT_income_tax_table[row][0]) &&
				income > TT_income_tax_table[row][1] &&
				income <= TT_income_tax_table[row][2]) {
			
			let start_of_bracket = TT_income_tax_table[row][1];
			let tax_rate = TT_income_tax_table[row][3] / 100;	// Convert to percent
			let cumulative_tax = TT_cumulativeTax(TT_income_tax_table, row);
			
			tax = ((income - start_of_bracket) * tax_rate) + cumulative_tax;
			break;
		}
	}
	
	dbgExit("getIncomeTaxFromTable");
	return tax;
}

function getMaxLTC(age) {
	// The medical deduction for long term care (LTC) premiums is restricted by
	// age. Return the maximum LTC premium the taxpayer can deduct.
	
	for (let row = 0; row < TT_ltc_table.length; row++) {
		if (age >= TT_ltc_table[row][0]) {
			return TT_ltc_table[row][1];
		}
	}
	
	return 0;
}

function getMedicalMileageDeduction(miles) {
	return Round(miles * getTaxValue("MedicalMileage"));
}

function getSalesTaxDeduction(agi, familySize) {
	dbgEnter("getSalesTaxDeduction");
	
	familySize = Limit(familySize, 1, 6);
	
	let deduction	= 0;
	let col			= familySize + 1;
	
	for (let row = 0; row < TT_sales_tax_table.length; row++) {
		if (agi > TT_sales_tax_table[row][0] &&
			agi <= TT_sales_tax_table[row][1]) {
			
			deduction = TT_sales_tax_table[row][col];
			break;
		}
	}

	dbgExit("getSalesTaxDeduction");
	return deduction;
}

function getSeniorDeduction(
	filing_status,
	agi,
	taxpayers_age				= 0,
	spouses_age					= 0)
{
	let senior_deduction		= 0;
	let deduction				= 0
	let limit					= 0;
	let excess					= 0;
	const max_senior_deduction	= getTaxValue("MaxSeniorDeduction", filing_status);
	const phase_out_start		= getTaxValue("SeniorDeductionPhaseOut", filing_status);

	dbgEnter("getSeniorDeduction");
		
	excess = Max(0, agi - phase_out_start);
	deduction = Round(Max(0, max_senior_deduction - (excess * 0.06)));
		
	if (taxpayers_age >= 65) {
		senior_deduction = deduction;
	}

	if (strCaseEqual(filing_status, "MFJ")) {
		if (spouses_age >= 65) {
			senior_deduction += deduction;
		}
	}
	
	dbgExit("getSeniorDeduction");
	return senior_deduction;
}

function getStandardDeduction(
	filing_status		= "Single",
	taxpayers_age		= 0,
	spouses_age			= 0,
	taxpayer_is_blind	= false,
	spouse_is_blind		= false)
{
	dbgEnter("getStandardDeduction");

	let std_deduction		= getTaxValue("StandardDeduction", filing_status)
	let std_deduction_extra	= getTaxValue("StandardDeductionEXtra", filing_status)
	
	if (taxpayers_age >= 65)
		std_deduction += std_deduction_extra;
	if (taxpayer_is_blind)
		std_deduction += std_deduction_extra;
		
	if (strCaseEqual(filing_status, "MFJ")) {
		if (spouses_age >= 65)
			std_deduction += std_deduction_extra;
		if (spouse_is_blind)
			std_deduction += std_deduction_extra;
	}

	dbgExit("getStandardDeduction");
	return std_deduction;
}

function getTaxValue(name, filing_status = "Single") {
	dbgEnter("getTaxValue");
	
	let value = -1;
	
	// Limit table columns
	let fs = 1;
	switch (strDownshift(filing_status)) {
		case "single":	fs = 1; break;
		case "hoh":		fs = 2; break;
		case "mfj":		fs = 3; break;
		case "qss":		fs = 4; break;
		case "mfs":		fs = 5; break;
	}
	
	for (let row = 0; row < TT_values.length; row++) {
		if (strCaseEqual(name, TT_values[row][0])) {
			value = TT_values[row][fs];
			break;
		}
	}
	
	if (value === -1) {
		alert("Invalid tax value: " + name);
		return;
	}

	dbgExit("getTaxValue");
	return value;
}

function get_AMT_Exemption(filing_status, amt_income) {
	dbgEnter("get_AMT_Exemption");
	
	let exemption	= getTaxValue("AMT_Exemption", filing_status);
	let phase_out	= getTaxValue("AMT_ExemptionPhaseOut", filing_status);;
	let excess		= 0;
	
	if (amt_income > phase_out) {
		excess = Round((amt_income - phase_out) * 0.25);
	}

	dbgExit("get_AMT_Exemption");
	return Max(0, exemption - excess);
}

function get_AMT_Tax(filing_status, income) {
	dbgEnter("get_AMT_Tax");

	let tax = 0;
	for (let row = 0; row < TT_amt_tax.length; row++) {
		if (strCaseEqual(filing_status, TT_amt_tax[row][0]) &&
				income > TT_amt_tax[row][1] &&
				income <= TT_amt_tax[row][2]) {
			
			let tax_rate = TT_amt_tax[row][4] / 100;	// Convert to percent
			let subtract = TT_amt_tax[row][3];
			
			tax = (income * tax_rate) - subtract;
			break;
		}
	}

	dbgExit("get_AMT_Tax");
	return tax;
}

function get_CA_Exemption(
	filing_status		= "Single",
	taxpayers_age		= 0,
	spouses_age			= 0,
	taxpayer_is_blind	= false,
	spouse_is_blind		= false,
	num_dependents		= 0)
{
	dbgEnter("get_CA_Exemption");
	
	const personal_exemption	= getTaxValue("CA_PersonalExemption");
	const dependent_exemption	= getTaxValue("CA_DependentExemption");
	
	const exemption = personal_exemption;		// One exemption for the taxpayer.
	if (taxpayers_age >= 65)
		exemption += personal_exemption;
	if (taxpayer_is_blind)
		exemption += personal_exemption;
		
	if (strCaseEqual(filing_status, "MFJ")) {
		exemption += personal_exemption;		// One exemption for the spouse.
		if (spouses_age >= 65)
			exemption += personal_exemption;
		if (spouse_is_blind)
			exemption += personal_exemption;
	}
	
 	exemption += num_dependents * dependent_exemption;

	dbgExit("get_CA_Exemption");
	return exemption;
}

function get_CA_IncomeTax(filing_status, income) {
	// Find the tax baracket for the filing status and income, then compute
	// the tax:
	//
	//		((income - start_of_bracket) * tax_rate) + cumulative_tax
	//

	dbgEnter("get_CA_IncomeTax");
	
	// Single and MFS are the same. MFJ and QSS are the same.
	switch (strDownshift(filing_status)) {
		case "qss":
			filing_status	= "MFJ";
			break;
		case "mfs":
			filing_status	= "Single";
			break;
	}
	
	let tax = 0;
	
	for (let row = 0; row < TT_ca_income_tax_table.length; row++) {
		if (strCaseEqual(filing_status, TT_ca_income_tax_table[row][0]) &&
				income > TT_ca_income_tax_table[row][1] &&
				income <= TT_ca_income_tax_table[row][2]) {
			
			let start_of_bracket = TT_ca_income_tax_table[row][1];
			let tax_rate = TT_ca_income_tax_table[row][3] / 100;	// Convert to percent
			let cumulative_tax = TT_cumulativeTax(TT_ca_income_tax_table, row);
			
			tax = ((income - start_of_bracket) * tax_rate) + cumulative_tax;
			break;
		}
	}

	dbgExit("get_CA_IncomeTax");
	return Round(tax);
}

function get_CA_StandardDeduction(filing_status) {
	return getTaxValue("CA_StandardDeduction", filing_status);
}

function get_CapGains_15_Start(filing_status) {
	return getTaxValue("CG_15PercentRangeStart", filing_status);
}

function get_CapGains_20_Start(filing_status) {
	return getTaxValue("CG_20PercentRangeStart", filing_status);
}

function get_SS_Start50(filing_status) {
	return getTaxValue("SS_50PercentRangeStart", filing_status);
}

function get_SS_Start50Range(filing_status) {
	return getTaxValue("SS_50PercentRangeLength", filing_status);
}

function isValidTaxYear(tax_year) {
	switch (Number(tax_year)) {
		case 2026:
		case 2025:
		case 2024:
			return true;
			break;
		default:
			return false;
			break;
	}
}

function TT_cumulativeTax(table, curr_row) {
	// This function calculates the cumulative income tax for the pevious tax brackets.
	// The table is constructed with each tax bracket in a separate row. The state and
	// federal income tax tables are laid out the same so this function works for both
	// of them.

	let start_row			= curr_row;
	let	start_of_bracket	= 0;
	let end_of_bracket		= 0;
	let rate				= 0;
	let total				= 0;

	dbgEnter("TT_cumulativeTax");

	// Scan for the bracket that starts at $0.
	while ((start_row > 0) && (table[start_row][1] != 0)) {
		--start_row;
	}

	for (let row = start_row; row < curr_row; row++) {
		start_of_bracket	= table[row][1];
		end_of_bracket		= table[row][2];
		rate				= table[row][3] / 100;	// Convert to percent
		total += Round((end_of_bracket - start_of_bracket) * rate);
	}

	dbgExit("TT_cumulativeTax");
	return total;
}
