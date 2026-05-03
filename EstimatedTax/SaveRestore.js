
let ud = {
	tax_year:								0,

	// Taxpayer Information
	taxpayers_name:							"",
	filing_status:							"",
	taxpayers_birthday:						"",
	spouses_birthday:						"",
	todays_date:							"",
	tax_tools_version:						"",
	taxpayers_age:							0,
	spouses_age:							0,

	// Estimated Tax
	total_income:							0,
	adjustments:							0,
	adjusted_gross_income:					0,
	deductions:								0,
	taxable_income:							0,
	tax_on_taxable_income:					0,
	total_other_taxes:						0,
	nonrefundable_credits:					0,
	total_tax:								0,
	refundable_credits:						0,
	payments:								0,
	amount_due:								0,
	estimated_tax:							0,

	// Income
	wages:									0,
	tax_exempt_interest:					0,
	taxable_interest:						0,
	qualified_dividends:					0,
	ordinary_dividends:						0,
	retirement_accounts:					0,
	social_security:						0,
	capital_gains:							0,
	self_employment_income:					0,
	other_income:							0,
	
	// Other Taxes
	self_employment_tax:					0,
	early_withdrawal_tax:					0,
	other_taxes:							0,

	// Adjustments
	educator_expenses:						0,
	health_savings_account:					0,
	self_employment_tax_adjustment:			0,
	self_employed_health_insurance:			0,
	early_withdrawal_penalty:				0,
	alimony_paid:							0,
	ira_contributions:						0,
	student_loan_interest:					0,
	other_adjustments:						0,

	// Deductions (non-itemized)
	qualified_business_income_deduction:	0,
	qualified_tips_deduction:				0,
	qualified_overtime_deduction:			0,
	car_loan_interest_deduction:			0,
	senior_deduction:						0,

	// Deductions (itemized)
	medical_insurance:						0,
	doctor_visits:							0,
	prescription_drugs:						0,
	medical_aids:							0,
	LTCTaxpayer:							0,
	ltc_spouse:								0,
	medical_miles:							0,
	other_medical_expenses:					0,
	state_income_tax:						0,
	sales_tax:								0,
	real_estate_property_tax:				0,
	personal_property_tax:					0,
	mortgage_interest:						0,
	cash_gifts_to_charity:					0,
	noncash_gifts_to_charity:				0,
	qualified_charitable_distribution:		0,
	
	// Non-redundable Credits
	american_opp_credit_no_refund:			0,		
	child_care_credit:						0,		
	child_tax_credit:						0,		
	foreign_tax_credit:						0,		
	lifetime_learning_credit:				0,		
	residential_energy_credit:				0,		
	retirement_savings_credit:				0,		
	other_nonrefundable_credits:			0,		

	// Refundable Credits
	american_opp_credit_refundable:			0,		
	credit_for_other_dependents:			0,		
	earned_income_credit:					0,		
	premium_tax_credit:						0,		
	other_refundable_credits:				0,		

	// Payments
	withholding:							0,
	estimated_tax_paid:						0,
};

