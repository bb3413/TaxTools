
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { File }			from "../Library/Classes/File.js";
import { Forms }		from "../Library/Classes/Forms.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { Taxpayer }		from "../Library/Classes/Taxpayer.js";
import { TaxData }		from "../Library/Classes/TaxData.js";
import { TaxTable }		from "../Library/Classes/TaxTable.js";

// This variable need to be global so it can be accssed by the save and restore handlers.
let inputs = {};

function changeHandler(event) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole return (not just the field tha was changed).
	//
	try {
		// Reset static (global) variables to erase information from a previous calculation.
		HTML.putElementValue("ErrorMessageOutput", "");
		Debug.reset();
		Forms.reset();
		Taxpayer.reset();

		const inputs	= getInputs();								// Get inputs from the web page
		const tax_table	= TaxTable.getTaxTable(inputs.tax_year);	// Initialize tax tables; ignore return value.
		const taxpayer	= createTaxpayer(inputs);					// Initialize taxpayer; ignore return value.
		const tax_data	= mapInputValues(inputs);					// Map input values to tax forms

		TaxData.loadForms(tax_data.forms);							// Create tax forms for the taxpayer's data
		Forms.getForm("F1040").calculate();							// Calculate the tax forms
		putOutputs(taxpayer);										// Put results on web page
		Debug.turnOn();												// Put debug info on web page if enabled
	} catch (err) {
		HTML.putElementValue("ErrorMessageOutput", err);
		document.getElementById("ErrorMessageOutput").scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

function checkInputValues(inputs, taxtable, taxpayer) {
	//
	// For any values that have a minimum or maximum value, make sure the value is
	// within range. No error is reported if a correction is made.
	//
	const fs	= taxpayer.filing_status;
	const tt	= taxtable;	// Shorthand
	const inp	= inputs;	// Shorthand

	inp.ltc_taxpayer					= Math.min(inp.ltc_taxpayer,				tt.getMaxLTC(taxpayer.taxpayers_age));
	inp.ltc_spouse						= Math.min(inp.ltc_spouse,					tt.getMaxLTC(taxpayer.spouses_age));

	inp.educator_expenses				= Math.min(inp.educator_expenses,			tt.getTaxValue("MaxEducatorExpenses",			fs));
	inp.capital_gains					= Math.max(inp.capital_gains,				tt.getTaxValue("MaxCapitalLoss",				fs));
	inp.student_loan_interest			= Math.min(inp.student_loan_interest,		tt.getTaxValue("MaxStudentLoanInterest",		fs));

	// OBBA
	inp.qualified_tips_deduction		= Math.min(inp.qualified_tips_deduction,	tt.getTaxValue("MaxTipsDeduction",				fs));
	inp.qualified_overtime_deduction	= Math.min(inp.qualified_overtime_deduction,tt.getTaxValue("MaxOvertimeDeduction",			fs));
	inp.car_loan_interest_deduction		= Math.min(inp.car_loan_interest_deduction,	tt.getTaxValue("MaxCarLoanInterestDeduction",	fs));
	inp.senior_deduction				= Math.min(inp.senior_deduction,			tt.getTaxValue("MaxSeniorDeduction",			fs));

	// Non-refundable Credits
	inp.american_opp_credit_no_refund	= Math.min(inp.american_opp_credit_no_refund,tt.getTaxValue("MaxAmericanOppCreditNoRefund",	fs));
	inp.child_care_credit				= Math.min(inp.child_care_credit,			tt.getTaxValue("MaxChildAndDependentCareCredit",fs));
	inp.child_tax_credit				= Math.min(inp.child_tax_credit,			tt.getTaxValue("MaxChildTaxCredit",				fs));
	inp.foreign_tax_credit				= Math.min(inp.foreign_tax_credit,			tt.getTaxValue("MaxForeignTaxCredit",			fs));
	inp.lifetime_learning_credit		= Math.min(inp.lifetime_learning_credit,	tt.getTaxValue("MaxLifetimeLearningCredit",		fs));
	inp.residential_energy_credit		= Math.min(inp.residential_energy_credit,	tt.getTaxValue("MaxResidentialEnergyCredit",	fs));
	inp.retirement_savings_credit		= Math.min(inp.retirement_savings_credit,	tt.getTaxValue("MaxRetirementSavingsCredit",	fs));

	// Refundable Credits
	inp.american_opp_credit_refundable	= Math.min(inp.american_opp_credit_refundable,tt.getTaxValue("MaxAmericanOppCreditRefundable",fs));
	inp.credit_for_other_dependents		= Math.min(inp.credit_for_other_dependents,	tt.getTaxValue("MaxCreditForOtherDependents",	fs));
	inp.earned_income_credit			= Math.min(inp.earned_income_credit,		tt.getTaxValue("MaxEarnedIncomeCredit",			fs));
	inp.premium_tax_credit				= Math.min(inp.premium_tax_credit,			tt.getTaxValue("MaxPremiumTaxCredit",			fs));
}

function createTaxpayer(inputs) {
	const taxpayer					= new Taxpayer();

	taxpayer.tax_year				= inputs.tax_year;
	taxpayer.taxpayers_name			= inputs.taxpayers_name;
	taxpayer.filing_status			= inputs.filing_status;
	taxpayer.taxpayers_birthday		= inputs.taxpayers_birthday;
	taxpayer.spouses_birthday		= inputs.spouses_birthday;

	return taxpayer;
}

function getInputs() {
	//
	// Get the values from the web page. Put them in an object literal so the values
	// can be accessed by name. This program recalculates the entire tax return when
	// a values is changed, not just the value that was changed. This does not seem
	// to be a performance problem and it prevents needing to know what is dependent
	// on each value.
	//
	const inputs = {};

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

function mapInputValues(inputs) {
	//
	// For each entry on the web page, figure out where it goes on the tax forms. Make a
	// list of the forms that are needed and the lines on those forms that need to be
	// initialized.
	//
	const tt = TaxTable.getTaxTable();
	const tp = Taxpayer.getTaxpayer();

	checkInputValues(inputs, tt, tp);

	// Build an array with the tax forms entered by the taxpayer.
	const tax_data	= new TaxData();
	const f1040		= tax_data.addForm("F1040");
	const f1040S1	= tax_data.addForm("F1040S1");
	const f1040S2	= tax_data.addForm("F1040S2");
	const f1040S3	= tax_data.addForm("F1040S3");
	const f1040S1A	= tax_data.addForm("F1040S1A");
	const f1040SA	= tax_data.addForm("F1040SA");

	tax_data.addLine(f1040,		"01z",	inputs.wages);
	tax_data.addLine(f1040,		"02a",	inputs.tax_exempt_interest);
	tax_data.addLine(f1040,		"02b",	inputs.taxable_interest);
	tax_data.addLine(f1040,		"03a",	inputs.qualified_dividends);
	tax_data.addLine(f1040,		"03b",	inputs.ordinary_dividends);
	tax_data.addLine(f1040,		"04b",	inputs.retirement_accounts);
	tax_data.addLine(f1040,		"06a",	inputs.social_security);
	tax_data.addLine(f1040,		"07a",	inputs.capital_gains);
	tax_data.addLine(f1040,		"08",	inputs.self_employment_income +
										inputs.other_income);

	//Other Taxes
	tax_data.addLine(f1040S2,	"04",	inputs.self_employment_tax);
	tax_data.addLine(f1040S2,	"08",	inputs.early_withdrawal_tax);
	tax_data.addLine(f1040,		"23",	inputs.other_taxes);

	// Adjustments
	tax_data.addLine(f1040S1,	"11",	inputs.educator_expenses);
	tax_data.addLine(f1040S1,	"13",	inputs.health_savings_account);
	tax_data.addLine(f1040S1,	"15",	inputs.self_employment_tax_adjustment);
	tax_data.addLine(f1040S1,	"17",	inputs.self_employed_health_insurance);
	tax_data.addLine(f1040S1,	"18",	inputs.early_withdrawal_penalty);
	tax_data.addLine(f1040S1,	"19a",	inputs.alimony_paid);
	tax_data.addLine(f1040S1,	"20",	inputs.ira_contributions);
	tax_data.addLine(f1040S1,	"21",	inputs.student_loan_interest);
	tax_data.addLine(f1040S1,	"25",	inputs.other_adjustments);

	// Deductions (non-itemized)
	tax_data.addLine(f1040,		"13a",	inputs.qualified_business_income_deduction);
	tax_data.addLine(f1040S1A,	"13",	inputs.qualified_tips_deduction);
	tax_data.addLine(f1040S1A,	"21",	inputs.qualified_overtime_deduction);
	tax_data.addLine(f1040S1A,	"30",	inputs.car_loan_interest_deduction);
	tax_data.addLine(f1040S1A,	"37",	inputs.senior_deduction);

	// Deductions
	const total_medical_deductions =
		inputs.medical_insurance +
		inputs.doctor_visits +
		inputs.prescription_drugs +
		inputs.medical_aids +
		inputs.other_medical_expenses +
		inputs.ltc_taxpayer +
		inputs.ltc_spouse +
		tt.getMedicalMileageDeduction(inputs.medical_miles);	// Convert miles to dollars;
	const state_and_local_taxes = Math.max(inputs.state_income_tax, inputs.sales_tax);

	tax_data.addLine(f1040SA,	"01",	total_medical_deductions);
	tax_data.addLine(f1040SA,	"05a",	state_and_local_taxes);
	tax_data.addLine(f1040SA,	"05b",	inputs.real_estate_property_tax);
	tax_data.addLine(f1040SA,	"05c",	inputs.personal_property_tax);
	tax_data.addLine(f1040SA,	"08a",	inputs.mortgage_interest);
	tax_data.addLine(f1040SA,	"11",	inputs.cash_gifts_to_charity);
	tax_data.addLine(f1040SA,	"12",	inputs.noncash_gifts_to_charity);

	// Non-refundable Credits
	tax_data.addLine(f1040S3,	"03",	inputs.american_opp_credit_no_refund);
	tax_data.addLine(f1040,		"19",	inputs.child_care_credit);
	tax_data.addLine(f1040S3,	"02",	inputs.child_tax_credit);
	tax_data.addLine(f1040S3,	"01",	inputs.foreign_tax_credit);
	tax_data.addLine(f1040S3,	"03",	inputs.lifetime_learning_credit);
	tax_data.addLine(f1040S3,	"05a",	inputs.residential_energy_credit);
	tax_data.addLine(f1040S3,	"04",	inputs.retirement_savings_credit);
	tax_data.addLine(f1040S3,	"07",	inputs.other_nonrefundable_credits);

	// Refundable Credits
	tax_data.addLine(f1040S3,	"03",	inputs.american_opp_credit_refundable);
	tax_data.addLine(f1040,		"19",	inputs.credit_for_other_dependents);
	tax_data.addLine(f1040,		"27a",	inputs.earned_income_credit);
	tax_data.addLine(f1040S3,	"09",	inputs.premium_tax_credit);
	tax_data.addLine(f1040S3,	"13z",	inputs.other_refundable_credits);

	// Payments
	tax_data.addLine(f1040,		"25d",	inputs.withholding);
	tax_data.addLine(f1040,		"26",	inputs.estimated_tax_paid);

	return tax_data;
}

function putOutputs(taxpayer) {
	//
	// Get the information we are interested in and write them to the web page.
	//
	const todays_date		= new Date().toLocaleDateString();
	const withholding		= Forms.getValue("F1040", "25d");
	const payments			= Forms.getValue("F1040", "26");
	const refund			= Forms.getValue("F1040", "34");
	let amount_due			= Forms.getValue("F1040", "37");

	amount_due				= (amount_due !== 0) ? -amount_due : refund;
	const estimated_tax		= Math.round(Math.max(0, payments - amount_due) / 4);

	HTML.putUserOutput("TodaysDate",			todays_date, "text");
	HTML.putUserOutput("TaxpayersAge",			taxpayer.taxpayers_age);
	HTML.putUserOutput("SpousesAge",			taxpayer.spouses_age);

	// Estimated Tax
	HTML.putUserOutput("TotalIncome",			Forms.getValue("F1040", "09"));
	HTML.putUserOutput("Adjustments",			Forms.getValue("F1040", "10"));
	HTML.putUserOutput("AdjustedGrossIncome",	Forms.getValue("F1040", "11b"));
	HTML.putUserOutput("Deductions",			Forms.getValue("F1040", "14"));
	HTML.putUserOutput("TaxableIncome",			Forms.getValue("F1040", "15"));
	HTML.putUserOutput("TaxOnTaxableIncome",	Forms.getValue("F1040", "16"));
	HTML.putUserOutput("TotalOtherTaxes",		Forms.getValue("F1040", "23"));
	HTML.putUserOutput("TotalTax",				Forms.getValue("F1040", "24"));
	HTML.putUserOutput("NonrefundableCredits",	Forms.getValue("F1040", "20"));
	HTML.putUserOutput("RefundableCredits", 	Forms.getValue("F1040", "32"));
	HTML.putUserOutput("Payments", 				payments + withholding);
	HTML.putUserOutput("AmountDue",				amount_due);
	HTML.putUserOutput("EstimatedTax",			estimated_tax);
}

function restoreDataHandler(data) {
	//
	// This function is called when the user restores the input fields from a file.
	// The data that was copied from the file is passed a parameter.
	//
	let inputs;

	// There are currently 2 formats in use; select which one this is.
	if (data.input_data) {
		inputs = data.input_data;
	} else {
		inputs = data;
	}

	// Restore the input fields
	HTML.putElementValue("TaxYear",							inputs.tax_year);

	// Taxpayer Information
	HTML.putElementValue("TaxpayersName",					inputs.taxpayers_name);
	HTML.putElementValue("FilingStatus",					inputs.filing_status);
	HTML.putElementValue("TaxpayersBirthday",				inputs.taxpayers_birthday);
	HTML.putElementValue("SpousesBirthday",					inputs.spouses_birthday);

	// Income
	HTML.putElementValue("TaxExemptInterest",				inputs.tax_exempt_interest);
	HTML.putElementValue("Wages",							inputs.wages);
	HTML.putElementValue("TaxableInterest",					inputs.taxable_interest);
	HTML.putElementValue("QualifiedDividends",				inputs.qualified_dividends);
	HTML.putElementValue("OrdinaryDividends",				inputs.ordinary_dividends);
	HTML.putElementValue("RetirementAccounts",				inputs.retirement_accounts);
	HTML.putElementValue("SocialSecurity",					inputs.social_security);
	HTML.putElementValue("CapitalGains",					inputs.capital_gains);
	HTML.putElementValue("SelfEmploymentIncome",			inputs.self_employment_income);
	HTML.putElementValue("OtherIncome",						inputs.other_income);

	// Other Taxes
	HTML.putElementValue("SelfEmploymentTax",				inputs.self_employment_tax);
	HTML.putElementValue("EarlyWithdrawalTax",				inputs.early_withdrawal_tax);
	HTML.putElementValue("OtherTaxes",						inputs.other_taxes);

	// Adjustments
	HTML.putElementValue("EducatorExpenses",				inputs.educator_expenses);
	HTML.putElementValue("HealthSavingsAccount",			inputs.health_savings_account);
	HTML.putElementValue("SelfEmploymentTaxAdjustment",		inputs.self_employment_tax_adjustment);
	HTML.putElementValue("SelfEmployedHealthInsurance",		inputs.self_employed_health_insurance);
	HTML.putElementValue("EarlyWithdrawalPenalty",			inputs.early_withdrawal_penalty);
	HTML.putElementValue("AlimonyPaid",						inputs.alimony_paid);
	HTML.putElementValue("IRAContributions",				inputs.ira_contributions);
	HTML.putElementValue("StudentLoanInterest",				inputs.student_loan_interest);
	HTML.putElementValue("OtherAdjustments",				inputs.other_adjustments);

	// Deductions (non-itemized)
	HTML.putElementValue("QualifiedBusinessIncomeDeduction",inputs.qualified_business_income_deduction);
	HTML.putElementValue("QualifiedTipsDeduction",			inputs.qualified_tips_deduction);
	HTML.putElementValue("QualifiedOvertimeDeduction",		inputs.qualified_overtime_deduction);
	HTML.putElementValue("CarLoanInterestDeduction",		inputs.car_loan_interest_deduction);
	HTML.putElementValue("SeniorDeduction",					inputs.senior_deduction);

	// Deductions (itemized)
	HTML.putElementValue("MedicalInsurance",				inputs.medical_insurance);
	HTML.putElementValue("DoctorVisits",					inputs.doctor_visits);
	HTML.putElementValue("PrescriptionDrugs",				inputs.prescription_drugs);
	HTML.putElementValue("MedicalAids",						inputs.medical_aids);
	HTML.putElementValue("LTCTaxpayer",						inputs.ltc_taxpayer);
	HTML.putElementValue("LTCSpouse",						inputs.ltc_spouse);
	HTML.putElementValue("MedicalMiles",					inputs.medical_miles);
	HTML.putElementValue("OtherMedicalExpenses",			inputs.other_medical_expenses);
	HTML.putElementValue("StateIncomeTax",					inputs.state_income_tax);
	HTML.putElementValue("SalesTax",						inputs.sales_tax);
	HTML.putElementValue("RealEstatePropertyTax",			inputs.real_estate_property_tax);
	HTML.putElementValue("PersonalPropertyTax",				inputs.personal_property_tax);
	HTML.putElementValue("MortgageInterest",				inputs.mortgage_interest);
	HTML.putElementValue("CashGiftsToCharity",				inputs.cash_gifts_to_charity);
	HTML.putElementValue("NoncashGiftsToCharity",			inputs.noncash_gifts_to_charity);
	HTML.putElementValue("QualifiedCharitableDistribution",	inputs.qualified_charitable_distribution);

	// Non-redundable Credits
	HTML.putElementValue("AmericanOppCreditNoRefund",		inputs.american_opp_credit_no_refund);
	HTML.putElementValue("ChildCareCredit",					inputs.child_care_credit);
	HTML.putElementValue("ChildTaxCredit",					inputs.child_tax_credit);
	HTML.putElementValue("ForeignTaxCredit",				inputs.foreign_tax_credit);
	HTML.putElementValue("LifetimeLearningCredit",			inputs.lifetime_learning_credit);
	HTML.putElementValue("ResidentialEnergyCredit",			inputs.residential_energy_credit);
	HTML.putElementValue("RetirementSavingsCredit",			inputs.retirement_savings_credit);
	HTML.putElementValue("OtherNonrefundableCredits",		inputs.other_nonrefundable_credits);

	// Refundable Credits
	HTML.putElementValue("AmericanOppCreditRefundable",		inputs.american_opp_credit_refundable);
	HTML.putElementValue("CreditForOtherDependents",		inputs.credit_for_other_dependents);
	HTML.putElementValue("EarnedIncomeCredit",				inputs.earned_income_credit);
	HTML.putElementValue("PremiumTaxCredit",				inputs.premium_tax_credit);
	HTML.putElementValue("OtherRefundableCredits",			inputs.other_refundable_credits);

	// Payments
	HTML.putElementValue("Withholding",						inputs.withholding);
	HTML.putElementValue("EstimatedTaxPaid",				inputs.estimated_tax_paid);

	changeHandler();
}

function restoreUserData(event) {
	//
	// The file selection dialog gets a list of files, but only one should be passed
	// in our case; select the first file and ignore the rest.
	//
	const filename = event.target.files[0];
	if (!filename) {
		throw new Error("No file selected.");
		return;
	}

	File.restoreFromFile(filename, restoreDataHandler);
}

function saveUserData(event) {
	//
	// This function is called when the user wants to save the input fields to a file.
	//
	const FILENAME = "EstimatedTax.txt";

	const data = {
		version:		HTML.getUserInput("TaxToolsVersion", "text"),
		todays_date:	new Date().toLocaleDateString(),
		input_data:		inputs,
	};

	File.saveToFile(data, FILENAME);
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	// All the listeners for the data fields use the same handler so when any field
	// is changed the whole calculation is redone.
	//

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
	const TaxpayersName = document.getElementById("TaxpayersName");
	TaxpayersName.focus({
		preventScroll: true
	});

	HTML.putUserOutput("TaxYear", Dates.getTaxYear(), "text");		// Default tax year.
	HTML.hideElement("DebugContainer");
});

export { changeHandler };
