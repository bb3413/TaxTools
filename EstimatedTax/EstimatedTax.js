
// Values from HTML elements; local storage
let tax_year								= 0;

// Taxpayer Information
let taxpayers_name							= "";
let filing_status							= "";
let taxpayers_birthday						= "";
let spouses_birthday						= "";
let todays_date								= "";
let taxpayers_age							= 0;
let spouses_age								= 0;

// Estimated Tax
let total_income							= 0;
let adjustments								= 0;
let adjusted_gross_income					= 0;
let deductions								= 0;
let taxable_income							= 0;
let tax_on_taxable_income					= 0;
let total_other_taxes						= 0;
let total_tax								= 0;
let nonrefundable_credits					= 0;
let refundable_credits						= 0;
let payments								= 0;
let amount_due								= 0;
let estimated_tax							= 0;

// Income
let wages									= 0;
let tax_exempt_interest						= 0;
let taxable_interest						= 0;
let qualified_dividends						= 0;
let ordinary_dividends						= 0;
let retirement_accounts						= 0;
let social_security							= 0;
let capital_gains							= 0;
let self_employment_income					= 0;
let other_income							= 0;

// Other Taxes
let self_employment_tax						= 0;
let early_withdrawal_tax					= 0;
let other_taxes								= 0;

// Adjustments
let educator_expenses						= 0;
let health_savings_account					= 0;
let self_employment_tax_adjustment			= 0;
let self_employed_health_insurance			= 0;
let early_withdrawal_penalty				= 0;
let alimony_paid							= 0;
let ira_contributions						= 0;
let student_loan_interest					= 0;
let other_adjustments						= 0;

// Deductions (non-itemized)
let qualified_business_income_deduction		= 0;
let qualified_tips_deduction				= 0;
let qualified_overtime_deduction			= 0;
let car_loan_interest_deduction				= 0;
let senior_deduction						= 0;

// Deductions (itemized)
let medical_insurance						= 0;
let doctor_visits							= 0;
let prescription_drugs						= 0;
let medical_aids							= 0;
let other_medical_expenses					= 0;
let ltc_taxpayer							= 0;
let ltc_spouse								= 0;
let medical_miles							= 0;
let state_income_tax						= 0;
let sales_tax								= 0;
let real_estate_property_tax				= 0;
let personal_property_tax					= 0;
let mortgage_interest						= 0;
let cash_gifts_to_charity					= 0;
let noncash_gifts_to_charity				= 0;
let qualified_charitable_distribution		= 0;

// Non-redundable Credits
let american_opp_credit_no_refund			= 0;
let child_care_credit						= 0;
let child_tax_credit						= 0;
let foreign_tax_credit						= 0;
let lifetime_learning_credit				= 0;
let residential_energy_credit				= 0;
let retirement_savings_credit				= 0;
let other_nonrefundable_credits				= 0;

// Refundable Credits
let american_opp_credit_refundable			= 0;
let credit_for_other_dependents				= 0;
let earned_income_credit					= 0;
let premium_tax_credit						= 0;
let other_refundable_credits				= 0;
	
// Payments
let withholding								= 0;
let estimated_tax_paid						= 0;