function SaveVariables() {
	
	// Save the outpout fields.
	ud.todays_date							= todays_date;
	ud.tax_tools_version					= tax_tools_version;
	ud.taxpayers_age						= taxpayers_age;
	ud.spouses_age							= spouses_age;
	
	// Estimated Tax
	ud.total_income							= total_income;
	ud.adjustments							= adjustments;
	ud.adjusted_gross_income				= adjusted_gross_income;
	ud.deductions							= deductions;
	ud.taxable_income						= taxable_income;
	ud.tax_on_taxable_income				= tax_on_taxable_income;
	ud.total_other_taxes					= total_other_taxes;
	ud.nonrefundable_credits				= nonrefundable_credits;
	ud.total_tax							= total_tax;
	ud.refundable_credits					= refundable_credits;
	ud.payments								= payments;
	ud.amount_due							= amount_due;
	ud.estimated_tax						= estimated_tax;
	
	// Save the input fields.
	ud.tax_year								= tax_year;

	// Taxpayer Information
	ud.taxpayers_name						= taxpayers_name;
	ud.filing_status						= filing_status;
	ud.taxpayers_birthday					= taxpayers_birthday;
	ud.spouses_birthday						= spouses_birthday;

	// Income
	ud.wages								= wages;
	ud.tax_exempt_interest					= tax_exempt_interest;
	ud.taxable_interest						= taxable_interest;
	ud.qualified_dividends					= qualified_dividends;
	ud.ordinary_dividends					= ordinary_dividends;
	ud.retirement_accounts					= retirement_accounts;
	ud.social_security						= social_security;
	ud.capital_gains						= capital_gains;
	ud.self_employment_income				= self_employment_income;
	ud.other_income							= other_income;
	
	// Other Taxes
	ud.self_employment_tax					= self_employment_tax;
	ud.early_withdrawal_tax					= early_withdrawal_tax;
	ud.other_taxes							= other_taxes;
	
	// Adjustments
	ud.educator_expenses					= educator_expenses;
	ud.health_savings_account				= health_savings_account;
	ud.self_employment_tax_adjustment		= self_employment_tax_adjustment;
	ud.self_employed_health_insurance		= self_employed_health_insurance;
	ud.early_withdrawal_penalty				= early_withdrawal_penalty;
	ud.alimony_paid							= alimony_paid;
	ud.ira_contributions					= ira_contributions;
	ud.student_loan_interest				= student_loan_interest;
	ud.other_adjustments					= other_adjustments;

	// Deductions (non-itemized)
	ud.qualified_business_income_deduction	= qualified_business_income_deduction;
	ud.qualified_tips_deduction				= qualified_tips_deduction;
	ud.qualified_overtime_deduction			= qualified_overtime_deduction;
	ud.car_loan_interest_deduction			= car_loan_interest_deduction;
	ud.senior_deduction						= senior_deduction;

	// Deductions (itemized)
	ud.medical_insurance					= medical_insurance;
	ud.doctor_visits						= doctor_visits;
	ud.prescription_drugs					= prescription_drugs;
	ud.medical_aids							= medical_aids;
	ud.LTCTaxpayer							= ltc_taxpayer;
	ud.ltc_spouse							= ltc_spouse;
	ud.medical_miles						= medical_miles;
	ud.other_medical_expenses				= other_medical_expenses;
	ud.state_income_tax						= state_income_tax;
	ud.sales_tax							= sales_tax;
	ud.real_estate_property_tax				= property_tax;
	ud.personal_property_tax				= personal_property_tax;
	ud.mortgage_interest					= mortgage_interest;
	ud.cash_gifts_to_charity				= cash_gifts_to_charity;
	ud.noncash_gifts_to_charity				= noncash_gifts_to_charity;
	ud.qualified_charitable_distribution	= qualified_charitable_distribution;

	// Non-redundable Credits
	ud.american_opp_credit_no_refund		= american_opp_credit_no_refund;
	ud.child_care_credit					= child_care_credit;
	ud.child_tax_credit						= child_tax_credit;
	ud.foreign_tax_credit					= foreign_tax_credit;
	ud.lifetime_learning_credit				= lifetime_learning_credit;
	ud.residential_energy_credit			= residential_energy_credit;
	ud.retirement_savings_credit			= retirement_savings_credit;
	ud.other_nonrefundable_credits			= other_nonrefundable_credits;

	// Refundable Credits
	ud.american_opp_credit_refundable		= american_opp_credit_refundable;
	ud.credit_for_other_dependents			= credit_for_other_dependents;
	ud.earned_income_credit					= earned_income_credit;
	ud.premium_tax_credit					= premium_tax_credit;
	ud.other_refundable_credits				= other_refundable_credits;

	// Payments
	ud.withholding							= withholding;
	ud.estimated_tax_paid					= estimated_tax_paid;
}

