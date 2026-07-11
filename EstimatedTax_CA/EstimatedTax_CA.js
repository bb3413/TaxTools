
import { Dates }			from "../Library/Classes/Dates.js";
import { Debug }			from "../Library/Classes/Debug.js";
import { File }				from "../Library/Classes/File.js";
import { Forms }			from "../Library/Classes/Forms.js";
import { HTML }				from "../Library/Classes/HTML.js";
import { Taxpayer }			from "../Library/Classes/Taxpayer.js";
import { TaxpayerForms }	from "../Library/Classes/TaxpayerForms.js";
import { TaxTable }			from "../Library/Classes/TaxTable.js";

// This variable need to be global so it can be accssed by the save and restore handlers.
let inputs = {};

function changeHandler(event) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole return (not just the field tha was changed).
	//
	let taxpayer	= {};	// Object
	let tax_table	= {};	// Object
	let tax_data	= [];	// Array
	inputs			= {};	// Object - Global variable

	// Reset static (global) variables. This erases all information from a previous
	// calculation.
	Debug.reset();
	Forms.reset();
	Taxpayer.reset();

	inputs		= getInputs();
	tax_table	= TaxTable.getTaxTable(inputs.tax_year);	// Initialize tax tables; ignore return value.
	taxpayer	= createTaxpayer(inputs);					// Initialize taxpayer; ignore return value.
	tax_data	= mapInputValues(inputs);

	tax_data.loadForms();					// Load the taxpayer's data into tax forms.
	Forms.getForm("F540").calculate();		// Calculate the 540, which, in turn, will
											// calculate anything it needs.
	putOutputs(taxpayer);

	// Forms.toConsole();					// Print all forms to the console.log().
	Debug.turnOn();							// Enable debugging keywords.
}

function createTaxpayer(inputs) {
	let taxpayer					= new Taxpayer();
	
	taxpayer.taxpayers_name			= inputs.taxpayers_name;
	taxpayer.filing_status			= inputs.filing_status;
	taxpayer.taxpayers_birthday		= inputs.taxpayers_birthday;
	taxpayer.spouses_birthday		= inputs.spouses_birthday;
	taxpayer.number_of_dependents	= inputs.number_of_dependents;

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
	let inputs = {};

	inputs.tax_year								= HTML.getUserInput("TaxYear");

	// Taxpayer information
	inputs.taxpayers_name						= HTML.getUserInput("TaxpayersName",	"text");
	inputs.filing_status						= HTML.getUserInput("FilingStatus",		"text");
	inputs.taxpayers_birthday					= HTML.getUserInput("TaxpayersBirthday","text");
	inputs.spouses_birthday						= HTML.getUserInput("SpousesBirthday",	"text");

	// Input Data
	inputs.federal_agi							= HTML.getUserInput("FederalAGI");
	inputs.number_of_dependents					= HTML.getUserInput("NumberOfDependents");

	// Subtractions
	inputs.us_treasury_obligations				= HTML.getUserInput("USTreasuryObligations");
	inputs.military_retirement_income			= HTML.getUserInput("MilitaryRetirementIncome");
	inputs.taxable_social_security				= HTML.getUserInput("TaxableSocialSecurity");
	inputs.state_tax_refund						= HTML.getUserInput("StateTaxRefund");
	inputs.unemployment_income					= HTML.getUserInput("UnemploymentIncome");
	inputs.california_lottery_winnings			= HTML.getUserInput("CaliforniaLotteryWinnings");
	inputs.nonqualified_hsa_distributions		= HTML.getUserInput("NonqualifiedHSADistributions");
	inputs.alimony_paid							= HTML.getUserInput("AlimonyPaid");
	inputs.other_subtractions					= HTML.getUserInput("OtherSubtractions");

	// Additions
	inputs.hsa_employer_contributions			= HTML.getUserInput("HSAEmployerContributions");
	inputs.alimony_received						= HTML.getUserInput("AlimonyReceived");
	inputs.home_loan_debt_cancellation			= HTML.getUserInput("HomeLoanDebtCancellation");
	inputs.employer_paid_student_loan_payments	= HTML.getUserInput("EmployerPaidStudentLoanPayments");
	inputs.educator_expenses					= HTML.getUserInput("EducatorExpenses");
	inputs.hsa_contributions					= HTML.getUserInput("HSAContributions");
	inputs.ira_contributions					= HTML.getUserInput("IRAContributions");
	inputs.other_additions						= HTML.getUserInput("OtherAdditions");

	// Itemized Deductions
	inputs.federal_itemized_deductions			= HTML.getUserInput("FederalItemizedDeductions");
	inputs.state_income_tax						= HTML.getUserInput("StateIncomeTax");
	inputs.qualified_hsa_distributions			= HTML.getUserInput("QualifiedHSADistributions");
	inputs.salt_limit_excess					= HTML.getUserInput("SALTLimitExcess");
	inputs.home_mortgage_interest_limit			= HTML.getUserInput("HomeMortgageInterestLimit");
	inputs.tax_preparation_fee					= HTML.getUserInput("TaxPreparationFee");
	inputs.safe_deposit_box						= HTML.getUserInput("SafeDepositBox");
	inputs.investment_fee						= HTML.getUserInput("InvestmentFee");
	inputs.other_deductions						= HTML.getUserInput("OtherDeductions");

	// Other Taxes, Interest, and Penalties

	inputs.shared_responsibility_penalty		= HTML.getUserInput("SharedResponsibilityPenalty");
	inputs.interest_and_penalties				= HTML.getUserInput("InterestAndPenalties");
	inputs.underepayment_of_estimated_tax		= HTML.getUserInput("UnderepaymentOfEstimatedTax");
	inputs.use_tax								= HTML.getUserInput("UseTax");
	inputs.miscellaneous_taxes					= HTML.getUserInput("MiscellaneousTaxes");

	// Non-refundable Credits
	inputs.child_care_credit					= HTML.getUserInput("ChildCareCredit");
	inputs.renters_credit						= HTML.getUserInput("RentersCredit");
	inputs.other_nonrefundable_credits			= HTML.getUserInput("OtherNonrefundableCredits");

	// Refundable Credits
	inputs.eitc									= HTML.getUserInput("EITC");
	inputs.young_child_tax_credit				= HTML.getUserInput("YoungChildTaxCredit");
	inputs.foster_youth_tax_credit				= HTML.getUserInput("FosterYouthTaxCredit");
	inputs.other_refundable_credits				= HTML.getUserInput("OtherRefundableCredits");

	// Payments
	inputs.withholding							= HTML.getUserInput("Withholding");
	inputs.estimated_payments					= HTML.getUserInput("EstimatedPayments");
	inputs.other_payments						= HTML.getUserInput("OtherPayments");

	// Contributions
	inputs.contributions						= HTML.getUserInput("Contributions");

	return inputs;
}