function CheckInputValues() {
	//
	// Correct input values that have a limit. No error is reported if a correction is made.
	//
	const fs = filing_status;
	
	ltc_taxpayer					= Min(ltc_taxpayer,					getMaxLTC(taxpayers_age));
	ltc_spouse						= Min(ltc_spouse,					getMaxLTC(spouses_age));
	
	educator_expenses				= Min(educator_expenses,			getTaxValue("MaxEducatorExpenses",				fs));
	capital_gains					= Max(capital_gains,				getTaxValue("MaxCapitalLoss",					fs));
	student_loan_interest			= Min(student_loan_interest,		getTaxValue("MaxStudentLoanInterest",			fs));

	// OBBA
	qualified_tips_deduction		= Min(qualified_tips_deduction,		getTaxValue("MaxTipsDeduction",					fs));
	qualified_overtime_deduction	= Min(qualified_overtime_deduction,	getTaxValue("MaxOvertimeDeduction",				fs));
	car_loan_interest_deduction		= Min(car_loan_interest_deduction,	getTaxValue("MaxCarLoanInterestDeduction",		fs));
	senior_deduction				= Min(senior_deduction,				getTaxValue("MaxSeniorDeduction",				fs));
	
	// Non-refundable Credits
	american_opp_credit_no_refund	= Min(american_opp_credit_no_refund,getTaxValue("MaxAmericanOppCreditNoRefund",		fs));
	child_care_credit				= Min(child_care_credit,			getTaxValue("MaxChildAndDependentCareCredit",	fs));
	child_tax_credit				= Min(child_tax_credit,				getTaxValue("MaxChildTaxCredit",				fs));
	foreign_tax_credit				= Min(foreign_tax_credit,			getTaxValue("MaxForeignTaxCredit",				fs));
	lifetime_learning_credit		= Min(lifetime_learning_credit,		getTaxValue("MaxLifetimeLearningCredit",		fs));
	residential_energy_credit		= Min(residential_energy_credit,	getTaxValue("MaxResidentialEnergyCredit",		fs));
	retirement_savings_credit		= Min(retirement_savings_credit,	getTaxValue("MaxRetirementSavingsCredit",		fs));

	// Refundable Credits
	american_opp_credit_refundable	= Min(american_opp_credit_refundable,getTaxValue("MaxAmericanOppCreditRefundable",	fs));
	credit_for_other_dependents		= Min(credit_for_other_dependents,	getTaxValue("MaxCreditForOtherDependents",		fs));
	earned_income_credit			= Min(earned_income_credit,			getTaxValue("MaxEarnedIncomeCredit",			fs));
	premium_tax_credit				= Min(premium_tax_credit,			getTaxValue("MaxPremiumTaxCredit",				fs));
}

