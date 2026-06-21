
import { getAge }							from "../Library/Dates.js";
import { getTaxYear }						from "../Library/Dates.js";
import { dbgEnter, dbgExit, dbgLog }		from "../Library/Debug.js";
import { putDebugOutput }					from "../Library/Debug.js";
import { turnOffDebug, turnOnDebug }		from "../Library/Debug.js";
import { addListener }						from "../Library/HTML.js";
import { getUserInput, putUserOutput }		from "../Library/HTML.js";
import { getElementValue, putElementValue }	from "../Library/HTML.js";
import { min, max, round }					from "../Library/Numbers.js";
import { strCaseEqual }						from "../Library/Strings.js";
import { Persistence }						from "../Library/Classes/Persistence.js";

// This object maps the HTML element IDs for the input and output fields with the form and line
// number where they are entered or found in the tax return.
let name_to_field = {
	// Estimated Tax Calculation
	"TotalIncome":						{"F1040":	"9"},
	"Adjustments":						{"F1040":	"10"},
	"AdjustedGrossIncome":				{"F1040":	"11"},
	"Deductions":						{"F1040":	"12"},
	"TaxableIncome":					{"F1040":	"15"},
	"TaxOnTaxableIncome":				{"F1040":	"16"},
	"TotalOtherTaxes":					{"F1040":	"23"},
	"NonrefundableCredits":				{"F1040":	"20"},
	"TotalTax":							{"F1040":	"24"},
	"RefundableCredits":				{"F1040":	"32"},
	"Payments":							{"F1040":	"25"},
	"AmountDue":						{"F1040":	"34"},

	// Income
	"Wages":							{"F1040":	"1z"},
	"TaxExemptInterest":				{"F1040":	"2a"},
	"TaxableInterest":					{"F1040":	"2b"},
	"QualifiedDividends":				{"F1040":	"3a"},
	"OrdinaryDividends":				{"F1040":	"3b"},
	"RetirementAccounts":				{"F1040":	"4b"},
	"SocialSecurity":					{"F1040":	"6a"},
	"CapitalGains":						{"F1040":	"7a"},
	"SelfEmploymentIncome":				{"F1040":	"7"},
	"OtherIncome":						{"F1040":	"8"},

	//Other Taxes
	"SelfEmploymentTax":				{"F1040S2":	"4"},
	"EarlyWithdrawalTax":				{"F1040S2":	"8"},
	"OtherTaxes":						{"F1040":	"23"},

	// Adjustments
	"EducatorExpenses":					{"F1040S1":	"11"},
	"HealthSavingsAccount":				{"F1040S1":	"13"},
	"SelfEmploymentTaxAdjustment":		{"F1040S1":	"15"},
	"SelfEmployedHealthInsurance":		{"F1040S1":	"17"},
	"EarlyWithdrawalPenalty":			{"F1040S1":	"18"},
	"AlimonyPaid":						{"F1040S1":	"19"},
	"IRAContributions":					{"F1040S1":	"20"},
	"StudentLoanInterest":				{"F1040S1":	"21"},
	"OtherAdjustments":					{"F1040S1":	"25"},

	// Deductions (non-itemized)
	"QualifiedBusinessIncomeDeduction":	{"F1040":	"13a"},
	"QualifiedTipsDeduction":			{"F1040S1A":"13"},
	"QualifiedOvertimeDeduction":		{"F1040S1A":"21"},
	"CarLoanInterestDeduction":			{"F1040S1A":"30"},
	"SeniorDeduction":					{"F1040S1A":"37"},

	// Deductions
	"MedicalInsurance":					{"F1040SA":	"1"},
	"DoctorVisits":						{"F1040SA":	"1"},
	"PrescriptionDrugs":				{"F1040SA":	"1"},
	"MedicalAids":						{"F1040SA":	"1"},
	"LTCTaxpayer":						{"F1040SA":	"1"},
	"LTCSpouse":						{"F1040SA":	"1"},
	"MedicalMiles":						{"F1040SA":	"1"},
	"OtherMedicalExpenses":				{"F1040SA":	"1"},
	"StateIncomeTax":					{"F1040SA":	"5a"},
	"SalesTax":							{"F1040SA":	"5a"},
	"RealEstatePropertyTax":			{"F1040SA":	"5b"},
	"PersonalPropertyTax":				{"F1040SA":	"5c"},
	"MortgageInterest":					{"F1040SA":	"10"},
	"CashGiftsToCharity":				{"F1040SA":	"11"},
	"NoncashGiftsToCharity":			{"F1040S1A":"10"},

	// Non-refundable Credits
	"AmericanOppCreditNoRefund":		{"F1040S3":	"3"},
	"ChildCareCredit":					{"F1040":	"19"},
	"ChildTaxCredit":					{"F1040S3":	"2"},
	"ForeignTaxCredit":					{"F1040S3":	"1"},
	"LifetimeLearningCredit":			{"F1040S3":	"3"},
	"ResidentialEnergyCredit":			{"F1040S3":	"5"},
	"RetirementSavingsCredit":			{"F1040S3":	"4"},
	"OtherNonrefundableCredits":		{"F1040S3":	"6"},

	// Refundable Credits
	"AmericanOppCreditRefundable":		{"F1040S3":	"3"},
	"CreditForOtherDependents":			{"F1040":	"19"},
	"EarnedIncomeCredit":				{"F1040":	"27"},
	"PremiumTaxCredit":					{"F1040S3":	"9"},
	"OtherRefundableCredits":			{"F1040S3":	"13"},

	// Payments
	"Withholding":						{"F1040":	"25d"},
	"EstimatedTaxPaid":					{"F1040":	"26"},
 }

