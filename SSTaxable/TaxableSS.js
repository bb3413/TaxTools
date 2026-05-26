
function CalculategetTaxableSocialSecurity() {
	const filing_status				= getUserInput("FilingStatus", "text");
	const lived_with_spouse			= getUserInput("LivedWithSpouse");
	const social_security			= getUserInput("SocialSecurity");
	const income					= getUserInput("Income");
	const tax_exempt_interest		= getUserInput("TaxExemptInterest");
	const adjustments				= getUserInput("Adjustments");
	let taxable_ss					= 0;
	let taxable_percent				= 0;
	
	InitializeTaxTables(filing_status);

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
	
	taxable_percent = (social_security === 0) ? 0 : Round(taxable_ss / social_security * 100);
	
	putUserOutput("TaxableSocialSecurity",	taxable_ss);
	putUserOutput("TaxablePercent",			taxable_percent + "%", "text");
}

function ChangeIncomeHandler(event) {
	Wages.value					= 0;
	TaxableInterest.value		= 0;
	OrdinaryDividends.value		= 0;
	RetirementAccounts.value	= 0;
	PensionsAndAnnuities.value	= 0;
	CapitalGains.value			= 0;
	SelfEmploymentIncome.value	= 0;
	OtherIncome.value			= 0;
	
	ChangeHandler(event);
}

function ChangeIncomeComponentHandler(event) {
	const wages					= getUserInput("Wages");
	const taxable_interest		= getUserInput("TaxableInterest");
	const ordinary_dividends	= getUserInput("OrdinaryDividends");
	const retirement_accounts	= getUserInput("RetirementAccounts");
	const pensions_and_annuities= getUserInput("PensionsAndAnnuities");
	const capital_gains			= getUserInput("CapitalGains");
	const self_employment_income= getUserInput("SelfEmploymentIncome");
	const other_income			= getUserInput("OtherIncome");
	
	const total_income				= wages +
										taxable_interest +
										ordinary_dividends +
										retirement_accounts +
										pensions_and_annuities +
										capital_gains +
										self_employment_income +
										other_income;
									
	putUserOutput("Income", total_income);
	ChangeHandler(event);
}

function ChangeAdjustmentsHandler(event) {
	EducatorExpenses.value				= 0;
	HealthSavingsAccount.value			= 0;
	SelfEmploymentTaxAdjustment.value	= 0;
	SelfEmployedHealthInsurance.value	= 0;
	EarlyWithdrawalPenalty.value		= 0;
	AlimonyPaid.value					= 0;
	IRAContributions.value				= 0;
	StudentLoanInterest.value			= 0;
	OtherAdjustments.value				= 0;
	
	ChangeHandler(event);
}

function ChangeAdjustmentComponentHandler(event) {
	const educator_expenses				= getUserInput("EducatorExpenses");
	const health_savings_account		= getUserInput("HealthSavingsAccount");
	const self_employment_tax_adjustment= getUserInput("SelfEmploymentTaxAdjustment");
	const self_employed_health_insurance= getUserInput("SelfEmployedHealthInsurance");
	const early_withdrawal_penalty		= getUserInput("EarlyWithdrawalPenalty");
	const alimony_paid					= getUserInput("AlimonyPaid");
	const ira_contributions				= getUserInput("IRAContributions");
	const student_loan_interest			= getUserInput("StudentLoanInterest");
	const other_adjustments				= getUserInput("OtherAdjustments");
	
	const total_adjustments				= educator_expenses +
											health_savings_account +
											self_employment_tax_adjustment +
											self_employed_health_insurance +
											early_withdrawal_penalty +
											alimony_paid +
											ira_contributions +
											// student_loan_interest +
											other_adjustments;
											
	putUserOutput("Adjustments", total_adjustmentsw);
	ChangeHandler(event);
}

function ChangeHandler(event) {
	// This is the function that is called if any input field is changed.
	TurnOffDebug();
	CalculategetTaxableSocialSecurity();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.	

	addListener("FilingStatus",					"change", ChangeHandler);
	addListener("LivedWithSpouse",				"change", ChangeHandler);
	addListener("SocialSecurity",				"change", ChangeHandler);
	addListener("Income",						"change", ChangeIncomeHandler);
	addListener("TaxExemptInterest",			"change", ChangeHandler);
	addListener("Adjustments",					"change", ChangeAdjustmentsHandler);

	// Income
	addListener("Wages",						"change", ChangeIncomeComponentHandler);
	addListener("TaxableInterest",				"change", ChangeIncomeComponentHandler);
	addListener("OrdinaryDividends",			"change", ChangeIncomeComponentHandler);
	addListener("RetirementAccounts",			"change", ChangeIncomeComponentHandler);
	addListener("PensionsAndAnnuities",			"change", ChangeIncomeComponentHandler);
	addListener("CapitalGains",					"change", ChangeIncomeComponentHandler);
	addListener("SelfEmploymentIncome",			"change", ChangeIncomeComponentHandler);
	addListener("OtherIncome",					"change", ChangeIncomeComponentHandler);
	
	// Adjustments
	addListener("EducatorExpenses",				"change", ChangeAdjustmentComponentHandler);			
	addListener("HealthSavingsAccount",			"change", ChangeAdjustmentComponentHandler);			
	addListener("SelfEmploymentTaxAdjustment",	"change", ChangeAdjustmentComponentHandler);		
	addListener("SelfEmployedHealthInsurance",	"change", ChangeAdjustmentComponentHandler);			
	addListener("EarlyWithdrawalPenalty",		"change", ChangeAdjustmentComponentHandler);			
	addListener("AlimonyPaid",					"change", ChangeAdjustmentComponentHandler);		
	addListener("IRAContributions",				"change", ChangeAdjustmentComponentHandler);		
	addListener("StudentLoanInterest",			"change", ChangeAdjustmentComponentHandler);;			
	addListener("OtherAdjustments",				"change", ChangeAdjustmentComponentHandler);

	ChangeHandler();
});
