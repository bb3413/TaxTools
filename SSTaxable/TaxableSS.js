
function calculategetTaxableSocialSecurity() {
	const filing_status				= HTML.getUserInput("FilingStatus", "text");
	const lived_with_spouse			= HTML.getUserInput("LivedWithSpouse");
	const social_security			= HTML.getUserInput("SocialSecurity");
	const income					= HTML.getUserInput("Income");
	const tax_exempt_interest		= HTML.getUserInput("TaxExemptInterest");
	const adjustments				= HTML.getUserInput("Adjustments");
	let taxable_ss					= 0;
	let taxable_percent				= 0;

	initializeTaxTables(filing_status);

	if (strCaseEqual(filing_status, "MFS")) {
		showElement("LivedWithSpouseContainer");
	} else {
		hideElement("LivedWithSpouseContainer");
	}

	taxable_ss = getTaxableSocialSecurity(
					filing_status,
					social_security,
					income,
					tax_exempt_interest,
					adjustments,
					lived_with_spouse);

	taxable_percent = (social_security === 0) ? 0 : round(taxable_ss / social_security * 100);

	HTML.putUserOutput("TaxableSocialSecurity",	taxable_ss);
	HTML.putUserOutput("TaxablePercent",			taxable_percent + "%", "text");
}

function changeIncomeHandler(event) {
	Wages.value					= 0;
	TaxableInterest.value		= 0;
	OrdinaryDividends.value		= 0;
	RetirementAccounts.value	= 0;
	PensionsAndAnnuities.value	= 0;
	CapitalGains.value			= 0;
	SelfEmploymentIncome.value	= 0;
	OtherIncome.value			= 0;

	changeHandler(event);
}

function changeIncomeComponentHandler(event) {
	const wages					= HTML.getUserInput("Wages");
	const taxable_interest		= HTML.getUserInput("TaxableInterest");
	const ordinary_dividends	= HTML.getUserInput("OrdinaryDividends");
	const retirement_accounts	= HTML.getUserInput("RetirementAccounts");
	const pensions_and_annuities= HTML.getUserInput("PensionsAndAnnuities");
	const capital_gains			= HTML.getUserInput("CapitalGains");
	const self_employment_income= HTML.getUserInput("SelfEmploymentIncome");
	const other_income			= HTML.getUserInput("OtherIncome");

	const total_income				= wages +
										taxable_interest +
										ordinary_dividends +
										retirement_accounts +
										pensions_and_annuities +
										capital_gains +
										self_employment_income +
										other_income;

	HTML.putUserOutput("Income", total_income);
	changeHandler(event);
}

function changeAdjustmentsHandler(event) {
	EducatorExpenses.value				= 0;
	HealthSavingsAccount.value			= 0;
	SelfEmploymentTaxAdjustment.value	= 0;
	SelfEmployedHealthInsurance.value	= 0;
	EarlyWithdrawalPenalty.value		= 0;
	AlimonyPaid.value					= 0;
	IRAContributions.value				= 0;
	StudentLoanInterest.value			= 0;
	OtherAdjustments.value				= 0;

	changeHandler(event);
}

function ChangeAdjustmentComponentHandler(event) {
	const educator_expenses				= HTML.getUserInput("EducatorExpenses");
	const health_savings_account		= HTML.getUserInput("HealthSavingsAccount");
	const self_employment_tax_adjustment= HTML.getUserInput("SelfEmploymentTaxAdjustment");
	const self_employed_health_insurance= HTML.getUserInput("SelfEmployedHealthInsurance");
	const early_withdrawal_penalty		= HTML.getUserInput("EarlyWithdrawalPenalty");
	const alimony_paid					= HTML.getUserInput("AlimonyPaid");
	const ira_contributions				= HTML.getUserInput("IRAContributions");
	const student_loan_interest			= HTML.getUserInput("StudentLoanInterest");
	const other_adjustments				= HTML.getUserInput("OtherAdjustments");

	const total_adjustments				= educator_expenses +
											health_savings_account +
											self_employment_tax_adjustment +
											self_employed_health_insurance +
											early_withdrawal_penalty +
											alimony_paid +
											ira_contributions +
											// student_loan_interest +
											other_adjustments;

	HTML.putUserOutput("Adjustments", total_adjustmentsw);
	changeHandler(event);
}

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	Debug.reset();
	calculategetTaxableSocialSecurity();
	Debug.turnOn();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	HTML.addListener("FilingStatus",				"change", changeHandler);
	HTML.addListener("LivedWithSpouse",				"change", changeHandler);
	HTML.addListener("SocialSecurity",				"change", changeHandler);
	HTML.addListener("Income",						"change", changeIncomeHandler);
	HTML.addListener("TaxExemptInterest",			"change", changeHandler);
	HTML.addListener("Adjustments",					"change", changeAdjustmentsHandler);

	// Income
	HTML.addListener("Wages",						"change", changeIncomeComponentHandler);
	HTML.addListener("TaxableInterest",				"change", changeIncomeComponentHandler);
	HTML.addListener("OrdinaryDividends",			"change", changeIncomeComponentHandler);
	HTML.addListener("RetirementAccounts",			"change", changeIncomeComponentHandler);
	HTML.addListener("PensionsAndAnnuities",		"change", changeIncomeComponentHandler);
	HTML.addListener("CapitalGains",				"change", changeIncomeComponentHandler);
	HTML.addListener("SelfEmploymentIncome",		"change", changeIncomeComponentHandler);
	HTML.addListener("OtherIncome",					"change", changeIncomeComponentHandler);

	// Adjustments
	HTML.addListener("EducatorExpenses",			"change", ChangeAdjustmentComponentHandler);
	HTML.addListener("HealthSavingsAccount",		"change", ChangeAdjustmentComponentHandler);
	HTML.addListener("SelfEmploymentTaxAdjustment",	"change", ChangeAdjustmentComponentHandler);
	HTML.addListener("SelfEmployedHealthInsurance",	"change", ChangeAdjustmentComponentHandler);
	HTML.addListener("EarlyWithdrawalPenalty",		"change", ChangeAdjustmentComponentHandler);
	HTML.addListener("AlimonyPaid",					"change", ChangeAdjustmentComponentHandler);
	HTML.addListener("IRAContributions",			"change", ChangeAdjustmentComponentHandler);
	HTML.addListener("StudentLoanInterest",			"change", ChangeAdjustmentComponentHandler);;
	HTML.addListener("OtherAdjustments",			"change", ChangeAdjustmentComponentHandler);

	HTML.hideElement("LivedWithSpouseContainer");
	HTML.hideElement("DebugContainer");
});