function CalculateTax() {
	let end_of_year					= 0;
	let total_income_wo_taxable_ss	= 0;
	let taxable_ss					= 0;
	let agi_7_percent				= 0;
	let total_medical_deductions	= 0;
	let medical_mileage_deduction	= 0;
	let medical_deductions			= 0;
	let salt_taxes					= 0;
	let itemized_deductions			= 0;
	let std_deduction				= 0;
	let non_itemized_deductions		= 0;

	InitializeTaxTables(filing_status, tax_year);

	todays_date						= new Date().toLocaleDateString();
	end_of_year						= new Date("12/31/" + tax_year);
	taxpayers_age					= Age(taxpayers_birthday, end_of_year);
	if (strCaseEqual(filing_status, "MFJ")) {
		spouses_age					= Age(spouses_birthday, end_of_year);
	}

	CheckInputValues();
	medical_mileage_deduction		= getMedicalMileageDeduction(medical_miles);	// Convert miles to dollars
	
	// Income
	retirement_accounts				= Max(0, retirement_accounts - qualified_charitable_distribution);
	total_income_wo_taxable_ss		= wages +
										taxable_interest +
										ordinary_dividends +
										retirement_accounts +
										capital_gains +
										self_employment_income +
										other_income;
	
	non_itemized_deductions			= qualified_business_income_deduction +
										qualified_tips_deduction +
										qualified_overtime_deduction +
										car_loan_interest_deduction +
										senior_deduction;

	adjustments						= educator_expenses +
										health_savings_account +
										self_employment_tax_adjustment +
										self_employed_health_insurance +
										early_withdrawal_penalty +
										alimony_paid +
										ira_contributions +
										student_loan_interest +
										other_adjustments;
										
	taxable_ss						= getTaxableSocialSecurity(
										filing_status,
										social_security,
										total_income_wo_taxable_ss,
										tax_exempt_interest,
										adjustments - student_loan_interest);

	total_income					= total_income_wo_taxable_ss + taxable_ss;

	adjusted_gross_income			= Max(total_income - adjustments, 0);
	
	// Deductions
	total_medical_deductions		= medical_insurance +
										doctor_visits +
										prescription_drugs +
										medical_aids +
										other_medical_expenses +
										ltc_taxpayer +
										ltc_spouse +
										medical_mileage_deduction;

	agi_7_percent					= Round(adjusted_gross_income * 0.075);
	medical_deductions				= Max(total_medical_deductions - agi_7_percent, 0);

	salt_taxes						= Max(state_income_tax, sales_tax) +
											real_estate_property_tax +
											personal_property_tax;
	salt_taxes						= Min(salt_taxes, getTaxValue("MaxSALT"));

	itemized_deductions				= medical_deductions +
										salt_taxes +
										mortgage_interest +
										cash_gifts_to_charity +
										noncash_gifts_to_charity;

	std_deduction					= getStandardDeduction(filing_status, taxpayers_age, spouses_age);
	deductions						= Max(itemized_deductions, std_deduction) + non_itemized_deductions;

	taxable_income					= Max(adjusted_gross_income - deductions, 0);
	
	// Credits
	nonrefundable_credits			= american_opp_credit_no_refund +
										child_care_credit +
										child_tax_credit +
										foreign_tax_credit +
										lifetime_learning_credit +
										residential_energy_credit +
										retirement_savings_credit +
										other_nonrefundable_credits;

	refundable_credits				= american_opp_credit_refundable +
										credit_for_other_dependents +
										earned_income_credit +
										premium_tax_credit +
										other_refundable_credits;

	// Payments
	payments						= withholding + estimated_tax_paid;

	// Taxes
	total_other_taxes				= self_employment_tax +
										early_withdrawal_tax +
										other_taxes;
										
	tax_on_taxable_income			= getIncomeTax(
											filing_status,
											taxable_income,
											qualified_dividends,
											capital_gains);
	
	total_tax						= Max(tax_on_taxable_income +
										total_other_taxes -
										nonrefundable_credits, 0);

	amount_due						= payments + refundable_credits - total_tax;
	estimated_tax					= Round(Max(0, estimated_tax_paid - amount_due) / 4);

	// Fields where input was limited,
	putDebugOutput("Debug01", educator_expenses,			"Limited Educator Expenses");
	putDebugOutput("Debug02", capital_gains,				"Limited Capital Gains");
	putDebugOutput("Debug03", student_loan_interest,		"Limited Student Loan Interest");
	putDebugOutput("Debug04", ltc_taxpayer,					"Limited Taxpayer LTC");
	putDebugOutput("Debug05", ltc_spouse,					"Limited Spouse LTC");
	
	putDebugOutput("Debug06", foreign_tax_credit,			"Limited Foreign Tax Credit");
	putDebugOutput("Debug07", qualified_tips_deduction,		"Limited Tips Deduction");
	putDebugOutput("Debug08", qualified_overtime_deduction,	"Limited Overtime Deduction");
	putDebugOutput("Debug09", car_loan_interest_deduction,	"Limited Car Loan Interest Deduction");
	putDebugOutput("Debug10", senior_deduction,				"Limited Senior Deduction");
	
	putDebugOutput("Debug11", total_income_wo_taxable_ss,	"Total Income w/o SS");
	putDebugOutput("Debug12", taxable_ss,					"Taxable SS");
	putDebugOutput("Debug13", agi_7_percent,				"7.5% of AGI");
	putDebugOutput("Debug14", total_medical_deductions,		"Total Medical Deductions");
	putDebugOutput("Debug15", medical_mileage_deduction,	"Medical Mileage Deduction");
	
	putDebugOutput("Debug16", medical_deductions,			"Medical Deductions less 7.5% AGI");
	putDebugOutput("Debug17", salt_taxes,					"SALT Taxes");
	putDebugOutput("Debug18", itemized_deductions,			"Itemized Dedbuctions");
	putDebugOutput("Debug19", std_deduction,				"Standard Deduction");
	putDebugOutput("Debug20", non_itemized_deductions,		"Non-itemized Deductions");
}

