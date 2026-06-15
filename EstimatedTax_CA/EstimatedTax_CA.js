
import { getAge }							from "../Library/Dates.js";
import { getTaxYear }						from "../Library/Dates.js";
import { dbgEnter, dbgExit, dbgLog }		from "../Library/Debug.js";
import { putDebugOutput }					from "../Library/Debug.js";
import { turnOffDebug, turnOnDebug }		from "../Library/Debug.js";
import { addListener }						from "../Library/HTML.js";
import { getUserInput, putUserOutput }		from "../Library/HTML.js";
import { min, max, round }					from "../Library/Numbers.js";
import { strCaseEqual }						from "../Library/Strings.js";
import { get_CA_Exemption }					from "../Library/TaxTables/TaxTables.js";
import { get_CA_IncomeTax }					from "../Library/TaxTables/TaxTables.js";
import { get_CA_StandardDeduction }			from "../Library/TaxTables/TaxTables.js";
import { initializeTaxTables }				from "../Library/TaxTables/TaxTables.js";
import { saveUserData, restoreUserData }	from "./SaveRestore_CA.js";

// This is the current user data that was copied from or will be copied to the HTML elements.
let ud = {
	tax_year:							0,
	taxpayers_name:						"",
	tax_tools_version:					"",
	filing_status:						"",
	todays_date:						"",
	taxpayers_birthday:					"",
	taxpayers_age:						0,
	spouses_birthday:					"",
	spouses_age:						0,

	// Estimated Tax
	exemptions:							0,
	subtractions:						0,
	additions:							0,
	deductions:							0,
	nonrefundable_credits:				0,
	refundable_credits:					0,
	other_taxes:						0,
	payments:							0,
	state_agi:							0,
	taxable_income:						0,
	income_tax:							0,
	total_tax:							0,
	refund_amount_due:					0,
	april_payment:						0,
	june_payment:						0,
	september_payment:					0,
	january_payment:					0,

	// Input Data
	federal_agi:						0,
	number_of_dependents:				0,

	// Subtractions
	us_treasury_obligations:			0,
	military_retirement_income:			0,
	taxable_social_security:			0,
	state_tax_refund:					0,
	unemployment_income:				0,
	california_lottery_winnings:		0,
	nonqualified_hsa_distributions:		0,
	alimony_paid:						0,
	other_subtractions:					0,

	// Additions
	hsa_employer_contributions:			0,
	alimony_received:					0,
	home_loan_debt_cancellation:		0,
	employer_paid_student_loan_payments:0,
	educator_expenses:					0,
	hsa_contributions:					0,
	ira_contributions:					0,
	other_additions:					0,

	// Itemized Deductions
	federal_itemized_deductions:		0,
	state_income_tax:					0,
	qualified_hsa_distributions:		0,
	salt_limit_excess:					0,
	home_mortgage_interest_limit:		0,
	tax_preparation_fee:				0,
	safe_deposit_box:					0,
	investment_fee:						0,
	other_deductions:					0,

	// Other Taxes, Interest, and Penalties
	shared_responsibility_penalty:		0,
	interest_and_penalties:				0,
	underepayment_of_estimated_tax:		0,
	use_tax:							0,
	miscellaneous_taxes:				0,

	// Non-refundable Credits
	child_care_credit:					0,
	renters_credit:						0,
	other_nonrefundable_credits:		0,

	// Refundable Credits
	eitc:								0,
	young_child_tax_credit:				0,
	foster_youth_tax_credit:			0,
	other_refundable_credits:			0,

	// Payments
	withholding:						0,
	estimated_payments:					0,
	other_payments:						0,

	// Contributions
	contributions:						0,

	// Debug Informstion
	standard_deduction:					0,
	itemized_deductions:				0,
	payment_balance:					0,
	use_tax_balance:					0,
	payments_after_srp:					0,
	srp_balance:						0,
	overpaid_tax:						0,
	tax_due:							0,
	amount_you_owe:						0,
	refund:								0,
};

function getItemizedDeductions() {
	const misc_deductions	= getMiscellaneousDeductions();
	const subtractions		= ud.state_income_tax +
								ud.qualified_hsa_distributions +
								ud.other_deductions;
	const additions			= ud.salt_limit_excess +
								ud.home_mortgage_interest_limit +
								misc_deductions;

	return max(0, ud.federal_itemized_deductions - subtractions + additions);
}