function mapInputValues(inputs) {
	//
	// For each entry on the web page, figure out where it goes on the tax forms. Make a
	// list of the forms that are needed and the lines on those forms that need to be
	// initialized.
	//
	let tt = TaxTable.getTaxTable();
	let tp = Taxpayer.getTaxpayer();

	// Build an array with the tax forms entered by the taxpayer.
	let tax_data	= new TaxpayerForms();
	let f540		= tax_data.addForm("F540");
	let f540CA		= tax_data.addForm("F540CA");


	tax_data.addLine(f540,		"13",	inputs.federal_agi);

	// Subtractions
	tax_data.addLine(f540CA,	"xx",	inputs.us_treasury_obligations);
	tax_data.addLine(f540CA,	"xx",	inputs.military_retirement_income);
	tax_data.addLine(f540CA,	"xx",	inputs.taxable_social_security);
	tax_data.addLine(f540CA,	"xx",	inputs.state_tax_refund);
	tax_data.addLine(f540CA,	"xx",	inputs.unemployment_income);
	tax_data.addLine(f540CA,	"xx",	inputs.california_lottery_winnings);
	tax_data.addLine(f540CA,	"xx",	inputs.nonqualified_hsa_distributions);
	tax_data.addLine(f540CA,	"xx",	inputs.alimony_paid);
	tax_data.addLine(f540CA,	"xx",	inputs.other_subtractions);

	// Additions
	tax_data.addLine(f540CA,	"xx",	inputs.hsa_employer_contributions);
	tax_data.addLine(f540CA,	"xx",	inputs.alimony_received);
	tax_data.addLine(f540CA,	"xx",	inputs.home_loan_debt_cancellation);
	tax_data.addLine(f540CA,	"xx",	inputs.employer_paid_student_loan_payments);
	tax_data.addLine(f540CA,	"xx",	inputs.educator_expenses);
	tax_data.addLine(f540CA,	"xx",	inputs.hsa_contributions);
	tax_data.addLine(f540CA,	"xx",	inputs.ira_contributions);
	tax_data.addLine(f540CA,	"xx",	inputs.other_additions);

	// Itemized Deductions
	tax_data.addLine(f540CA,	"xx",	inputs.federal_itemized_deductions);
	tax_data.addLine(f540CA,	"xx",	inputs.state_income_tax);
	tax_data.addLine(f540CA,	"xx",	inputs.qualified_hsa_distributions);
	tax_data.addLine(f540CA,	"xx",	inputs.salt_limit_excess);
	tax_data.addLine(f540CA,	"xx",	inputs.home_mortgage_interest_limit);
	tax_data.addLine(f540CA,	"xx",	inputs.tax_preparation_fee);
	tax_data.addLine(f540CA,	"xx",	inputs.safe_deposit_box);
	tax_data.addLine(f540CA,	"xx",	inputs.investment_fee);
	tax_data.addLine(f540CA,	"xx",	inputs.other_deductions);

	// Other Taxes, Interest, and Penalties
	tax_data.addLine(f540,		"xx",	inputs.shared_responsibility_penalty);
	tax_data.addLine(f540,		"xx",	inputs.interest_and_penalties);
	tax_data.addLine(f540,		"xx",	inputs.underepayment_of_estimated_tax);
	tax_data.addLine(f540,		"xx",	inputs.use_tax);
	tax_data.addLine(f540,		"xx",	inputs.miscellaneous_taxes);

	// Non-refundable Credits
	tax_data.addLine(f540,		"xx",	inputs.child_care_credit);
	tax_data.addLine(f540,		"xx",	inputs.renters_credit);
	tax_data.addLine(f540,		"xx",	inputs.other_nonrefundable_credits);

	// Refundable Credits
	tax_data.addLine(f540,		"xx",	inputs.eitc);
	tax_data.addLine(f540,		"xx",	inputs.young_child_tax_credit);
	tax_data.addLine(f540,		"xx",	inputs.foster_youth_tax_credit);
	tax_data.addLine(f540,		"xx",	inputs.other_refundable_credits);

	// Payments
	tax_data.addLine(f540,		"xx",	inputs.withholding);
	tax_data.addLine(f540,		"xx",	inputs.estimated_payments);
	tax_data.addLine(f540,		"xx",	inputs.other_payments);

	// Contributions
	tax_data.addLine(f540,		"xx",	inputs.contributions);
	
	return tax_data;
}