function SaveInputFields() {
	
	// Save the outpout fields.
	ud.todays_date							= getElementValue("TodaysDate");
	ud.tax_tools_version					= getElementValue("TaxToolsVersion");
	ud.taxpayers_age						= getElementValue("TaxpayersAge");
	ud.spouses_age							= getElementValue("SpousesAge");

	// Estimated Tax
	ud.total_income							= getElementValue("TotalIncome");
	ud.adjustments							= getElementValue("Adjustments");
	ud.adjusted_gross_income				= getElementValue("AdjustedGrossIncome");
	ud.deductions							= getElementValue("Deductions");
	ud.taxable_income						= getElementValue("TaxableIncome");
	ud.tax_on_taxable_income				= getElementValue("TaxOnTaxableIncome");
	ud.total_other_taxes					= getElementValue("TotalOtherTaxes");
	ud.nonrefundable_credits				= getElementValue("NonrefundableCredits");
	ud.total_tax							= getElementValue("TotalTax");
	ud.refundable_credits					= getElementValue("RefundableCredits");
	ud.payments								= getElementValue("Payments");
	ud.amount_due							= getElementValue("AmountDue");
	ud.estimated_tax						= getElementValue("EstimatedTax");
	
	
	// Save the input fields.
	ud.tax_year								= getElementValue("TaxYear");

	// Taxpayer Information
	ud.taxpayers_name						= getElementValue("TaxpayersName");
	ud.filing_status						= getElementValue("FilingStatus");
	ud.taxpayers_birthday					= getElementValue("TaxpayersBirthday");
	ud.spouses_birthday						= getElementValue("SpousesBirthday");


	// Income
	ud.wages								= getElementValue("Wages");
	ud.tax_exempt_interest					= getElementValue("TaxExemptInterest");
	ud.taxable_interest						= getElementValue("TaxableInterest");
	ud.qualified_dividends					= getElementValue("QualifiedDividends");
	ud.ordinary_dividends					= getElementValue("OrdinaryDividends");
	ud.retirement_accounts					= getElementValue("RetirementAccounts");
	ud.social_security						= getElementValue("SocialSecurity");
	ud.capital_gains						= getElementValue("CapitalGains");
	ud.self_employment_income				= getElementValue("SelfEmploymentIncome");
	ud.other_income							= getElementValue("OtherIncome");
	
	// Other Taxes
	ud.self_employment_tax					= getElementValue("SelfEmploymentTax");
	ud.early_withdrawal_tax					= getElementValue("EarlyWithdrawalTax");
	ud.other_taxes							= getElementValue("OtherTaxes");
	
	// Adjustments
	ud.educator_expenses					= getElementValue("EducatorExpenses");
	ud.health_savings_account				= getElementValue("HealthSavingsAccount");
	ud.self_employment_tax_adjustment		= getElementValue("SelfEmploymentTaxAdjustment");
	ud.self_employed_health_insurance		= getElementValue("SelfEmployedHealthInsurance");
	ud.early_withdrawal_penalty				= getElementValue("EarlyWithdrawalPenalty");
	ud.alimony_paid							= getElementValue("AlimonyPaid");
	ud.ira_contributions					= getElementValue("IRAContributions");
	ud.student_loan_interest				= getElementValue("StudentLoanInterest");
	ud.other_adjustments					= getElementValue("OtherAdjustments");

	// Deductions (non-itemized)
	ud.qualified_business_income_deduction	= getElementValue("QualifiedBusinessIncomeDeduction");
	ud.qualified_tips_deduction				= getElementValue("QualifiedTipsDeduction");
	ud.qualified_overtime_deduction			= getElementValue("QualifiedOvertimeDeduction");
	ud.car_loan_interest_deduction			= getElementValue("CarLoanInterestDeduction");
	ud.senior_deduction						= getElementValue("SeniorDeduction");

	// Deductions (itemized)
	ud.medical_insurance					= getElementValue("MedicalInsurance");
	ud.doctor_visits						= getElementValue("DoctorVisits");
	ud.prescription_drugs					= getElementValue("PrescriptionDrugs");
	ud.medical_aids							= getElementValue("MedicalAids");
	ud.ltc_taxpayer							= getElementValue("LTCTaxpayer");
	ud.ltc_spouse							= getElementValue("LTCSpouse");
	ud.medical_miles						= getElementValue("MedicalMiles");
	ud.other_medical_expenses				= getElementValue("OtherMedicalExpenses");
	ud.state_income_tax						= getElementValue("StateIncomeTax");
	ud.sales_tax							= getElementValue("SalesTax");
	ud.real_estate_property_tax				= getElementValue("RealEstatePropertyTax");
	ud.personal_property_tax				= getElementValue("PersonalPropertyTax");
	ud.mortgage_interest					= getElementValue("MortgageInterest");
	ud.cash_gifts_to_charity				= getElementValue("CashGiftsToCharity");
	ud.noncash_gifts_to_charity				= getElementValue("NoncashGiftsToCharity");
	ud.qualified_charitable_distribution	= getElementValue("QualifiedCharitableDistribution");

	// Non-redundable Credits
	ud.american_opp_credit_no_refund		= getElementValue("AmericanOppCreditNoRefund");
	ud.child_care_credit					= getElementValue("ChildCareCredit");
	ud.child_tax_credit						= getElementValue("ChildTaxCredit");
	ud.foreign_tax_credit					= getElementValue("ForeignTaxCredit");
	ud.lifetime_learning_credit				= getElementValue("LifetimeLearningCredit");
	ud.residential_energy_credit			= getElementValue("ResidentialEnergyCredit");
	ud.retirement_savings_credit			= getElementValue("RetirementSavingsCredit");
	ud.other_nonrefundable_credits			= getElementValue("OtherNonrefundableCredits");

	// Refundable Credits
	ud.american_opp_credit_refundable		= getElementValue("AmericanOppCreditRefundable");
	ud.credit_for_other_dependents			= getElementValue("CreditForOtherDependents");
	ud.earned_income_credit					= getElementValue("EarnedIncomeCredit");
	ud.premium_tax_credit					= getElementValue("PremiumTaxCredit");
	ud.other_refundable_credits				= getElementValue("OtherRefundableCredits");
	
	// Payments
	ud.withholding							= getElementValue("Withholding");
	ud.estimated_tax_paid					= getElementValue("EstimatedTaxPaid");
}