let inputs		= {};
let outputs		= {};

function calculateTax() {
}

function getInputs() {
	let inputs = {};
	
	inputs.tax_year								= getUserInput("TaxYear");

	// Taxpayer Information
	inputs.taxpayers_name						= getUserInput("TaxpayersName",		"text");
	inputs.filing_status						= getUserInput("FilingStatus",		"text");
	inputs.taxpayers_birthday					= getUserInput("TaxpayersBirthday",	"text");
	inputs.spouses_birthday						= getUserInput("SpousesBirthday",	"text");

	// Income
	inputs.wages								= getUserInput("Wages");
	inputs.tax_exempt_interest					= getUserInput("TaxExemptInterest");
	inputs.taxable_interest						= getUserInput("TaxableInterest");
	inputs.qualified_dividends					= getUserInput("QualifiedDividends");
	inputs.ordinary_dividends					= getUserInput("OrdinaryDividends");
	inputs.retirement_accounts					= getUserInput("RetirementAccounts");
	inputs.social_security						= getUserInput("SocialSecurity");
	inputs.capital_gains						= getUserInput("CapitalGains");
	inputs.self_employment_income				= getUserInput("SelfEmploymentIncome");
	inputs.other_income							= getUserInput("OtherIncome");

	// Other Taxes
	inputs.self_employment_tax					= getUserInput("SelfEmploymentTax");
	inputs.early_withdrawal_tax					= getUserInput("EarlyWithdrawalTax");
	inputs.other_taxes							= getUserInput("OtherTaxes");

	// Adjustments
	inputs.educator_expenses					= getUserInput("EducatorExpenses");
	inputs.health_savings_account				= getUserInput("HealthSavingsAccount");
	inputs.self_employment_tax_adjustment		= getUserInput("SelfEmploymentTaxAdjustment");
	inputs.self_employed_health_insurance		= getUserInput("SelfEmployedHealthInsurance");
	inputs.early_withdrawal_penalty				= getUserInput("EarlyWithdrawalPenalty");
	inputs.alimony_paid							= getUserInput("AlimonyPaid");
	inputs.ira_contributions					= getUserInput("IRAContributions");
	inputs.student_loan_interest				= getUserInput("StudentLoanInterest");
	inputs.other_adjustments					= getUserInput("OtherAdjustments");

	// Deductions (non-itemized)
	inputs.qualified_business_income_deduction	= getUserInput("QualifiedBusinessIncomeDeduction");
	inputs.qualified_tips_deduction				= getUserInput("QualifiedTipsDeduction");
	inputs.qualified_overtime_deduction			= getUserInput("QualifiedOvertimeDeduction");
	inputs.car_loan_interest_deduction			= getUserInput("CarLoanInterestDeduction");
	inputs.senior_deduction						= getUserInput("SeniorDeduction");

	// Deductions (itemized)
	inputs.medical_insurance					= getUserInput("MedicalInsurance");
	inputs.doctor_visits						= getUserInput("DoctorVisits");
	inputs.prescription_drugs					= getUserInput("PrescriptionDrugs");
	inputs.medical_aids							= getUserInput("MedicalAids");
	inputs.other_medical_expenses				= getUserInput("OtherMedicalExpenses");
	inputs.ltc_taxpayer							= getUserInput("LTCTaxpayer");
	inputs.ltc_spouse							= getUserInput("LTCSpouse");
	inputs.medical_miles						= getUserInput("MedicalMiles");
	inputs.state_income_tax						= getUserInput("StateIncomeTax");
	inputs.sales_tax							= getUserInput("SalesTax");
	inputs.real_estate_property_tax				= getUserInput("RealEstatePropertyTax");
	inputs.personal_property_tax				= getUserInput("PersonalPropertyTax");
	inputs.mortgage_interest					= getUserInput("MortgageInterest");
	inputs.cash_gifts_to_charity				= getUserInput("CashGiftsToCharity");
	inputs.noncash_gifts_to_charity				= getUserInput("NoncashGiftsToCharity");
	inputs.qualified_charitable_distribution	= getUserInput("QualifiedCharitableDistribution");

	// Non-redundable Credits
	inputs.american_opp_credit_no_refund		= getUserInput("AmericanOppCreditNoRefund");
	inputs.child_care_credit					= getUserInput("ChildCareCredit");
	inputs.child_tax_credit						= getUserInput("ChildTaxCredit");
	inputs.foreign_tax_credit					= getUserInput("ForeignTaxCredit");
	inputs.lifetime_learning_credit				= getUserInput("LifetimeLearningCredit");
	inputs.residential_energy_credit			= getUserInput("ResidentialEnergyCredit");
	inputs.retirement_savings_credit			= getUserInput("RetirementSavingsCredit");
	inputs.other_nonrefundable_credits			= getUserInput("OtherNonrefundableCredits");

	// Refundable Credits
	inputs.american_opp_credit_refundable		= getUserInput("AmericanOppCreditRefundable");
	inputs.credit_for_other_dependents			= getUserInput("CreditForOtherDependents");
	inputs.earned_income_credit					= getUserInput("EarnedIncomeCredit");
	inputs.premium_tax_credit					= getUserInput("PremiumTaxCredit");
	inputs.other_refundable_credits				= getUserInput("OtherRefundableCredits");

	// Payments
	inputs.withholding							= getUserInput("Withholding");
	inputs.estimated_tax_paid					= getUserInput("EstimatedTaxPaid");

	return inputs;
}

