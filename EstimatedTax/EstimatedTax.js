
import { Dates }			from "../Library/Classes/Dates.js";
import { Debug }			from "../Library/Classes/Debug.js";
import { File }				from "../Library/Classes/File.js";
import { Forms }			from "../Library/Classes/Forms.js";
import { HTML }				from "../Library/Classes/HTML.js";
import { Taxpayer }			from "../Library/Classes/Taxpayer.js";
import { TaxpayerForms }	from "../Library/Classes/TaxpayerForms.js";
import { TaxTable }			from "../Library/Classes/TaxTable.js";

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
	let taxpayer = new Taxpayer(
		inputs.tax_year,
		inputs.filing_status,
		inputs.taxpayers_name,
		inputs.taxpayers_birthday,
		inputs.taxpayers_age,
		false,							// inputs.taxpayer_is_blind,
		inputs.spouses_birthday,
		inputs.spouses_age,
		false,							// inputs.spouse_is_blind,
		0 );							// inputs.number_of_dependents);
	
	return taxpayer;
}

function mapInputValues(inputs, taxpayer) {
	//
	// For each entry on the web page, figure out where it goes on the tax forms. Make a
	// list of the forms that are needed and the lines on those forms that need to be
	// initialized.
	//
	let tt			= TaxTable.getTaxTable(inputs.tax_year);
	let inp			= inputs;	// Shorthand
	let tp			= taxpayer;	// Shorthand

	checkInputValues(inputs, tt, tp);

	// Build an array with the tax forms entered by the taxpayer.
	let tax_data	= new TaxpayerForms();
	let f1040		= tax_data.addForm("F1040");
	let f1040S1		= tax_data.addForm("F1040S1");
	let f1040S2		= tax_data.addForm("F1040S2");
	let f1040S3		= tax_data.addForm("F1040S3");
	let f1040S1A	= tax_data.addForm("F1040S1A");
	let f1040SA		= tax_data.addForm("F1040SA");

	tax_data.addLine(f1040,		inp.wages,							"01z");
	tax_data.addLine(f1040,		inp.tax_exempt_interest,			"02a");
	tax_data.addLine(f1040,		inp.taxable_interest,				"02b");
	tax_data.addLine(f1040,		inp.qualified_dividends,			"03a");
	tax_data.addLine(f1040,		inp.ordinary_dividends,				"03b");
	tax_data.addLine(f1040,		inp.retirement_accounts,			"04b");
	tax_data.addLine(f1040,		inp.social_security,				"06a");
	tax_data.addLine(f1040,		inp.capital_gains,					"07a");
	tax_data.addLine(f1040,		inp.self_employment_income +
								inp.other_income,					"08");

	//Other Taxes
	tax_data.addLine(f1040S2,	inp.self_employment_tax,			"04");
	tax_data.addLine(f1040S2,	inp.early_withdrawal_tax,			"08");
	tax_data.addLine(f1040,		inp.other_taxes,					"23");

	// Adjustments
	tax_data.addLine(f1040S1,	inp.educator_expenses,				"11");
	tax_data.addLine(f1040S1,	inp.health_savings_account,			"13");
	tax_data.addLine(f1040S1,	inp.self_employment_tax_adjustment,	"15");
	tax_data.addLine(f1040S1,	inp.self_employed_health_insurance,	"17");
	tax_data.addLine(f1040S1,	inp.early_withdrawal_penalty,		"18");
	tax_data.addLine(f1040S1,	inp.alimony_paid,					"19");
	tax_data.addLine(f1040S1,	inp.ira_contributions,				"20");
	tax_data.addLine(f1040S1,	inp.student_loan_interest,			"21");
	tax_data.addLine(f1040S1,	inp.other_adjustments,				"25");

	// Deductions (non-itemized)
	tax_data.addLine(f1040,		inp.qualified_business_income_deduction,"13a");
	tax_data.addLine(f1040S1A,	inp.qualified_tips_deduction,		"13");
	tax_data.addLine(f1040S1A,	inp.qualified_overtime_deduction,	"21");
	tax_data.addLine(f1040S1A,	inp.car_loan_interest_deduction,	"30");
	tax_data.addLine(f1040S1A,	inp.senior_deduction,				"37");

	// Deductions
	let total_medical_deductions =
		inp.medical_insurance +
		inp.doctor_visits +
		inp.prescription_drugs +
		inp.medical_aids +
		inp.other_medical_expenses +
		inp.ltc_taxpayer +
		inp.ltc_spouse +
		tt.getMedicalMileageDeduction(inp.medical_miles);	// Convert miles to dollars;
	let state_and_local_taxes = Math.max(inp.StateIncomeTax, inp.SalesTax);
	
	tax_data.addLine(f1040SA,	total_medical_deductions,			"01");
	tax_data.addLine(f1040SA,	state_and_local_taxes,				"05a");
	tax_data.addLine(f1040SA,	inp.RealEstatePropertyTax,			"05b");
	tax_data.addLine(f1040SA,	inp.PersonalPropertyTax,			"05c");
	tax_data.addLine(f1040SA,	inp.MortgageInterest,				"08a");
	tax_data.addLine(f1040SA,	inp.CashGiftsToCharity,				"11");
	tax_data.addLine(f1040SA,	inp.NoncashGiftsToCharity,			"12");

	// Non-refundable Credits
	tax_data.addLine(f1040S3,	inp.american_opp_credit_no_refund,	"03");
	tax_data.addLine(f1040,		inp.child_care_credit,				"19");
	tax_data.addLine(f1040S3,	inp.child_tax_credit,				"02");
	tax_data.addLine(f1040S3,	inp.foreign_tax_credit,				"01");
	tax_data.addLine(f1040S3,	inp.lifetime_learning_credit,		"03");
	tax_data.addLine(f1040S3,	inp.residential_energy_credit,		"05");
	tax_data.addLine(f1040S3,	inp.retirement_savings_credit,		"04");
	tax_data.addLine(f1040S3,	inp.other_nonrefundable_credits,	"06");

	// Refundable Credits
	tax_data.addLine(f1040S3,	inp.american_opp_credit_refundable,	"03");
	tax_data.addLine(f1040,		inp.credit_for_other_dependents,	"19");
	tax_data.addLine(f1040,		inp.earned_income_credit,			"27a");
	tax_data.addLine(f1040S3,	inp.premium_tax_credit,				"09");
	tax_data.addLine(f1040S3,	inp.other_refundable_credits,		"13");

	// Payments
	tax_data.addLine(f1040,		inp.withholding,					"25d");
	tax_data.addLine(f1040,		inp.estimated_tax_paid,				"26");
	
	return tax_data;
}

