
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { File }			from "../Library/Classes/File.js";
import { HTML }			from "../Library/Classes/HTML.js";

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
	
	inputs.tax_year								= HTML.getUserInput("TaxYear");

	// Taxpayer Information
	inputs.taxpayers_name						= HTML.getUserInput("TaxpayersName",	"text");
	inputs.filing_status						= HTML.getUserInput("FilingStatus",		"text");
	inputs.taxpayers_birthday					= HTML.getUserInput("TaxpayersBirthday","text");
	inputs.spouses_birthday						= HTML.getUserInput("SpousesBirthday",	"text");

	// Income
	inputs.wages								= HTML.getUserInput("Wages");
	inputs.tax_exempt_interest					= HTML.getUserInput("TaxExemptInterest");
	inputs.taxable_interest						= HTML.getUserInput("TaxableInterest");
	inputs.qualified_dividends					= HTML.getUserInput("QualifiedDividends");
	inputs.ordinary_dividends					= HTML.getUserInput("OrdinaryDividends");
	inputs.retirement_accounts					= HTML.getUserInput("RetirementAccounts");
	inputs.social_security						= HTML.getUserInput("SocialSecurity");
	inputs.capital_gains						= HTML.getUserInput("CapitalGains");
	inputs.self_employment_income				= HTML.getUserInput("SelfEmploymentIncome");
	inputs.other_income							= HTML.getUserInput("OtherIncome");

	// Other Taxes
	inputs.self_employment_tax					= HTML.getUserInput("SelfEmploymentTax");
	inputs.early_withdrawal_tax					= HTML.getUserInput("EarlyWithdrawalTax");
	inputs.other_taxes							= HTML.getUserInput("OtherTaxes");

	// Adjustments
	inputs.educator_expenses					= HTML.getUserInput("EducatorExpenses");
	inputs.health_savings_account				= HTML.getUserInput("HealthSavingsAccount");
	inputs.self_employment_tax_adjustment		= HTML.getUserInput("SelfEmploymentTaxAdjustment");
	inputs.self_employed_health_insurance		= HTML.getUserInput("SelfEmployedHealthInsurance");
	inputs.early_withdrawal_penalty				= HTML.getUserInput("EarlyWithdrawalPenalty");
	inputs.alimony_paid							= HTML.getUserInput("AlimonyPaid");
	inputs.ira_contributions					= HTML.getUserInput("IRAContributions");
	inputs.student_loan_interest				= HTML.getUserInput("StudentLoanInterest");
	inputs.other_adjustments					= HTML.getUserInput("OtherAdjustments");

	// Deductions (non-itemized)
	inputs.qualified_business_income_deduction	= HTML.getUserInput("QualifiedBusinessIncomeDeduction");
	inputs.qualified_tips_deduction				= HTML.getUserInput("QualifiedTipsDeduction");
	inputs.qualified_overtime_deduction			= HTML.getUserInput("QualifiedOvertimeDeduction");
	inputs.car_loan_interest_deduction			= HTML.getUserInput("CarLoanInterestDeduction");
	inputs.senior_deduction						= HTML.getUserInput("SeniorDeduction");

	// Deductions (itemized)
	inputs.medical_insurance					= HTML.getUserInput("MedicalInsurance");
	inputs.doctor_visits						= HTML.getUserInput("DoctorVisits");
	inputs.prescription_drugs					= HTML.getUserInput("PrescriptionDrugs");
	inputs.medical_aids							= HTML.getUserInput("MedicalAids");
	inputs.other_medical_expenses				= HTML.getUserInput("OtherMedicalExpenses");
	inputs.ltc_taxpayer							= HTML.getUserInput("LTCTaxpayer");
	inputs.ltc_spouse							= HTML.getUserInput("LTCSpouse");
	inputs.medical_miles						= HTML.getUserInput("MedicalMiles");
	inputs.state_income_tax						= HTML.getUserInput("StateIncomeTax");
	inputs.sales_tax							= HTML.getUserInput("SalesTax");
	inputs.real_estate_property_tax				= HTML.getUserInput("RealEstatePropertyTax");
	inputs.personal_property_tax				= HTML.getUserInput("PersonalPropertyTax");
	inputs.mortgage_interest					= HTML.getUserInput("MortgageInterest");
	inputs.cash_gifts_to_charity				= HTML.getUserInput("CashGiftsToCharity");
	inputs.noncash_gifts_to_charity				= HTML.getUserInput("NoncashGiftsToCharity");
	inputs.qualified_charitable_distribution	= HTML.getUserInput("QualifiedCharitableDistribution");

	// Non-redundable Credits
	inputs.american_opp_credit_no_refund		= HTML.getUserInput("AmericanOppCreditNoRefund");
	inputs.child_care_credit					= HTML.getUserInput("ChildCareCredit");
	inputs.child_tax_credit						= HTML.getUserInput("ChildTaxCredit");
	inputs.foreign_tax_credit					= HTML.getUserInput("ForeignTaxCredit");
	inputs.lifetime_learning_credit				= HTML.getUserInput("LifetimeLearningCredit");
	inputs.residential_energy_credit			= HTML.getUserInput("ResidentialEnergyCredit");
	inputs.retirement_savings_credit			= HTML.getUserInput("RetirementSavingsCredit");
	inputs.other_nonrefundable_credits			= HTML.getUserInput("OtherNonrefundableCredits");

	// Refundable Credits
	inputs.american_opp_credit_refundable		= HTML.getUserInput("AmericanOppCreditRefundable");
	inputs.credit_for_other_dependents			= HTML.getUserInput("CreditForOtherDependents");
	inputs.earned_income_credit					= HTML.getUserInput("EarnedIncomeCredit");
	inputs.premium_tax_credit					= HTML.getUserInput("PremiumTaxCredit");
	inputs.other_refundable_credits				= HTML.getUserInput("OtherRefundableCredits");

	// Payments
	inputs.withholding							= HTML.getUserInput("Withholding");
	inputs.estimated_tax_paid					= HTML.getUserInput("EstimatedTaxPaid");

	return inputs;
}