function GetInputValues() {
	// Copy input data from web page to local variables.
	tax_year							= getUserInput("TaxYear");
	
	// Taxpayer Information
	taxpayers_name						= getUserInput("TaxpayersName",		"text");
	filing_status						= getUserInput("FilingStatus",		"text");
	taxpayers_birthday					= getUserInput("TaxpayersBirthday",	"text");
	spouses_birthday					= getUserInput("SpousesBirthday",	"text");

	// Estimated Tax
	total_income						= 0;
	adjustments							= 0;
	adjusted_gross_income				= 0;
	deductions							= 0;
	taxable_income						= 0;
	tax_on_taxable_income				= 0;
	total_other_taxes					= 0;
	total_tax							= 0;
	nonrefundable_credits				= 0;
	refundable_credits					= 0;
	payments							= 0;
	amount_due							= 0;
	estimated_tax						= 0;

	// Income
	wages								= getUserInput("Wages");
	tax_exempt_interest					= getUserInput("TaxExemptInterest");
	taxable_interest					= getUserInput("TaxableInterest");
	qualified_dividends					= getUserInput("QualifiedDividends");
	ordinary_dividends					= getUserInput("OrdinaryDividends");
	retirement_accounts					= getUserInput("RetirementAccounts");
	social_security						= getUserInput("SocialSecurity");
	capital_gains						= getUserInput("CapitalGains");
	self_employment_income				= getUserInput("SelfEmploymentIncome");
	other_income						= getUserInput("OtherIncome");

	// Other Taxes
	self_employment_tax					= getUserInput("SelfEmploymentTax");
	early_withdrawal_tax				= getUserInput("EarlyWithdrawalTax");
	other_taxes							= getUserInput("OtherTaxes");

	// Adjustments
	educator_expenses					= getUserInput("EducatorExpenses");
	health_savings_account				= getUserInput("HealthSavingsAccount");
	self_employment_tax_adjustment		= getUserInput("SelfEmploymentTaxAdjustment");
	self_employed_health_insurance		= getUserInput("SelfEmployedHealthInsurance");
	early_withdrawal_penalty			= getUserInput("EarlyWithdrawalPenalty");
	alimony_paid						= getUserInput("AlimonyPaid");
	ira_contributions					= getUserInput("IRAContributions");
	student_loan_interest				= getUserInput("StudentLoanInterest");
	other_adjustments					= getUserInput("OtherAdjustments");

	// Deductions (non-itemized)
	qualified_business_income_deduction	= getUserInput("QualifiedBusinessIncomeDeduction");
	qualified_tips_deduction			= getUserInput("QualifiedTipsDeduction");
	qualified_overtime_deduction		= getUserInput("QualifiedOvertimeDeduction");
	car_loan_interest_deduction			= getUserInput("CarLoanInterestDeduction");
	senior_deduction					= getUserInput("SeniorDeduction");

	// Deductions (itemized)
	medical_insurance					= getUserInput("MedicalInsurance");
	doctor_visits						= getUserInput("DoctorVisits");
	prescription_drugs					= getUserInput("PrescriptionDrugs");
	medical_aids						= getUserInput("MedicalAids");
	other_medical_expenses				= getUserInput("OtherMedicalExpenses");
	ltc_taxpayer						= getUserInput("LTCTaxpayer");
	ltc_spouse							= getUserInput("LTCSpouse");
	medical_miles						= getUserInput("MedicalMiles");
	state_income_tax					= getUserInput("StateIncomeTax");
	sales_tax							= getUserInput("SalesTax");
	real_estate_property_tax			= getUserInput("RealEstatePropertyTax");
	personal_property_tax				= getUserInput("PersonalPropertyTax");
	mortgage_interest					= getUserInput("MortgageInterest");
	cash_gifts_to_charity				= getUserInput("CashGiftsToCharity");
	noncash_gifts_to_charity			= getUserInput("NoncashGiftsToCharity");
	qualified_charitable_distribution	= getUserInput("QualifiedCharitableDistribution");

	// Non-redundable Credits
	american_opp_credit_no_refund		= getUserInput("AmericanOppCreditNoRefund");
	child_care_credit					= getUserInput("ChildCareCredit");
	child_tax_credit					= getUserInput("ChildTaxCredit");
	foreign_tax_credit					= getUserInput("ForeignTaxCredit");
	lifetime_learning_credit			= getUserInput("LifetimeLearningCredit");
	residential_energy_credit			= getUserInput("ResidentialEnergyCredit");
	retirement_savings_credit			= getUserInput("RetirementSavingsCredit");
	other_nonrefundable_credits			= getUserInput("OtherNonrefundableCredits");

	// Refundable Credits
	american_opp_credit_refundable		= getUserInput("AmericanOppCreditRefundable");
	credit_for_other_dependents			= getUserInput("CreditForOtherDependents");
	earned_income_credit				= getUserInput("EarnedIncomeCredit");
	premium_tax_credit					= getUserInput("PremiumTaxCredit");
	other_refundable_credits			= getUserInput("OtherRefundableCredits");

	// Payments
	withholding							= getUserInput("Withholding");
	estimated_tax_paid					= getUserInput("EstimatedTaxPaid");
}