function getInputs() {
	//
	// Get the values from the web page. Put then in an object literal so the values
	// can be accessed by name. This program recalculates the entire tax return when
	// a values is changed, not just the value that was changed. This does not seem
	// to be a performance problem and it prevents needing to know what is dependent
	// on each value.
	//
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

function putOutputs(taxpayer) {
	//
	// Get the information we are interested in and write them to the web page.
	//
	const todays_date		= new Date().toLocaleDateString();
	const payments			= Forms.getValue("F1040", "26");
	const amount_due		= Forms.getValue("F1040", "34");
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
	HTML.putUserOutput("Payments", 				payments);
	HTML.putUserOutput("AmountDue",				amount_due);
	HTML.putUserOutput("EstimatedTax",			estimated_tax);
}

function restoreDataHandler(data) {
	//
	// This function is called when the user restores the input fields from a file.
	// The data that was copied from the file is passed a parameter.
	//
	let ud;

	// There are currently 2 formats in use; select which one this is.
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

	File.restoreFromFile(filename, restoreDataHandler);
}

function saveUserData(event) {
	//
	// This function is called when the user wants to save the input fields to a file.
	//
	const FILENAME = "EstimatedTax.txt";
	
	let data = {
		version:		HTML.getUserInput("TaxToolsVersion", "text"),
		output_data:	outputs,
		input_data:		inputs,
	};
	
	File.saveToFile(data, FILENAME);
}

function changeHandler(event) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole return (not just the field tha was changed).
	//
	let inputs		= {};		// Object - indexed by name
	let taxpayer	= {};		// Object
	let tax_data	= [];		// Array of forms - not indexed by name
	
	// Reset static (global) variables. This erases all information from a previous
	// calculation.
	Debug.reset();
	Forms.reset();
	Taxpayer.reset();
	
	inputs		= getInputs();
	taxpayer	= createTaxpayer(inputs);
	tax_data	= mapInputValues(inputs, taxpayer);

	tax_data.loadForms();	// Load the taxpayer's data and calculate their taxes.
	
	let f1040 = Forms.getForm("F1040");
	f1040.calculate();
	putOutputs(taxpayer);

	// Forms.toConsole();	// Print all forms to the console.log().
	Debug.turnOn();
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	// All the listeners for the data fields use the same handler so when any field
	// is changed the whole return is recalculated.
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
	const TaxpayersName = document.getElementById('TaxpayersName');
	TaxpayersName.focus({
		preventScroll: true
	});

	// Set the default tax year in the drop down list.
	HTML.putUserOutput("TaxYear", Dates.getTaxYear(), "text");
	Debug.reset();
});

export { changeHandler };