function putOutputs(taxpayer) {
	//
	// Get the information we are interested in and write them to the web page.
	//
	const todays_date		= new Date().toLocaleDateString();
	const todays_date		= new Date().toLocaleDateString();
	const payments			= Forms.getValue("F540", "78");
	const refund			= Forms.getValue("F540", "115");
	let amount_due			= Forms.getValue("F540", "114");
	
	amount_due				= (amount_due !== 0) ? -amount_due : refund;
	const estimated_tax		= Math.round(Math.max(0, payments - amount_due));
		
	HTML.putUserOutput("TodaysDate",			todays_date, "text");
	HTML.putUserOutput("TaxpayersAge",			taxpayer.taxpayers_age);
	HTML.putUserOutput("SpousesAge",			taxpayer.spouses_age);

	// Estimated Tax
	HTML.putUserOutput("Exemptions",			Forms.getValue("F540", "11"));
	HTML.putUserOutput("Subtractions",			Forms.getValue("F540", "14"));
	HTML.putUserOutput("Additions",				Forms.getValue("F540", "16"));
	HTML.putUserOutput("Deductions",			Forms.getValue("F540", "18"));
	HTML.putUserOutput("NonrefundableCredits",	Forms.getValue("F540", "48"));
	HTML.putUserOutput("RefundableCredits",		Forms.getValue("F540", "74", "75", "76", "77"));
	HTML.putUserOutput("OtherTaxes",			Forms.getValue("F540", "64"));
	HTML.putUserOutput("Payments",				Forms.getValue("F540", "78"));
	HTML.putUserOutput("StateAGI",				Forms.getValue("F540", "17"));
	HTML.putUserOutput("TaxableIncome",			Forms.getValue("F540", "19"));
	HTML.putUserOutput("IncomeTax",				Forms.getValue("F540", "31"));
	HTML.putUserOutput("TotalTax",				Forms.getValue("F540", "35"));
	HTML.putUserOutput("RefundAmountDue",		Forms.getValue("F540", "xx"));
	HTML.putUserOutput("AprilPayment",			Math.round(estimated_tax * 0.30);
	HTML.putUserOutput("JunePayment",			Math.round(estimated_tax * 0.40);
	HTML.putUserOutput("SeptemberPayment",		0;
	HTML.putUserOutput("JanuaryPayment",		Math.round(estimated_tax * 0.30);
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
	
	HTML.putElementValue("TaxYear",							inputs.tax_year);

	// Taxpayer information
	HTML.putElementValue("TaxpayersName",					inputs.taxpayers_name);
	HTML.putElementValue("FilingStatus",					inputs.filing_status);
	HTML.putElementValue("TaxpayersBirthday",				inputs.taxpayers_birthday);
	HTML.putElementValue("SpousesBirthday",					inputs.spouses_birthday);

	// Input Data
	HTML.putElementValue("FederalAGI",						inputs.federal_agi);
	HTML.putElementValue("NumberOfDependents",				inputs.number_of_dependents);

	// Subtractions
	HTML.putElementValue("USTreasuryObligations",			inputs.us_treasury_obligations);
	HTML.putElementValue("MilitaryRetirementIncome",		inputs.military_retirement_income);
	HTML.putElementValue("TaxableSocialSecurity",			inputs.taxable_social_security);
	HTML.putElementValue("StateTaxRefund",					inputs.state_tax_refund	);
	HTML.putElementValue("UnemploymentIncome",				inputs.unemployment_income);
	HTML.putElementValue("CaliforniaLotteryWinnings",		inputs.california_lottery_winnings);
	HTML.putElementValue("NonqualifiedHSADistributions",	inputs.nonqualified_hsa_distributions);
	HTML.putElementValue("AlimonyPaid",						inputs.alimony_paid);
	HTML.putElementValue("OtherSubtractions",				inputs.other_subtractions);

	// Additions
	HTML.putElementValue("HSAEmployerContributions",		inputs.hsa_employer_contributions);
	HTML.putElementValue("AlimonyReceived",					inputs.alimony_received);
	HTML.putElementValue("HomeLoanDebtCancellation",		inputs.home_loan_debt_cancellation);
	HTML.putElementValue("EmployerPaidStudentLoanPayments",	inputs.employer_paid_student_loan_payments);
	HTML.putElementValue("EducatorExpenses",				inputs.educator_expenses);
	HTML.putElementValue("HSAContributions",				inputs.hsa_contributions);
	HTML.putElementValue("IRAContributions",				inputs.ira_contributions);
	HTML.putElementValue("OtherAdditions",					inputs.other_additions);

	// Itemized Deductions
	HTML.putElementValue("FederalItemizedDeductions",		inputs.federal_itemized_deductions);
	HTML.putElementValue("StateIncomeTax",					inputs.state_income_tax);
	HTML.putElementValue("QualifiedHSADistributions",		inputs.qualified_hsa_distributions);
	HTML.putElementValue("SALTLimitExcess",					inputs.salt_limit_excess);
	HTML.putElementValue("HomeMortgageInterestLimit",		inputs.home_mortgage_interest_limit);
	HTML.putElementValue("TaxPreparationFee",				inputs.tax_preparation_fee);
	HTML.putElementValue("SafeDepositBox",					inputs.safe_deposit_box);
	HTML.putElementValue("InvestmentFee",					inputs.investment_fee);
	HTML.putElementValue("OtherDeductions",					inputs.other_deductions);

	// Other Taxes, Interest, and Penalties

	HTML.putElementValue("SharedResponsibilityPenalty",		inputs.shared_responsibility_penalty);
	HTML.putElementValue("InterestAndPenalties",			inputs.interest_and_penalties);
	HTML.putElementValue("UnderepaymentOfEstimatedTax",		inputs.underepayment_of_estimated_tax);
	HTML.putElementValue("UseTax",							inputs.use_tax);
	HTML.putElementValue("MiscellaneousTaxes",				inputs.miscellaneous_taxes);

	// Non-refundable Credits
	HTML.putElementValue("ChildCareCredit",					inputs.child_care_credit);
	HTML.putElementValue("RentersCredit",					inputs.renters_credit);
	HTML.putElementValue("OtherNonrefundableCredits",		inputs.other_nonrefundable_credits);

	// Refundable Credits
	HTML.putElementValue("EITC",							inputs.eitc);
	HTML.putElementValue("YoungChildTaxCredit",				inputs.young_child_tax_credit);
	HTML.putElementValue("FosterYouthTaxCredit",			inputs.foster_youth_tax_credit);
	HTML.putElementValue("FosterYouthTaxCredit",			inputs.other_refundable_credits);

	// Payments
	HTML.putElementValue("Withholding",						inputs.withholding);
	HTML.putElementValue("EstimatedPayments",				inputs.estimated_payments);
	HTML.putElementValue("OtherPayments",					inputs.other_payments);

	// Contributions
	HTML.putElementValue("Contributions",					inputs.contributions);
	
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
	const FILENAME = "EstimatedTax_CA.txt";
	
	let data = {
		version:		HTML.getUserInput("TaxToolsVersion", "text"),
		output_data:	outputs,
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

	// Taxpayer Information
	HTML.addListener("TaxpayersName",					"change", changeHandler);
	HTML.addListener("FilingStatus",					"change", changeHandler);
	HTML.addListener("TaxpayersBirthday",				"change", changeHandler);
	HTML.addListener("SpousesBirthday",					"change", changeHandler);

	// Input Data
	HTML.addListener("FederalAGI",						"change", changeHandler);
	HTML.addListener("NumberOfDependents",				"change", changeHandler);

	// Subtractions
	HTML.addListener("USTreasuryObligations",			"change", changeHandler);
	HTML.addListener("MilitaryRetirementIncome",		"change", changeHandler);
	HTML.addListener("TaxableSocialSecurity",			"change", changeHandler);
	HTML.addListener("StateTaxRefund",					"change", changeHandler);
	HTML.addListener("UnemploymentIncome",				"change", changeHandler);
	HTML.addListener("CaliforniaLotteryWinnings",		"change", changeHandler);
	HTML.addListener("NonqualifiedHSADistributions",	"change", changeHandler);
	HTML.addListener("AlimonyPaid",						"change", changeHandler);
	HTML.addListener("OtherSubtractions",				"change", changeHandler);

	// Additions
	HTML.addListener("HSAEmployerContributions",		"change", changeHandler);
	HTML.addListener("AlimonyReceived",					"change", changeHandler);
	HTML.addListener("HomeLoanDebtCancellation",		"change", changeHandler);
	HTML.addListener("EmployerPaidStudentLoanPayments",	"change", changeHandler);
	HTML.addListener("EducatorExpenses",				"change", changeHandler);
	HTML.addListener("HSAContributions",				"change", changeHandler);
	HTML.addListener("IRAContributions",				"change", changeHandler);
	HTML.addListener("OtherAdditions",					"change", changeHandler);

	// Itemized Deductions
	HTML.addListener("FederalItemizedDeductions",		"change", changeHandler);
	HTML.addListener("StateIncomeTax",					"change", changeHandler);
	HTML.addListener("QualifiedHSADistributions",		"change", changeHandler);
	HTML.addListener("SALTLimitExcess",					"change", changeHandler);
	HTML.addListener("HomeMortgageInterestLimit",		"change", changeHandler);
	HTML.addListener("TaxPreparationFee",				"change", changeHandler);
	HTML.addListener("SafeDepositBox",					"change", changeHandler);
	HTML.addListener("InvestmentFee",					"change", changeHandler);
	HTML.addListener("OtherDeductions",					"change", changeHandler);

	// Other Taxes, Interest, and Penalties
	HTML.addListener("SharedResponsibilityPenalty",		"change", changeHandler);
	HTML.addListener("InterestAndPenalties",			"change", changeHandler);
	HTML.addListener("UnderepaymentOfEstimatedTax",		"change", changeHandler);
	HTML.addListener("UseTax",							"change", changeHandler);
	HTML.addListener("MiscellaneousTaxes",				"change", changeHandler);

	// Non-refundable Credits
	HTML.addListener("ChildCareCredit",					"change", changeHandler);
	HTML.addListener("RentersCredit",					"change", changeHandler);
	HTML.addListener("OtherNonrefundableCredits",		"change", changeHandler);

	// Refundable Credits
	HTML.addListener("EITC",							"change", changeHandler);
	HTML.addListener("YoungChildTaxCredit",				"change", changeHandler);
	HTML.addListener("FosterYouthTaxCredit",			"change", changeHandler);
	HTML.addListener("OtherRefundableCredits",			"change", changeHandler);

	// Payments
	HTML.addListener("Withholding",						"change", changeHandler);
	HTML.addListener("EstimatedPayments",				"change", changeHandler);
	HTML.addListener("OtherPayments",					"change", changeHandler);

	// Contributions
	HTML.addListener("Contributions",					"change", changeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const TaxpayersName = document.getElementById('TaxpayersName');
	TaxpayersName.focus({
		preventScroll: true
	});

	HTML.putUserOutput("TaxYear", Dates.getTaxYear(), "text");		// Default tax year.
	HTML.hideElement("DebugContainer");
});

export { changeHandler };