function putOutputs(outputs) {
	HTML.putUserOutput("TodaysDate",			outputs.todays_date, "text");
	HTML.putUserOutput("TaxpayersAge",			outputs.taxpayers_age);
	HTML.putUserOutput("SpousesAge",			outputs.spouses_age);

	// Estimated Tax
	HTML.putUserOutput("TotalIncome",			outputs.total_income);
	HTML.putUserOutput("Adjustments",			outputs.adjustments);
	HTML.putUserOutput("AdjustedGrossIncome",	outputs.adjusted_gross_income);
	HTML.putUserOutput("Deductions",			outputs.deductions);
	HTML.putUserOutput("TaxableIncome",			outputs.taxable_income);
	HTML.putUserOutput("TaxOnTaxableIncome",	outputs.tax_on_taxable_income);
	HTML.putUserOutput("TotalOtherTaxes",		outputs.total_other_taxes);
	HTML.putUserOutput("TotalTax",				outputs.total_tax);
	HTML.putUserOutput("NonrefundableCredits",	outputs.nonrefundable_credits);
	HTML.putUserOutput("RefundableCredits", 	outputs.refundable_credits);
	HTML.putUserOutput("Payments", 				outputs.payments);
	HTML.putUserOutput("AmountDue",				outputs.amount_due);
	HTML.putUserOutput("EstimatedTax",			outputs.estimated_tax);
}