function PutResults() {

	putUserOutput("TodaysDate",				todays_date, "text");
	
	// Update the estimated tax on the web page.
	putUserOutput("TaxpayersAge",			taxpayers_age);
	putUserOutput("SpousesAge",				spouses_age);
	putUserOutput("TotalIncome",			total_income);
	putUserOutput("Adjustments",			adjustments);
	putUserOutput("AdjustedGrossIncome",	adjusted_gross_income);
	putUserOutput("Deductions",				deductions);
	putUserOutput("TaxableIncome",			taxable_income);
	putUserOutput("TaxOnTaxableIncome",		tax_on_taxable_income);
	putUserOutput("TotalOtherTaxes",		total_other_taxes);
	putUserOutput("TotalTax",				total_tax);
	putUserOutput("NonrefundableCredits",	nonrefundable_credits);
	putUserOutput("RefundableCredits", 		refundable_credits);
	putUserOutput("Payments", 				payments);
	putUserOutput("AmountDue",				amount_due);
	putUserOutput("EstimatedTax",			estimated_tax);
}

function ChangeHandler(event) {
	// This is the function that is called if any input field is changed.
	TurnOffDebug();
	GetInputValues();
	CalculateTax();
	PutResults();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	dbgEnter("ContentLoaded");
	
	// Wait for the DOM to be fully loaded before trying to access any elements.

	// Listen for changes to the input data.
	addListener("TaxYear",							"change", ChangeHandler);
	addListener("SaveButton",						"click",  SaveUserData);
	addListener("InputFile",						"change", RestoreUserData);
	
	// Taxpayer information
	addListener("TaxpayersName",					"change", ChangeHandler);
	addListener("FilingStatus",						"change", ChangeHandler);
	addListener("TaxpayersBirthday",				"change", ChangeHandler);
	addListener("SpousesBirthday",					"change", ChangeHandler);

	// Income
	addListener("Wages",							"change", ChangeHandler);
	addListener("TaxExemptInterest",				"change", ChangeHandler);
	addListener("TaxableInterest",					"change", ChangeHandler);
	addListener("QualifiedDividends",				"change", ChangeHandler);
	addListener("OrdinaryDividends",				"change", ChangeHandler);
	addListener("RetirementAccounts",				"change", ChangeHandler);
	addListener("SocialSecurity",					"change", ChangeHandler);
	addListener("CapitalGains",						"change", ChangeHandler);
	addListener("SelfEmploymentIncome",				"change", ChangeHandler);
	addListener("OtherIncome",						"change", ChangeHandler);

	// Other Taxes
	addListener("SelfEmploymentTax",				"change", ChangeHandler);
	addListener("EarlyWithdrawalTax",				"change", ChangeHandler);
	addListener("OtherTaxes",						"change", ChangeHandler);

	// Adjustments
	addListener("EducatorExpenses",					"change", ChangeHandler);
	addListener("HealthSavingsAccount",				"change", ChangeHandler);
	addListener("SelfEmploymentTaxAdjustment",		"change", ChangeHandler);
	addListener("SelfEmployedHealthInsurance",		"change", ChangeHandler);
	addListener("EarlyWithdrawalPenalty",			"change", ChangeHandler);
	addListener("AlimonyPaid",						"change", ChangeHandler);
	addListener("IRAContributions",					"change", ChangeHandler);
	addListener("StudentLoanInterest",				"change", ChangeHandler);
	addListener("OtherAdjustments",					"change", ChangeHandler);

	// Deductions (non-itemized)
	addListener("QualifiedBusinessIncomeDeduction",	"change", ChangeHandler);
	addListener("QualifiedTipsDeduction",			"change", ChangeHandler);
	addListener("QualifiedOvertimeDeduction",		"change", ChangeHandler);
	addListener("CarLoanInterestDeduction",			"change", ChangeHandler);
	addListener("SeniorDeduction",					"change", ChangeHandler);

	// Deductions (itemized)
	addListener("MedicalInsurance",					"change", ChangeHandler);
	addListener("DoctorVisits",						"change", ChangeHandler);
	addListener("PrescriptionDrugs",				"change", ChangeHandler);
	addListener("MedicalAids",						"change", ChangeHandler);
	addListener("OtherMedicalExpenses",				"change", ChangeHandler);
	addListener("LTCTaxpayer",						"change", ChangeHandler);
	addListener("LTCSpouse",						"change", ChangeHandler);
	addListener("MedicalMiles",						"change", ChangeHandler);
	addListener("StateIncomeTax",					"change", ChangeHandler);
	addListener("SalesTax",							"change", ChangeHandler);
	addListener("RealEstatePropertyTax",			"change", ChangeHandler);
	addListener("PersonalPropertyTax",				"change", ChangeHandler);
	addListener("MortgageInterest",					"change", ChangeHandler);
	addListener("CashGiftsToCharity",				"change", ChangeHandler);
	addListener("NoncashGiftsToCharity",			"change", ChangeHandler);
	addListener("QualifiedCharitableDistribution",	"change", ChangeHandler);

	// Non-refundable Credits
	addListener("AmericanOppCreditNoRefund",		"change", ChangeHandler);
	addListener("ChildCareCredit",					"change", ChangeHandler);
	addListener("ChildTaxCredit",					"change", ChangeHandler);
	addListener("ForeignTaxCredit",					"change", ChangeHandler);
	addListener("LifetimeLearningCredit",			"change", ChangeHandler);
	addListener("ResidentialEnergyCredit",			"change", ChangeHandler);
	addListener("RetirementSavingsCredit",			"change", ChangeHandler);
	addListener("OtherNonrefundableCredits",		"change", ChangeHandler);

	// Refundable Credits
	addListener("AmericanOppCreditRefundable",		"change", ChangeHandler);
	addListener("CreditForOtherDependents",			"change", ChangeHandler);
	addListener("EarnedIncomeCredit",				"change", ChangeHandler);
	addListener("PremiumTaxCredit",					"change", ChangeHandler);
	addListener("OtherRefundableCredits",			"change", ChangeHandler);

	// Payments
	addListener("Withholding",						"change", ChangeHandler);
	addListener("EstimatedTaxPaid",					"change", ChangeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const TaxpayersName = document.getElementById('TaxpayersName');
	TaxpayersName.focus({
		preventScroll: true
	});

	tax_year = getTaxYear();	// Default tax year.
	putUserOutput("TaxYear", tax_year, "text");
	ChangeHandler();

	dbgExit("ContentLoaded");
});
