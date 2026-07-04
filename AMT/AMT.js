
import { Dates }			from "../Library/Classes/Dates.js";
import { Debug }			from "../Library/Classes/Debug.js";
import { Forms }			from "../Library/Classes/Forms.js";
import { HTML }				from "../Library/Classes/HTML.js";
import { Str }				from "../Library/Classes/Str.js";
import { Taxpayer }			from "../Library/Classes/Taxpayer.js";
import { TaxpayerForms }	from "../Library/Classes/TaxpayerForms.js";
import { TaxTable }			from "../Library/Classes/TaxTable.js";

function createTaxpayer(inputs) {
	let taxpayer					= new Taxpayer();
	
	taxpayer.tax_year				= inputs.tax_year;
	taxpayer.filing_status			= inputs.filing_status;
	taxpayer.taxpayers_birthday		= inputs.taxpayers_birthday;
	taxpayer.spouses_birthday		= inputs.spouses_birthday;
	taxpayer.taxpayer_is_blind		= inputs.taxpayer_is_blind;
	taxpayer.spouse_is_blind		= inputs.spouse_is_blind;

	return taxpayer;
}

function getInputs() {
	//
	// Get the values from the web page. Put them in an object literal so the values
	// can be accessed by name.
	//
	let inputs = {};
	
	// Input fields
	inputs.tax_year							= HTML.getUserInput("TaxYear");
	inputs.filing_status					= HTML.getUserInput("FilingStatus",			"text");
	inputs.taxpayers_birthday				= HTML.getUserInput("TaxpayersBirthday",	"text");
	inputs.spouses_birthday					= HTML.getUserInput("SpousesBirthday",		"text");
	inputs.taxpayer_is_blind				= HTML.getUserInput("TaxpayerIsBlind");
	inputs.spouse_is_blind					= HTML.getUserInput("SpouseIsBlind");

	// Input fields
	inputs.agi								= HTML.getUserInput("AGI");
	inputs.qualified_dividends				= HTML.getUserInput("QualifiedDividends");
	inputs.capital_gains					= HTML.getUserInput("CapitalGains");
	inputs.taxable_income					= HTML.getUserInput("TaxableIncome");
	inputs.income_tax						= HTML.getUserInput("IncomeTax");

	inputs.itemized_deduction				= HTML.getUserInput("ItemizedDeduction");
	inputs.taxes_paid_deduction				= HTML.getUserInput("TaxesPaidDeduction");
	inputs.qbi_deduction					= HTML.getUserInput("QBIDeduction");

	inputs.state_tax_refund					= HTML.getUserInput("StateTaxRefund");
	inputs.investment_interest				= HTML.getUserInput("InvestmentInterestExpense");
	inputs.depletion						= HTML.getUserInput("Depletion");
	inputs.net_operating_loss				= HTML.getUserInput("NetOperatingLoss");
	inputs.alternate_net_operating_loss		= HTML.getUserInput("AlternateNetOperatingLoss");
	inputs.private_activity_bonds_interest	= HTML.getUserInput("PrivateActivityBondsInterest");
	inputs.qualified_small_business_stock	= HTML.getUserInput("QualifiedSmallBusinessStock");
	inputs.incentive_stock_options			= HTML.getUserInput("IncentiveStockOptions");
	inputs.estates_and_trusts				= HTML.getUserInput("EstatesAndTrusts");
	inputs.disposition_of_property			= HTML.getUserInput("DispositionOfProperty");
	inputs.post_1986_depreciation			= HTML.getUserInput("Post1986Depreciation");
	inputs.passive_activities				= HTML.getUserInput("PassiveActivities");
	inputs.loss_limitations					= HTML.getUserInput("LossLimitations");
	inputs.circulation_costs				= HTML.getUserInput("CirculationCosts");
	inputs.long_term_contracts				= HTML.getUserInput("LongTermContracts");
	inputs.mining_costs						= HTML.getUserInput("MiningCosts");
	inputs.reseach_costs					= HTML.getUserInput("ReseachCosts");
	inputs.installment_sales				= HTML.getUserInput("InstallmentSales");
	inputs.intangible_drilling_costs		= HTML.getUserInput("IntangibleDrillingCosts");
	inputs.other_income						= HTML.getUserInput("OtherIncome");

	return inputs;
}