function restoreDatHandler(data) {
	let ud;
	
	if (data.input_data) {
		ud = data.input_data;
	} else {
		ud = data;
	}

	// Restore the input fields
	HTML.putElementValue("TaxYear",							ud.tax_year);

	// Taxpayer Information
	HTML.putElementValue("TaxpayersName",					ud.taxpayers_name);
	HTML.putElementValue("FilingStatus",					ud.filing_status);
	HTML.putElementValue("TaxpayersBirthday",				ud.taxpayers_birthday);
	HTML.putElementValue("SpousesBirthday",					ud.spouses_birthday);

	// Income
	HTML.putElementValue("TaxExemptInterest",				ud.tax_exempt_interest);
	HTML.putElementValue("Wages",							ud.wages);
	HTML.putElementValue("TaxableInterest",					ud.taxable_interest);
	HTML.putElementValue("QualifiedDividends",				ud.qualified_dividends);
	HTML.putElementValue("OrdinaryDividends",				ud.ordinary_dividends);
	HTML.putElementValue("RetirementAccounts",				ud.retirement_accounts);
	HTML.putElementValue("SocialSecurity",					ud.social_security);
	HTML.putElementValue("CapitalGains",					ud.capital_gains);
	HTML.putElementValue("SelfEmploymentIncome",			ud.self_employment_income);
	HTML.putElementValue("OtherIncome",						ud.other_income);

	// Other Taxes
	HTML.putElementValue("SelfEmploymentTax",				ud.self_employment_tax);
	HTML.putElementValue("EarlyWithdrawalTax",				ud.early_withdrawal_tax);
	HTML.putElementValue("OtherTaxes",						ud.other_taxes);

	// Adjustments
	HTML.putElementValue("EducatorExpenses",				ud.educator_expenses);
	HTML.putElementValue("HealthSavingsAccount",			ud.health_savings_account);
	HTML.putElementValue("SelfEmploymentTaxAdjustment",		ud.self_employment_tax_adjustment);
	HTML.putElementValue("SelfEmployedHealthInsurance",		ud.self_employed_health_insurance);
	HTML.putElementValue("EarlyWithdrawalPenalty",			ud.early_withdrawal_penalty);
	HTML.putElementValue("AlimonyPaid",						ud.alimony_paid);
	HTML.putElementValue("IRAContributions",				ud.ira_contributions);
	HTML.putElementValue("StudentLoanInterest",				ud.student_loan_interest);
	HTML.putElementValue("OtherAdjustments",				ud.other_adjustments);

	// Deductions (non-itemized)
	HTML.putElementValue("QualifiedBusinessIncomeDeduction",ud.qualified_business_income_deduction);
	HTML.putElementValue("QualifiedTipsDeduction",			ud.qualified_tips_deduction);
	HTML.putElementValue("QualifiedOvertimeDeduction",		ud.qualified_overtime_deduction);
	HTML.putElementValue("CarLoanInterestDeduction",		ud.car_loan_interest_deduction);
	HTML.putElementValue("SeniorDeduction",					ud.senior_deduction);

	// Deductions (itemized)
	HTML.putElementValue("MedicalInsurance",				ud.medical_insurance);
	HTML.putElementValue("DoctorVisits",					ud.doctor_visits);
	HTML.putElementValue("PrescriptionDrugs",				ud.prescription_drugs);
	HTML.putElementValue("MedicalAids",						ud.medical_aids);
	HTML.putElementValue("LTCTaxpayer",						ud.ltc_taxpayer);
	HTML.putElementValue("LTCSpouse",						ud.ltc_spouse);
	HTML.putElementValue("MedicalMiles",					ud.medical_miles);
	HTML.putElementValue("OtherMedicalExpenses",			ud.other_medical_expenses);
	HTML.putElementValue("StateIncomeTax",					ud.state_income_tax);
	HTML.putElementValue("SalesTax",						ud.sales_tax);
	HTML.putElementValue("RealEstatePropertyTax",			ud.real_estate_property_tax);
	HTML.putElementValue("PersonalPropertyTax",				ud.personal_property_tax);
	HTML.putElementValue("MortgageInterest",				ud.mortgage_interest);
	HTML.putElementValue("CashGiftsToCharity",				ud.cash_gifts_to_charity);
	HTML.putElementValue("NoncashGiftsToCharity",			ud.noncash_gifts_to_charity);
	HTML.putElementValue("QualifiedCharitableDistribution",	ud.qualified_charitable_distribution);

	// Non-redundable Credits
	HTML.putElementValue("AmericanOppCreditNoRefund",		ud.american_opp_credit_no_refund);
	HTML.putElementValue("ChildCareCredit",					ud.child_care_credit);
	HTML.putElementValue("ChildTaxCredit",					ud.child_tax_credit);
	HTML.putElementValue("ForeignTaxCredit",				ud.foreign_tax_credit);
	HTML.putElementValue("LifetimeLearningCredit",			ud.lifetime_learning_credit);
	HTML.putElementValue("ResidentialEnergyCredit",			ud.residential_energy_credit);
	HTML.putElementValue("RetirementSavingsCredit",			ud.retirement_savings_credit);
	HTML.putElementValue("OtherNonrefundableCredits",		ud.other_nonrefundable_credits);

	// Refundable Credits
	HTML.putElementValue("AmericanOppCreditRefundable",		ud.american_opp_credit_refundable);
	HTML.putElementValue("CreditForOtherDependents",		ud.credit_for_other_dependents);
	HTML.putElementValue("EarnedIncomeCredit",				ud.earned_income_credit);
	HTML.putElementValue("PremiumTaxCredit",				ud.premium_tax_credit);
	HTML.putElementValue("OtherRefundableCredits",			ud.other_refundable_credits);

	// Payments
	HTML.putElementValue("Withholding",						ud.withholding);
	HTML.putElementValue("EstimatedTaxPaid",				ud.estimated_tax_paid);

	changeHandler();
}

