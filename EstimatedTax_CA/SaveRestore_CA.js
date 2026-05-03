
function RestoreInputFields() {
	// Restore HTML fields with user data from the ud object.

	TaxYear.value						= ud.tax_year;

	// Taxpayer Information
	TaxpayersName.value					= ud.taxpayers_name;
	FilingStatus.value					= ud.filing_status;
	TaxpayersBirthday.value				= ud.taxpayers_birthday;
	SpousesBirthday.value				= ud.spouses_birthday;

	// Input Data
	FederalAGI.value					= ud.federal_agi;
	NumberOfDependents.value			= ud.number_of_dependents;

	// Subtractions
	USTreasuryObligations.value			= ud.us_treasury_obligations;
	MilitaryRetirementIncome.value		= ud.military_retirement_income;
	TaxableSocialSecurity.value			= ud.taxable_social_security;
	StateTaxRefund.value				= ud.state_tax_refund;
	UnemploymentIncome.value			= ud.unemployment_income;
	CaliforniaLotteryWinnings.value		= ud.california_lottery_winnings;
	NonqualifiedHSADistributions.value	= ud.nonqualified_hsa_distributions;
	AlimonyPaid.value					= ud.alimony_paid;
	OtherSubtractions.value				= ud.other_subtractions;

	// Additions
	HSAEmployerContributions.value		= ud.hsa_employer_contributions;
	AlimonyReceived.value				= ud.alimony_received;
	HomeLoanDebtCancellation.value		= ud.home_loan_debt_cancellation;
	EmployerPaidStudentLoanPayments.value = ud.employer_paid_student_loan_payments;
	EducatorExpenses.value				= ud.educator_expenses;
	HSAContributions.value				= ud.hsa_contributions;
	IRAContributions.value				= ud.ira_contributions;
	OtherAdditions.value				= ud.other_additions;

	// Itemized Deductions
	FederalItemizedDeductions.value		= ud.federal_itemized_deductions;
	StateIncomeTax.value				= ud.state_income_tax;
	QualifiedHSADistributions.value		= ud.qualified_hsa_distributions;
	SALTLimitExcess.value				= ud.salt_limit_excess;
	HomeMortgageInterestLimit.value		= ud.home_mortgage_interest_limit;
	TaxPreparationFee.value				= ud.tax_preparation_fee;
	SafeDepositBox.value				= ud.safe_deposit_box;
	InvestmentFee.value					= ud.investment_fee;
	OtherDeductions.value				= ud.other_deductions;

	// Other Taxes, Interest, and Penalties
	SharedResponsibilityPenalty.value	= ud.shared_responsibility_penalty;
	InterestAndPenalties.value			= ud.interest_and_penalties;
	UnderepaymentOfEstimatedTax.value	= ud.underepayment_of_estimated_tax;
	UseTax.value						= ud.use_tax;
	MiscellaneousTaxes.value			= ud.miscellaneous_taxes;

	// Non-refundable Credits
	ChildCareCredit.value				= ud.child_care_credit;
	RentersCredit.value					= ud.renters_credit;
	OtherNonrefundableCredits.value		= ud.other_nonrefundable_credits;

	// Refundable Credits
	EITC.value							= ud.eitc;
	YoungChildTaxCredit.value			= ud.young_child_tax_credit;
	FosterYouthTaxCredit.value			= ud.foster_youth_tax_credit;
	OtherRefundableCredits.value		= ud.other_refundable_credits;

	// Payments
	Withholding.value					= ud.withholding;
	EstimatedPayments.value				= ud.estimated_payments;
	OtherPayments.value					= ud.other_payments;

	// Contributions
	Contributions.value					= ud.contributions;
}

function SaveUserData(event) {
	// This function is called when the Save button is pressed. All the user data as it was
	// entered by the user is in the ud object. This object also contains the values for fields
	// that were computed by this tool.  Use JSON to copy the ud object to the file
	// EstimatedTax_CA.txt in the user's Download folder.

	// The "blob" is something like a file that you will be able to reference with a URL.
	// The URL is a tempory URL pointing to the blob. Create an anchor HTML element that
	// reference the URL. Add the anchor to the HTML document. Fake a click on the anchor,
	// which will start the download, then remove the anchor and URL.
	const filename		= "EstimatedTax_CA.txt";
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
	// Called when the file selection dialog box triggers a change event.

	// The file selection dialog gets a list of files, but only one should be passed
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
			
			// The data is back in the ud object. Put it into the HTML fields on the web page.
			RestoreInputFields();

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