function putOutputs(outputs) {
	putUserOutput("TodaysDate",					outputs.todays_date, "text");
	putUserOutput("TaxpayersAge",				outputs.taxpayers_age);
	putUserOutput("SpousesAge",					outputs.spouses_age);

	// Estimated Tax
	putUserOutput("TotalIncome",				outputs.total_income);
	putUserOutput("Adjustments",				outputs.adjustments);
	putUserOutput("AdjustedGrossIncome",		outputs.adjusted_gross_income);
	putUserOutput("Deductions",					outputs.deductions);
	putUserOutput("TaxableIncome",				outputs.taxable_income);
	putUserOutput("TaxOnTaxableIncome",			outputs.tax_on_taxable_income);
	putUserOutput("TotalOtherTaxes",			outputs.total_other_taxes);
	putUserOutput("TotalTax",					outputs.total_tax);
	putUserOutput("NonrefundableCredits",		outputs.nonrefundable_credits);
	putUserOutput("RefundableCredits", 			outputs.refundable_credits);
	putUserOutput("Payments", 					outputs.payments);
	putUserOutput("AmountDue",					outputs.amount_due);
	putUserOutput("EstimatedTax",				outputs.estimated_tax);
}

function restoreUserData(event) {
	// The file selection dialog gets a list of files, but only one should be passed
	// in our case; select the first file and ignore the rest.
	const filename = event.target.files[0];
	if (!filename) {
		alert("No file selected.");
		return;
	}
	let data = {
		version:		"",
		output_data:	{},
		input_data:		{},
	};
	
	data	= Persistence.restoreFromFile(filename);
	let ud	= data.input_data;
	
	// Restore the input fields
	putElementValue("TaxYear",							ud.tax_year);

	// Taxpayer Information
	putElementValue("TaxpayersName",					ud.taxpayers_name);
	putElementValue("FilingStatus",						ud.filing_status);
	putElementValue("TaxpayersBirthday",				ud.taxpayers_birthday);
	putElementValue("SpousesBirthday",					ud.spouses_birthday);

	// Income
	putElementValue("TaxExemptInterest",				ud.tax_exempt_interest);
	putElementValue("Wages",							ud.wages);
	putElementValue("TaxableInterest",					ud.taxable_interest);
	putElementValue("QualifiedDividends",				ud.qualified_dividends);
	putElementValue("OrdinaryDividends",				ud.ordinary_dividends);
	putElementValue("RetirementAccounts",				ud.retirement_accounts);
	putElementValue("SocialSecurity",					ud.social_security);
	putElementValue("CapitalGains",						ud.capital_gains);
	putElementValue("SelfEmploymentIncome",				ud.self_employment_income);
	putElementValue("OtherIncome",						ud.other_income);

	// Other Taxes
	putElementValue("SelfEmploymentTax",				ud.self_employment_tax);
	putElementValue("EarlyWithdrawalTax",				ud.early_withdrawal_tax);
	putElementValue("OtherTaxes",						ud.other_taxes);

	// Adjustments
	putElementValue("EducatorExpenses",					ud.educator_expenses);
	putElementValue("HealthSavingsAccount",				ud.health_savings_account);
	putElementValue("SelfEmploymentTaxAdjustment",		ud.self_employment_tax_adjustment);
	putElementValue("SelfEmployedHealthInsurance",		ud.self_employed_health_insurance);
	putElementValue("EarlyWithdrawalPenalty",			ud.early_withdrawal_penalty);
	putElementValue("AlimonyPaid",						ud.alimony_paid);
	putElementValue("IRAContributions",					ud.ira_contributions);
	putElementValue("StudentLoanInterest",				ud.student_loan_interest);
	putElementValue("OtherAdjustments",					ud.other_adjustments);

	// Deductions (non-itemized)
	putElementValue("QualifiedBusinessIncomeDeduction",	ud.qualified_business_income_deduction);
	putElementValue("QualifiedTipsDeduction",			ud.qualified_tips_deduction);
	putElementValue("QualifiedOvertimeDeduction",		ud.qualified_overtime_deduction);
	putElementValue("CarLoanInterestDeduction",			ud.car_loan_interest_deduction);
	putElementValue("SeniorDeduction",					ud.senior_deduction);

	// Deductions (itemized)
	putElementValue("MedicalInsurance",					ud.medical_insurance);
	putElementValue("DoctorVisits",						ud.doctor_visits);
	putElementValue("PrescriptionDrugs",				ud.prescription_drugs);
	putElementValue("MedicalAids",						ud.medical_aids);
	putElementValue("LTCTaxpayer",						ud.ltc_taxpayer);
	putElementValue("LTCSpouse",						ud.ltc_spouse);
	putElementValue("MedicalMiles",						ud.medical_miles);
	putElementValue("OtherMedicalExpenses",				ud.other_medical_expenses);
	putElementValue("StateIncomeTax",					ud.state_income_tax);
	putElementValue("SalesTax",							ud.sales_tax);
	putElementValue("RealEstatePropertyTax",			ud.real_estate_property_tax);
	putElementValue("PersonalPropertyTax",				ud.personal_property_tax);
	putElementValue("MortgageInterest",					ud.mortgage_interest);
	putElementValue("CashGiftsToCharity",				ud.cash_gifts_to_charity);
	putElementValue("NoncashGiftsToCharity",			ud.noncash_gifts_to_charity);
	putElementValue("QualifiedCharitableDistribution",	ud.qualified_charitable_distribution);

	// Non-redundable Credits
	putElementValue("AmericanOppCreditNoRefund",		ud.american_opp_credit_no_refund);
	putElementValue("ChildCareCredit",					ud.child_care_credit);
	putElementValue("ChildTaxCredit",					ud.child_tax_credit);
	putElementValue("ForeignTaxCredit",					ud.foreign_tax_credit);
	putElementValue("LifetimeLearningCredit",			ud.lifetime_learning_credit);
	putElementValue("ResidentialEnergyCredit",			ud.residential_energy_credit);
	putElementValue("RetirementSavingsCredit",			ud.retirement_savings_credit);
	putElementValue("OtherNonrefundableCredits",		ud.other_nonrefundable_credits);

	// Refundable Credits
	putElementValue("AmericanOppCreditRefundable",		ud.american_opp_credit_refundable);
	putElementValue("CreditForOtherDependents",			ud.credit_for_other_dependents);
	putElementValue("EarnedIncomeCredit",				ud.earned_income_credit);
	putElementValue("PremiumTaxCredit",					ud.premium_tax_credit);
	putElementValue("OtherRefundableCredits",			ud.other_refundable_credits);

	// Payments
	putElementValue("Withholding",						ud.withholding);
	putElementValue("EstimatedTaxPaid",					ud.estimated_tax_paid);

	changeHandler(event);
}