function RestoreInputFields() {
	
	// Restore the output fields.
	// putElementValue("TodaysDate",					ud.todays_date);
	// putElementValue("TaxToolsVersion",				ud.tax_tools_version);
	// putElementValue("TaxpayersAge",					ud.taxpayers_age);
	// putElementValue("SpousesAge",					ud.spouses_age);

	// Estimated Tax
	// putElementValue("TotalIncome",					ud.total_income);
	// putElementValue("Adjustments",					ud.adjustments);
	// putElementValue("AdjustedGrossIncome",			ud.adjusted_gross_income);
	// putElementValue("Deductions",					ud.deductions);
	// putElementValue("TaxableIncome",					ud.taxable_income);
	// putElementValue("TaxOnTaxableIncome",			ud.tax_on_taxable_income);
	// putElementValue("TotalOtherTaxes",				ud.total_other_taxes);
	// putElementValue("NonrefundableCredits",			ud.nonrefundable_credits);
	// putElementValue("TotalTax",						ud.total_tax);
	// putElementValue("RefundableCredits",				ud.refundable_credits);
	// putElementValue("Payments",						ud.payments);
	// putElementValue("AmountDue",						ud.amount_due);
	// putElementValue("EstimatedTax",					ud.estimated_tax);
	
	
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
}

function SaveUserData(event) {
	// Called when the Save button is pressed. Copy the user data to a ud object
	// and save it to the user's Download folder.
	SaveInputFields();		// Copy from input fields to the ud object.

	// The "blob" is something like a file that you will be able to reference with a URL.
	// The URL is a tempory URL pointing to the blob. Create an anchor HTML element that
	// reference the URL. Add the anchor to the HTML document. Fake a click on the anchor,
	// which will start the download, then remove the anchor and URL.
	const filename		= "EstimatedTax.txt";
	const jasonString	= JSON.stringify(ud, null, 2);
	const blob			= new Blob([jasonString], {type: "text/plain"});
	const url			= URL.createObjectURL(blob);
	const a				= document.createElement("a");
	a.href				= url;
	a.download			= filename;

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function RestoreUserData(event) {
	// Called when the file selection box triggers a change event.

	// The file selection dialog gets a list of files. Only one should be passed
	// in our case; select the first file and ignore the rest.
	const file = event.target.files[0];
	if (!file) {
		alert("No file selected.");
		return;
	}

	// Get an object that handles reading the file.
	const reader = new FileReader();

	// Define a handler to process the file once it is read.
	reader.onload = function(event) {
		// Reading the file is asynchronous. When this event fires, the data is ready.
		try {
			// The file content is stored in e.target.result as a string.
			ud = JSON.parse(event.target.result);

			// The data is back in the ud object. Put it into the
			// HTML fields on the web page.
			RestoreInputFields();	// Copy from the ud object to the HTML fields.

			// Recalculate the estimated tax as if the user changed a field
			// on the web page.
			ChangeHandler();	// Update the calculation.

		} catch (error) {
			alert("Error parsing file.");
			console.error(error);
		}
	}

	// Define a handler in case the file cannot be read.
	reader.onerror = function() {
		alert("Error reading file.");
	}

	// Start reading the file.
	reader.readAsText(file);
}
