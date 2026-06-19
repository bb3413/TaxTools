
import { getAge }							from "../Library/Dates.js";
import { getTaxYear }						from "../Library/Dates.js";
import { dbgEnter, dbgExit, dbgLog }		from "../Library/Debug.js";
import { putDebugOutput }					from "../Library/Debug.js";
import { turnOffDebug, turnOnDebug }		from "../Library/Debug.js";
import { addListener }						from "../Library/HTML.js";
import { getUserInput, putUserOutput }		from "../Library/HTML.js";
import { min, max, round }					from "../Library/Numbers.js";
import { strCaseEqual }						from "../Library/Strings.js";


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
	// addListener("SaveButton",					"click",  saveUserData);
	// addListener("InputFile",						"change", restoreUserData);

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