function saveUserData(event) {
	const FILENAME = "EstimatedTax.txt";
	
	let data = {
		version:		getUserInput("TaxToolsVersion", "text"),
		output_data:	outputs,
		input_data:		inputs,
	};
	
	Persistence.saveToFile(data, FILENAME);
}

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	outputs = {};	// Reset outputs.
	
	turnOffDebug();
	inputs = getInputs();
	calculateTax();
	putOutputs(outputs);
	turnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	dbgEnter("ContentLoaded");

	// Wait for the DOM to be fully loaded before trying to access any elements.

	// Listen for changes to the input data.
	addListener("TaxYear",							"change", changeHandler);
	addListener("SaveButton",						"click",  saveUserData);
	addListener("InputFile",						"change", restoreUserData);

	// Taxpayer information
	addListener("TaxpayersName",					"change", changeHandler);
	addListener("FilingStatus",						"change", changeHandler);
	addListener("TaxpayersBirthday",				"change", changeHandler);
	addListener("SpousesBirthday",					"change", changeHandler);

	// Income
	addListener("Wages",							"change", changeHandler);
	addListener("TaxExemptInterest",				"change", changeHandler);
	addListener("TaxableInterest",					"change", changeHandler);
	addListener("QualifiedDividends",				"change", changeHandler);
	addListener("OrdinaryDividends",				"change", changeHandler);
	addListener("RetirementAccounts",				"change", changeHandler);
	addListener("SocialSecurity",					"change", changeHandler);
	addListener("CapitalGains",						"change", changeHandler);
	addListener("SelfEmploymentIncome",				"change", changeHandler);
	addListener("OtherIncome",						"change", changeHandler);

	// Other Taxes
	addListener("SelfEmploymentTax",				"change", changeHandler);
	addListener("EarlyWithdrawalTax",				"change", changeHandler);
	addListener("OtherTaxes",						"change", changeHandler);

	// Adjustments
	addListener("EducatorExpenses",					"change", changeHandler);
	addListener("HealthSavingsAccount",				"change", changeHandler);
	addListener("SelfEmploymentTaxAdjustment",		"change", changeHandler);
	addListener("SelfEmployedHealthInsurance",		"change", changeHandler);
	addListener("EarlyWithdrawalPenalty",			"change", changeHandler);
	addListener("AlimonyPaid",						"change", changeHandler);
	addListener("IRAContributions",					"change", changeHandler);
	addListener("StudentLoanInterest",				"change", changeHandler);
	addListener("OtherAdjustments",					"change", changeHandler);

	// Deductions (non-itemized)
	addListener("QualifiedBusinessIncomeDeduction",	"change", changeHandler);
	addListener("QualifiedTipsDeduction",			"change", changeHandler);
	addListener("QualifiedOvertimeDeduction",		"change", changeHandler);
	addListener("CarLoanInterestDeduction",			"change", changeHandler);
	addListener("SeniorDeduction",					"change", changeHandler);

	// Deductions (itemized)
	addListener("MedicalInsurance",					"change", changeHandler);
	addListener("DoctorVisits",						"change", changeHandler);
	addListener("PrescriptionDrugs",				"change", changeHandler);
	addListener("MedicalAids",						"change", changeHandler);
	addListener("OtherMedicalExpenses",				"change", changeHandler);
	addListener("LTCTaxpayer",						"change", changeHandler);
	addListener("LTCSpouse",						"change", changeHandler);
	addListener("MedicalMiles",						"change", changeHandler);
	addListener("StateIncomeTax",					"change", changeHandler);
	addListener("SalesTax",							"change", changeHandler);
	addListener("RealEstatePropertyTax",			"change", changeHandler);
	addListener("PersonalPropertyTax",				"change", changeHandler);
	addListener("MortgageInterest",					"change", changeHandler);
	addListener("CashGiftsToCharity",				"change", changeHandler);
	addListener("NoncashGiftsToCharity",			"change", changeHandler);
	addListener("QualifiedCharitableDistribution",	"change", changeHandler);

	// Non-refundable Credits
	addListener("AmericanOppCreditNoRefund",		"change", changeHandler);
	addListener("ChildCareCredit",					"change", changeHandler);
	addListener("ChildTaxCredit",					"change", changeHandler);
	addListener("ForeignTaxCredit",					"change", changeHandler);
	addListener("LifetimeLearningCredit",			"change", changeHandler);
	addListener("ResidentialEnergyCredit",			"change", changeHandler);
	addListener("RetirementSavingsCredit",			"change", changeHandler);
	addListener("OtherNonrefundableCredits",		"change", changeHandler);

	// Refundable Credits
	addListener("AmericanOppCreditRefundable",		"change", changeHandler);
	addListener("CreditForOtherDependents",			"change", changeHandler);
	addListener("EarnedIncomeCredit",				"change", changeHandler);
	addListener("PremiumTaxCredit",					"change", changeHandler);
	addListener("OtherRefundableCredits",			"change", changeHandler);

	// Payments
	addListener("Withholding",						"change", changeHandler);
	addListener("EstimatedTaxPaid",					"change", changeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const TaxpayersName = document.getElementById('TaxpayersName');
	TaxpayersName.focus({
		preventScroll: true
	});

	putUserOutput("TaxYear", getTaxYear(), "text");	// Default tax year.
	changeHandler();

	dbgExit("ContentLoaded");
});

export { changeHandler };