function restoreUserData(event) {
	// The file selection dialog gets a list of files, but only one should be passed
	// in our case; select the first file and ignore the rest.
	const filename = event.target.files[0];
	if (!filename) {
		alert("No file selected.");
		return;
	}

	File.restoreFromFile(filename, restoreDatHandler);
}

function saveUserData(event) {
	const FILENAME = "EstimatedTax.txt";
	
	let data = {
		version:		HTML.getUserInput("TaxToolsVersion", "text"),
		output_data:	outputs,
		input_data:		inputs,
	};
	
	File.saveToFile(data, FILENAME);
}

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	outputs = {};	// Reset outputs.
	
	Debug.turnOff();
	inputs = getInputs();
	calculateTax();
	putOutputs(outputs);
	Debug.turnOn();
}

document.addEventListener("DOMContentLoaded", () => {
	dbgEnter("ContentLoaded");

	// Wait for the DOM to be fully loaded before trying to access any elements.

	// Listen for changes to the input data.
	HTML.addListener("TaxYear",							"change", changeHandler);
	HTML.addListener("SaveButton",						"click",  saveUserData);
	HTML.addListener("InputFile",						"change", restoreUserData);

	// Taxpayer information
	HTML.addListener("TaxpayersName",					"change", changeHandler);
	HTML.addListener("FilingStatus",					"change", changeHandler);
	HTML.addListener("TaxpayersBirthday",				"change", changeHandler);
	HTML.addListener("SpousesBirthday",					"change", changeHandler);

	// Income
	HTML.addListener("Wages",							"change", changeHandler);
	HTML.addListener("TaxExemptInterest",				"change", changeHandler);
	HTML.addListener("TaxableInterest",					"change", changeHandler);
	HTML.addListener("QualifiedDividends",				"change", changeHandler);
	HTML.addListener("OrdinaryDividends",				"change", changeHandler);
	HTML.addListener("RetirementAccounts",				"change", changeHandler);
	HTML.addListener("SocialSecurity",					"change", changeHandler);
	HTML.addListener("CapitalGains",					"change", changeHandler);
	HTML.addListener("SelfEmploymentIncome",			"change", changeHandler);
	HTML.addListener("OtherIncome",						"change", changeHandler);

	// Other Taxes
	HTML.addListener("SelfEmploymentTax",				"change", changeHandler);
	HTML.addListener("EarlyWithdrawalTax",				"change", changeHandler);
	HTML.addListener("OtherTaxes",						"change", changeHandler);

	// Adjustments
	HTML.addListener("EducatorExpenses",				"change", changeHandler);
	HTML.addListener("HealthSavingsAccount",			"change", changeHandler);
	HTML.addListener("SelfEmploymentTaxAdjustment",		"change", changeHandler);
	HTML.addListener("SelfEmployedHealthInsurance",		"change", changeHandler);
	HTML.addListener("EarlyWithdrawalPenalty",			"change", changeHandler);
	HTML.addListener("AlimonyPaid",						"change", changeHandler);
	HTML.addListener("IRAContributions",				"change", changeHandler);
	HTML.addListener("StudentLoanInterest",				"change", changeHandler);
	HTML.addListener("OtherAdjustments",				"change", changeHandler);

	// Deductions (non-itemized)
	HTML.addListener("QualifiedBusinessIncomeDeduction","change", changeHandler);
	HTML.addListener("QualifiedTipsDeduction",			"change", changeHandler);
	HTML.addListener("QualifiedOvertimeDeduction",		"change", changeHandler);
	HTML.addListener("CarLoanInterestDeduction",		"change", changeHandler);
	HTML.addListener("SeniorDeduction",					"change", changeHandler);

	// Deductions (itemized)
	HTML.addListener("MedicalInsurance",				"change", changeHandler);
	HTML.addListener("DoctorVisits",					"change", changeHandler);
	HTML.addListener("PrescriptionDrugs",				"change", changeHandler);
	HTML.addListener("MedicalAids",						"change", changeHandler);
	HTML.addListener("OtherMedicalExpenses",			"change", changeHandler);
	HTML.addListener("LTCTaxpayer",						"change", changeHandler);
	HTML.addListener("LTCSpouse",						"change", changeHandler);
	HTML.addListener("MedicalMiles",					"change", changeHandler);
	HTML.addListener("StateIncomeTax",					"change", changeHandler);
	HTML.addListener("SalesTax",						"change", changeHandler);
	HTML.addListener("RealEstatePropertyTax",			"change", changeHandler);
	HTML.addListener("PersonalPropertyTax",				"change", changeHandler);
	HTML.addListener("MortgageInterest",				"change", changeHandler);
	HTML.addListener("CashGiftsToCharity",				"change", changeHandler);
	HTML.addListener("NoncashGiftsToCharity",			"change", changeHandler);
	HTML.addListener("QualifiedCharitableDistribution",	"change", changeHandler);

	// Non-refundable Credits
	HTML.addListener("AmericanOppCreditNoRefund",		"change", changeHandler);
	HTML.addListener("ChildCareCredit",					"change", changeHandler);
	HTML.addListener("ChildTaxCredit",					"change", changeHandler);
	HTML.addListener("ForeignTaxCredit",				"change", changeHandler);
	HTML.addListener("LifetimeLearningCredit",			"change", changeHandler);
	HTML.addListener("ResidentialEnergyCredit",			"change", changeHandler);
	HTML.addListener("RetirementSavingsCredit",			"change", changeHandler);
	HTML.addListener("OtherNonrefundableCredits",		"change", changeHandler);

	// Refundable Credits
	HTML.addListener("AmericanOppCreditRefundable",		"change", changeHandler);
	HTML.addListener("CreditForOtherDependents",		"change", changeHandler);
	HTML.addListener("EarnedIncomeCredit",				"change", changeHandler);
	HTML.addListener("PremiumTaxCredit",				"change", changeHandler);
	HTML.addListener("OtherRefundableCredits",			"change", changeHandler);

	// Payments
	HTML.addListener("Withholding",						"change", changeHandler);
	HTML.addListener("EstimatedTaxPaid",				"change", changeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const TaxpayersName = document.getElementById('TaxpayersName');
	TaxpayersName.focus({
		preventScroll: true
	});

	HTML.putUserOutput("TaxYear", Dates.getTaxYear(), "text");	// Default tax year.
	changeHandler();

	dbgExit("ContentLoaded");
});

export { changeHandler };