function mapInputValues(inputs) {
	//
	// For each entry on the web page, figure out where it goes on the tax forms. Make a
	// list of the forms that are needed and the lines on those forms that need to be
	// initialized.
	//

	// Build an array with the tax forms entered by the taxpayer.
	let tax_data	= new TaxpayerForms();
	let f1040		= tax_data.addForm("F1040");
	let f1040S1		= tax_data.addForm("F1040S1");
	let f1040S1A	= tax_data.addForm("F1040S1A");
	let f1040SA		= tax_data.addForm("F1040SA");
	let WS_AMT		= tax_data.addForm("WS_AMT");

	tax_data.addLine(f1040,		inputs.agi,								"11b");
	tax_data.addLine(f1040,		inputs.qualified_dividends,				"03a");
	tax_data.addLine(f1040,		inputs.capital_gains,					"07a");
	tax_data.addLine(f1040,		inputs.taxable_income,					"15");
	tax_data.addLine(f1040,		inputs.income_tax,						"16");

	tax_data.addLine(f1040SA,	inputs.itemized_deduction,				"17");
	tax_data.addLine(f1040SA,	inputs.taxes_paid_deduction,			"07");
	tax_data.addLine(f1040,		inputs.qbi_deduction,					"13a");

	tax_data.addLine(f1040S1,	inputs.state_tax_refund,				"01");
	tax_data.addLine(WS_AMT,	inputs.investment_interest,				"02c");
	tax_data.addLine(WS_AMT,	inputs.depletion,						"02d");
	tax_data.addLine(WS_AMT,	inputs.net_operating_loss,				"02e");
	tax_data.addLine(WS_AMT,	inputs.alternate_net_operating_loss,	"02f");
	tax_data.addLine(WS_AMT,	inputs.private_activity_bonds_interest,	"02g");
	tax_data.addLine(WS_AMT,	inputs.qualified_small_business_stock,	"02h");
	tax_data.addLine(WS_AMT,	inputs.incentive_stock_options,			"02i");
	tax_data.addLine(WS_AMT,	inputs.estates_and_trusts,				"02j");
	tax_data.addLine(WS_AMT,	inputs.disposition_of_property,			"02k");
	tax_data.addLine(WS_AMT,	inputs.post_1986_depreciation,			"02l");
	tax_data.addLine(WS_AMT,	inputs.passive_activities,				"02m");
	tax_data.addLine(WS_AMT,	inputs.loss_limitations,				"02n");
	tax_data.addLine(WS_AMT,	inputs.circulation_costs,				"02o");
	tax_data.addLine(WS_AMT,	inputs.long_term_contracts,				"02p");
	tax_data.addLine(WS_AMT,	inputs.mining_costs,					"02q");
	tax_data.addLine(WS_AMT,	inputs.reseach_costs,					"02r");
	tax_data.addLine(WS_AMT,	inputs.installment_sales,				"02s");
	tax_data.addLine(WS_AMT,	inputs.intangible_drilling_costs,		"02t");
	tax_data.addLine(WS_AMT,	inputs.other_income,					"03");

	return tax_data;
}

function putOutputs() {
	HTML.putUserOutput("AMTIncome",		Forms.getValue("WS_AMT", "04"));
	HTML.putUserOutput("AMTExemption",	Forms.getValue("WS_AMT", "05"));
	HTML.putUserOutput("AMT",			Forms.getValue("WS_AMT", "11"));
}