function getMiscellaneousDeductions() {
	const agi_percent		= round(ud.federal_agi * 0.02);
	const misc_deductions	=
			ud.tax_preparation_fee +
			ud.safe_deposit_box +
			ud.investment_fee;

	return max(0, misc_deductions - agi_percent);
}

function getSubtractions() {
	// The way the "subtractions" are calculated on the Calitornia tax return may not be intuitive.
	// First, it adds together the items that are taxed on the federal tax return, but not the
	// California tax return (form CA 540, sections 1A and 1B). These will be subtracted from the
	// federal AGI, as you would expect. Then, it adds together the federal adjustments (above the
	// line deductions, form CA 540, section 1C) that are not allowed by California. These are then
	// subtracted from the subtractions (rather than adding them as additions to the federal AGI).

	const subtractions =
		ud.us_treasury_obligations +
		ud.military_retirement_income +
		ud.taxable_social_security +
		ud.state_tax_refund +
		ud.unemployment_income +
		ud.california_lottery_winnings +
		ud.nonqualified_hsa_distributions +
		ud.other_subtractions;

	const adjustments_to_subtractions =
		ud.educator_expenses +
		ud.hsa_contributions +
		ud.ira_contributions;

	return subtractions - adjustments_to_subtractions;
}

function getAdditions() {
	// The way the "additions" are calculated on the Calitornia tax return is the opposite of
	// the subtractions. The items that are not taxed on the federal tax return, but are taxed on
	// the California tax return are added together (form CA 540, sections 1A and 1B) to form the
	// basis of the additions. Then, the federal adjustments (above the line deductions, form CA
	// 540, section 1C) that are allowed by California are added together. These are then subtracted
	// from the additions (rather than subtracting them as subtractions from the federal AGI).

	const additions =
		ud.hsa_employer_contributions +
		ud.alimony_received +
		ud.home_loan_debt_cancellation +
		ud.employer_paid_student_loan_payments +
		ud.other_additions;

	const adjustments_to_additions =
		ud.alimony_paid;


	return additions - adjustments_to_additions;
}

function getRefundableCredits() {
	return (
		ud.eitc +
		ud.young_child_tax_credit +
		ud.foster_youth_tax_credit +
		ud.other_refundable_credits);
}

function getNonrefundableCredits() {
	return (
		ud.child_care_credit +
		ud.renters_credit +
		ud.other_nonrefundable_credits);
}

function getOtherTaxes() {
	return (
		ud.miscellaneous_taxes);
}

function getPayments() {
	return (
		ud.withholding +
		ud.estimated_payments +
		ud.other_payments);
}

function calculateTax() {
	initializeTaxTables(ud.filing_status, ud.tax_year);

	ud.todays_date				= new Date().toLocaleDateString();
	const end_of_year			= new Date("12/31/" + ud.tax_year);
	ud.taxpayers_age			= getAge(ud.taxpayers_birthday, end_of_year);
	if (strCaseEqual(ud.filing_status, "MFJ")) {
		ud.spouses_age			= getAge(ud.spouses_birthday, end_of_year);
	}
	ud.standard_deduction		= get_CA_StandardDeduction(ud.filing_status, ud.taxpayers_age, ud.spouses_age);
	ud.itemized_deductions		= getItemizedDeductions();

	ud.exemptions				= get_CA_Exemption(ud.filing_status, ud.taxpayers_age, ud.spouses_age,
									false, false, ud.number_of_dependents);
	ud.subtractions				= getSubtractions();
	ud.additions				= getAdditions();
	ud.deductions				= max(ud.standard_deduction, ud.itemized_deductions);
	ud.nonrefundable_credits	= getNonrefundableCredits();
	ud.refundable_credits		= getRefundableCredits();
	ud.other_taxes				= getOtherTaxes();
	ud.payments					= getPayments();

	ud.state_agi				= max(0, ud.federal_agi - ud.subtractions + ud.additions);
	ud.taxable_income			= max(0, ud.state_agi - ud.deductions);
	ud.income_tax				= get_CA_IncomeTax(ud.filing_status, ud.taxable_income);

	ud.total_tax				= max(0, ud.income_tax - ud.exemptions);
	ud.total_tax				= max(0, ud.total_tax - ud.nonrefundable_credits);
	ud.total_tax				+= ud.other_taxes;

	if (ud.payments > ud.use_tax)
		ud.payment_balance = ud.payments - ud.use_tax;

	if (ud.use_tax > ud.Payments)
		ud.use_tax_balance = ud.use_tax - ud.payments;

	if (ud.payment_balance > ud.shared_responsibility_penalty)
		ud.payments_after_srp = ud.payment_balance - ud.shared_responsibility_penalty;

	if (ud.shared_responsibility_penalty > ud.payment_balance)
		ud.srp_balance = ud.shared_responsibility_penalty - ud.payment_balance;

	if (ud.payments_after_srp > ud.total_tax)
		ud.overpaid_tax = ud.payments_after_srp - ud.total_tax

	if (ud.payments_after_srp < ud.total_tax)
		ud.tax_due = ud.total_tax - ud.payments_after_srp;

	if (ud.overpaid_tax > 0) {
		ud.refund = ud.overpaid_tax -
			(ud.contributions + ud.interest_and_penalties + ud.underepayment_of_estimated_tax);
		ud.refund_amount_due = ud.refund;
	} else {
		ud.amount_you_owe = ud.use_tax_balance + ud.srp_balance + ud.tax_due + ud.contributions;
		ud.refund_amount_due = -ud.amount_you_owe;
	}

	const estimated_taxes	= max(0, ud.estimated_payments - ud.refund_amount_due);
	ud.april_payment		= round(estimated_taxes * 0.30);
	ud.june_payment			= round(estimated_taxes * 0.40);
	ud.september_payment	= 0;
	ud.january_payment		= round(estimated_taxes * 0.30);
}

function getInputValues() {
	// Copy input data from web page to local variables.
	ud.tax_year								= getUserInput("TaxYear");

	// Taxpayer information
	ud.taxpayers_name						= getUserInput("TaxpayersName",		"text");
	ud.filing_status						= getUserInput("FilingStatus",		"text");
	ud.taxpayers_birthday					= getUserInput("TaxpayersBirthday",	"text");
	ud.spouses_birthday						= getUserInput("SpousesBirthday",	"text");

	// Estimated Tax
	ud.exemptions							= 0;
	ud.subtractions							= 0;
	ud.additions							= 0;
	ud.deductions							= 0;
	ud.nonrefundable_credits				= 0;
	ud.refundable_credits					= 0;
	ud.other_taxes							= 0;
	ud.payments								= 0;
	ud.state_agi							= 0;
	ud.taxable_income						= 0;
	ud.income_tax							= 0;
	ud.total_tax							= 0;
	ud.refund_amount_due					= 0;
	ud.april_payment						= 0;
	ud.june_payment							= 0;
	ud.september_payment					= 0;
	ud.january_payment						= 0;

	// Input Data
	ud.federal_agi							= getUserInput("FederalAGI");
	ud.number_of_dependents					= getUserInput("NumberOfDependents");

	// Subtractions
	ud.us_treasury_obligations				= getUserInput("USTreasuryObligations");
	ud.military_retirement_income			= getUserInput("MilitaryRetirementIncome");
	ud.taxable_social_security				= getUserInput("TaxableSocialSecurity");
	ud.state_tax_refund						= getUserInput("StateTaxRefund");
	ud.unemployment_income					= getUserInput("UnemploymentIncome");
	ud.california_lottery_winnings			= getUserInput("CaliforniaLotteryWinnings");
	ud.nonqualified_hsa_distributions		= getUserInput("NonqualifiedHSADistributions");
	ud.alimony_paid							= getUserInput("AlimonyPaid");
	ud.other_subtractions					= getUserInput("OtherSubtractions");

	// Additions
	ud.hsa_employer_contributions			= getUserInput("HSAEmployerContributions");
	ud.alimony_received						= getUserInput("AlimonyReceived");
	ud.home_loan_debt_cancellation			= getUserInput("HomeLoanDebtCancellation");
	ud.employer_paid_student_loan_payments	= getUserInput("EmployerPaidStudentLoanPayments");
	ud.educator_expenses					= getUserInput("EducatorExpenses");
	ud.hsa_contributions					= getUserInput("HSAContributions");
	ud.ira_contributions					= getUserInput("IRAContributions");
	ud.other_additions						= getUserInput("OtherAdditions");

	// Itemized Deductions
	ud.federal_itemized_deductions			= getUserInput("FederalItemizedDeductions");
	ud.state_income_tax						= getUserInput("StateIncomeTax");
	ud.qualified_hsa_distributions			= getUserInput("QualifiedHSADistributions");
	ud.salt_limit_excess					= getUserInput("SALTLimitExcess");
	ud.home_mortgage_interest_limit			= getUserInput("HomeMortgageInterestLimit");
	ud.tax_preparation_fee					= getUserInput("TaxPreparationFee");
	ud.safe_deposit_box						= getUserInput("SafeDepositBox");
	ud.investment_fee						= getUserInput("InvestmentFee");
	ud.other_deductions						= getUserInput("OtherDeductions");

	// Other Taxes, Interest, and Penalties

	ud.shared_responsibility_penalty		= getUserInput("SharedResponsibilityPenalty");
	ud.interest_and_penalties				= getUserInput("InterestAndPenalties");
	ud.underepayment_of_estimated_tax		= getUserInput("UnderepaymentOfEstimatedTax");
	ud.use_tax								= getUserInput("UseTax");
	ud.miscellaneous_taxes					= getUserInput("MiscellaneousTaxes");

	// Non-refundable Credits
	ud.child_care_credit					= getUserInput("ChildCareCredit");
	ud.renters_credit						= getUserInput("RentersCredit");
	ud.other_nonrefundable_credits			= getUserInput("OtherNonrefundableCredits");

	// Refundable Credits
	ud.eitc									= getUserInput("EITC");
	ud.young_child_tax_credit				= getUserInput("YoungChildTaxCredit");
	ud.foster_youth_tax_credit				= getUserInput("FosterYouthTaxCredit");
	ud.other_refundable_credits				= getUserInput("OtherRefundableCredits");

	// Payments
	ud.withholding							= getUserInput("Withholding");
	ud.estimated_payments					= getUserInput("EstimatedPayments");
	ud.other_payments						= getUserInput("OtherPayments");

	// Contributions
	ud.contributions						= getUserInput("Contributions");

	// Debug Informstion
	ud.standard_deduction					= 0;
	ud.itemized_deductions					= 0;
	ud.payment_balance						= 0;
	ud.use_tax_balance						= 0;
	ud.payments_after_srp					= 0;
	ud.srp_balance							= 0;
	ud.overpaid_tax							= 0;
	ud.tax_due								= 0;
	ud.amount_you_owe						= 0;
	ud.interest_and_penalties				= 0;
	ud.underepayment_of_estimated_tax		= 0;
	ud.refund								= 0;
}