function ChangeHandler(event) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole AMT (not just the field tha was changed).
	//
	let inputs		= {};		// Object - indexed by name
	let taxpayer	= {};		// Object
	let tax_data	= [];		// Array of forms - not indexed by name
	let tax_table;
	
	// Reset static (global) variables. This erases all information from a previous
	// calculation.
	Debug.reset();
	Forms.reset();
	Taxpayer.reset();
	
	inputs = getInputs();
	if(inputs.filing_status
	if (Str.caseEqual(inputs.filing_status, "MFJ")) {
		HTML.showElement("SpouseContainer");
	} else {
		HTML.hideElement("SpouseContainer");
	}
	tax_table	= TaxTable.getTaxTable(inputs.tax_year);	// Return value not needed.
	taxpayer	= createTaxpayer(inputs);					// Return value not needed.
	tax_data	= mapInputValues(inputs);

	tax_data.loadForms();					// Load the taxpayer's data into tax forms.
	Forms.getForm("WS_AMT").calculate();	// Calculate the AMT Worksheet, which, in turn, will
											// calculate anything it needs.
	putOutputs();

	// Forms.toConsole();					// Print all forms to the console.log().
	Debug.turnOn();							// Enable debugging keywords.
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	// All the listeners for the data fields use the same handler so when any field
	// is changed the whole calculation is redone.
	//

	// Listen for changes to the input data.
	HTML.addListener("TaxYear",						"change", ChangeHandler);
	HTML.addListener("FilingStatus",				"change", ChangeHandler);
	HTML.addListener("TaxpayersBirthday",			"change", ChangeHandler);
	HTML.addListener("SpousesBirthday",				"change", ChangeHandler);
	HTML.addListener("TaxpayerIsBlind",				"change", ChangeHandler);
	HTML.addListener("SpouseIsBlind",				"change", ChangeHandler);

	// Input fields
	HTML.addListener("AGI",							"change", ChangeHandler);
	HTML.addListener("QualifiedDividends",			"change", ChangeHandler);
	HTML.addListener("CapitalGains",				"change", ChangeHandler);
	HTML.addListener("TaxableIncome",				"change", ChangeHandler);
	HTML.addListener("IncomeTax",					"change", ChangeHandler);

	HTML.addListener("ItemizedDeduction",			"change", ChangeHandler);
	HTML.addListener("TaxesPaidDeduction",			"change", ChangeHandler);
	HTML.addListener("QBIDeduction",				"change", ChangeHandler);

	HTML.addListener("StateTaxRefund",				"change", ChangeHandler);
	HTML.addListener("InvestmentInterestExpense",	"change", ChangeHandler);
	HTML.addListener("Depletion",					"change", ChangeHandler);
	HTML.addListener("NetOperatingLoss",			"change", ChangeHandler);
	HTML.addListener("AlternateNetOperatingLoss",	"change", ChangeHandler);
	HTML.addListener("PrivateActivityBondsInterest","change", ChangeHandler);
	HTML.addListener("QualifiedSmallBusinessStock",	"change", ChangeHandler);
	HTML.addListener("IncentiveStockOptions",		"change", ChangeHandler);
	HTML.addListener("EstatesAndTrusts",			"change", ChangeHandler);
	HTML.addListener("DispositionOfProperty",		"change", ChangeHandler);
	HTML.addListener("Post1986Depreciation",		"change", ChangeHandler);
	HTML.addListener("PassiveActivities",			"change", ChangeHandler);
	HTML.addListener("LossLimitations",				"change", ChangeHandler);
	HTML.addListener("CirculationCosts",			"change", ChangeHandler);
	HTML.addListener("LongTermContracts",			"change", ChangeHandler);
	HTML.addListener("MiningCosts",					"change", ChangeHandler);
	HTML.addListener("ReseachCosts",				"change", ChangeHandler);
	HTML.addListener("InstallmentSales",			"change", ChangeHandler);
	HTML.addListener("IntangibleDrillingCosts",		"change", ChangeHandler);
	HTML.addListener("OtherIncome",					"change", ChangeHandler);

	HTML.hideElement("SpouseContainer");
	HTML.hideElement("DebugContainer");
});