function putResults() {
	
	putUserOutput("TodaysDate",				ud.todays_date, "text");
	putUserOutput("TaxpayersAge",			ud.taxpayers_age);
	putUserOutput("SpousesAge",				ud.spouses_age);

	// Estimated Tax
	putUserOutput("Exemptions",				ud.exemptions);
	putUserOutput("Subtractions",			ud.subtractions);
	putUserOutput("Additions",				ud.additions);
	putUserOutput("Deductions",				ud.deductions);
	putUserOutput("NonrefundableCredits",	ud.nonrefundable_credits);
	putUserOutput("RefundableCredits",		ud.refundable_credits);
	putUserOutput("OtherTaxes",				ud.other_taxes);
	putUserOutput("Payments",				ud.payments);
	putUserOutput("StateAGI",				ud.state_agi);
	putUserOutput("TaxableIncome",			ud.taxable_income);
	putUserOutput("IncomeTax",				ud.income_tax);
	putUserOutput("TotalTax",				ud.total_tax);
	putUserOutput("RefundAmountDue",		ud.refund_amount_due);
	putUserOutput("AprilPayment",			ud.april_payment);
	putUserOutput("JunePayment",			ud.june_payment);
	putUserOutput("SeptemberPayment",		ud.september_payment);
	putUserOutput("JanuaryPayment",			ud.january_payment);

	putDebugOutput("Debug01", ud.standard_deduction,	" ",					"Standard Deduction");
	putDebugOutput("Debug02", ud.itemized_deductions,	"CA 540 p2, line 30",	"Itemized Deductions");
	putDebugOutput("Debug03", ud.payment_balance,		"540, line 93",			"Payment Balance");
	putDebugOutput("Debug04", ud.use_tax_balance,		"540, line 94",			"Use Tax Balance");
	putDebugOutput("Debug05", ud.payments_after_srp,	"540, line 95",			"Payments After SRP Penalty");
	putDebugOutput("Debug06", ud.srp_balance,			"540, line 96",			"SRP Balance");
	putDebugOutput("Debug07", ud.overpaid_tax,			"540, line 99",			"Overpaid Tax");
	putDebugOutput("Debug08", ud.tax_due,				"540, line 100",		"Tax Due");
	putDebugOutput("Debug09", ud.amount_you_owe,		"540, line 111",		"Amount You Owe");
	putDebugOutput("Debug10", ud.refund,				"540, line 115",		"Refund");
}

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	turnOffDebug();
	getInputValues();
	calculateTax();
	putResults();
	turnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	addListener("TaxYear",						"change", changeHandler);
	addListener("SaveButton",					"click",  saveUserData);
	addListener("InputFile",					"change", restoreUserData);

	// Taxpayer Information
	addListener("TaxpayersName",				"change", changeHandler);
	addListener("FilingStatus",					"change", changeHandler);
	addListener("TaxpayersBirthday",			"change", changeHandler);
	addListener("SpousesBirthday",				"change", changeHandler);

	// Input Data
	addListener("FederalAGI",					"change", changeHandler);
	addListener("NumberOfDependents",			"change", changeHandler);

	// Subtractions
	addListener("USTreasuryObligations",		"change", changeHandler);
	addListener("MilitaryRetirementIncome",		"change", changeHandler);
	addListener("TaxableSocialSecurity",		"change", changeHandler);
	addListener("StateTaxRefund",				"change", changeHandler);
	addListener("UnemploymentIncome",			"change", changeHandler);
	addListener("CaliforniaLotteryWinnings",	"change", changeHandler);
	addListener("NonqualifiedHSADistributions",	"change", changeHandler);
	addListener("AlimonyPaid",					"change", changeHandler);
	addListener("OtherSubtractions",			"change", changeHandler);

	// Additions
	addListener("HSAEmployerContributions",		"change", changeHandler);
	addListener("AlimonyReceived",				"change", changeHandler);
	addListener("HomeLoanDebtCancellation",		"change", changeHandler);
	addListener("EmployerPaidStudentLoanPayments",	"change", changeHandler);
	addListener("EducatorExpenses",				"change", changeHandler);
	addListener("HSAContributions",				"change", changeHandler);
	addListener("IRAContributions",				"change", changeHandler);
	addListener("OtherAdditions",				"change", changeHandler);

	// Itemized Deductions
	addListener("FederalItemizedDeductions",	"change", changeHandler);
	addListener("StateIncomeTax",				"change", changeHandler);
	addListener("QualifiedHSADistributions",	"change", changeHandler);
	addListener("SALTLimitExcess",				"change", changeHandler);
	addListener("HomeMortgageInterestLimit",	"change", changeHandler);
	addListener("TaxPreparationFee",			"change", changeHandler);
	addListener("SafeDepositBox",				"change", changeHandler);
	addListener("InvestmentFee",				"change", changeHandler);
	addListener("OtherDeductions",				"change", changeHandler);

	// Other Taxes, Interest, and Penalties
	addListener("SharedResponsibilityPenalty",	"change", changeHandler);
	addListener("InterestAndPenalties",			"change", changeHandler);
	addListener("UnderepaymentOfEstimatedTax",	"change", changeHandler);
	addListener("UseTax",						"change", changeHandler);
	addListener("MiscellaneousTaxes",			"change", changeHandler);

	// Non-refundable Credits
	addListener("ChildCareCredit",				"change", changeHandler);
	addListener("RentersCredit",				"change", changeHandler);
	addListener("OtherNonrefundableCredits",	"change", changeHandler);

	// Refundable Credits
	addListener("EITC",							"change", changeHandler);
	addListener("YoungChildTaxCredit",			"change", changeHandler);
	addListener("FosterYouthTaxCredit",			"change", changeHandler);
	addListener("OtherRefundableCredits",		"change", changeHandler);

	// Payments
	addListener("Withholding",					"change", changeHandler);
	addListener("EstimatedPayments",			"change", changeHandler);
	addListener("OtherPayments",				"change", changeHandler);

	// Contributions
	addListener("Contributions",				"change", changeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const TaxpayersName = document.getElementById('TaxpayersName');
	TaxpayersName.focus({
		preventScroll: true
	});

	putUserOutput("TaxYear", getTaxYear(), "text");		// Default tax year.
	changeHandler();
});

export { changeHandler };