
import { Dates }			from "../Library/Classes/Dates.js";
import { Debug }			from "../Library/Classes/Debug.js";
import { Forms }			from "../Library/Classes/Forms.js";
import { HTML }				from "../Library/Classes/HTML.js";
import { Taxpayer }			from "../Library/Classes/Taxpayer.js";
import { TaxData }			from "../Library/Classes/TaxData.js";
import { TaxTable }			from "../Library/Classes/TaxTable.js";

function changeHandler(event) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole AMT (not just the field tha was changed).
	//
	try {
		// Reset static (global) variables to erase information from a previous calculation.
		HTML.putElementValue("ErrorMessageOutput", "");
		Debug.reset();
		Forms.reset();
		Taxpayer.reset();

		const inputs = getInputs();									// Get inputs from the web page
		if (inputs.filing_status === "MFJ") {
			HTML.showElement("SpouseContainer");
		} else {
			HTML.hideElement("SpouseContainer");
		}
		const tax_table	= TaxTable.getTaxTable(inputs.tax_year);	// Initialize tax tables; ignore return value.
		const taxpayer	= createTaxpayer(inputs);					// Initialize taxpayer; ignore return value.
		const tax_data	= mapInputValues(inputs);					// Map input values to tax forms

		TaxData.loadForms(tax_data.forms);							// Create tax forms for the taxpayer's data
		Forms.getForm("F6251").calculate();							// Calculate the tax forms
		putOutputs();												// Put results on web page
		Debug.turnOn();												// Put debug info on web page if enabled
	} catch (err) {
		HTML.putElementValue("ErrorMessageOutput", err);
		document.getElementById("ErrorMessageOutput").scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

function createTaxpayer(inputs) {
	const taxpayer					= new Taxpayer();

	taxpayer.tax_year				= inputs.tax_year;
	taxpayer.filing_status			= inputs.filing_status;
	taxpayer.taxpayers_birthday		= inputs.taxpayers_birthday;
	taxpayer.spouses_birthday		= inputs.spouses_birthday;
	taxpayer.is_taxpayer_blind		= inputs.is_taxpayer_blind;
	taxpayer.is_spouse_blind		= inputs.is_spouse_blind;

	return taxpayer;
}

function getInputs() {
	//
	// Get the values from the web page. Put them in an object literal so the values
	// can be accessed by name.
	//
	const inputs = {};

	// Input fields
	inputs.tax_year							= HTML.getUserInput("TaxYear");
	inputs.filing_status					= HTML.getUserInput("FilingStatus",			"text").toUpperCase();
	inputs.taxpayers_birthday				= HTML.getUserInput("TaxpayersBirthday",	"text");
	inputs.spouses_birthday					= HTML.getUserInput("SpousesBirthday",		"text");
	inputs.is_taxpayer_blind				= HTML.getUserInput("TaxpayerIsBlind");
	inputs.is_spouse_blind					= HTML.getUserInput("SpouseIsBlind");

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
	const tax_data	= new TaxData();
	const f1040		= tax_data.addForm("F1040");
	const f1040S1	= tax_data.addForm("F1040S1");
	const f1040SA	= tax_data.addForm("F1040SA");
	const f6251		= tax_data.addForm("F6251");

	tax_data.addLine(f1040,		"11b",	inputs.agi);
	tax_data.addLine(f1040,		"03a",	inputs.qualified_dividends);
	tax_data.addLine(f1040,		"07a",	inputs.capital_gains);
	tax_data.addLine(f1040,		"15",	inputs.taxable_income);
	tax_data.addLine(f1040,		"16",	inputs.income_tax);

	tax_data.addLine(f1040SA,	"17",	inputs.itemized_deduction);
	tax_data.addLine(f1040SA,	"07",	inputs.taxes_paid_deduction);
	tax_data.addLine(f1040,		"13a",	inputs.qbi_deduction);

	tax_data.addLine(f1040S1,	"01",	inputs.state_tax_refund);
	tax_data.addLine(f6251,		"02c",	inputs.investment_interest);
	tax_data.addLine(f6251,		"02d",	inputs.depletion);
	tax_data.addLine(f6251,		"02e",	inputs.net_operating_loss);
	tax_data.addLine(f6251,		"02f",	inputs.alternate_net_operating_loss);
	tax_data.addLine(f6251,		"02g",	inputs.private_activity_bonds_interest);
	tax_data.addLine(f6251,		"02h",	inputs.qualified_small_business_stock);
	tax_data.addLine(f6251,		"02i",	inputs.incentive_stock_options);
	tax_data.addLine(f6251,		"02j",	inputs.estates_and_trusts);
	tax_data.addLine(f6251,		"02k",	inputs.disposition_of_property);
	tax_data.addLine(f6251,		"02l",	inputs.post_1986_depreciation);
	tax_data.addLine(f6251,		"02m",	inputs.passive_activities);
	tax_data.addLine(f6251,		"02n",	inputs.loss_limitations);
	tax_data.addLine(f6251,		"02o",	inputs.circulation_costs);
	tax_data.addLine(f6251,		"02p",	inputs.long_term_contracts);
	tax_data.addLine(f6251,		"02q",	inputs.mining_costs);
	tax_data.addLine(f6251,		"02r",	inputs.reseach_costs);
	tax_data.addLine(f6251,		"02s",	inputs.installment_sales);
	tax_data.addLine(f6251,		"02t",	inputs.intangible_drilling_costs);
	tax_data.addLine(f6251,		"03",	inputs.other_income);

	return tax_data;
}

function putOutputs() {
	const tp = Taxpayer.getTaxpayer();

	if (tp.filing_status === "MFJ") {
		HTML.showElement("SpouseContainer");
	} else {
		HTML.hideElement("SpouseContainer");
	}

	HTML.putUserOutput("AMTIncome",		Forms.getValue("F6251", "04"));
	HTML.putUserOutput("AMTExemption",	Forms.getValue("F6251", "05"));
	HTML.putUserOutput("AMT",			Forms.getValue("F6251", "11"));
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	// All the listeners for the data fields use the same handler so when any field
	// is changed the whole calculation is redone.
	//

	// Listen for changes to the input data.
	HTML.addListener("TaxYear",						"change", changeHandler);
	HTML.addListener("FilingStatus",				"change", changeHandler);
	HTML.addListener("TaxpayersBirthday",			"change", changeHandler);
	HTML.addListener("SpousesBirthday",				"change", changeHandler);
	HTML.addListener("TaxpayerIsBlind",				"change", changeHandler);
	HTML.addListener("SpouseIsBlind",				"change", changeHandler);

	// Input fields
	HTML.addListener("AGI",							"change", changeHandler);
	HTML.addListener("QualifiedDividends",			"change", changeHandler);
	HTML.addListener("CapitalGains",				"change", changeHandler);
	HTML.addListener("TaxableIncome",				"change", changeHandler);
	HTML.addListener("IncomeTax",					"change", changeHandler);

	HTML.addListener("ItemizedDeduction",			"change", changeHandler);
	HTML.addListener("TaxesPaidDeduction",			"change", changeHandler);
	HTML.addListener("QBIDeduction",				"change", changeHandler);

	HTML.addListener("StateTaxRefund",				"change", changeHandler);
	HTML.addListener("InvestmentInterestExpense",	"change", changeHandler);
	HTML.addListener("Depletion",					"change", changeHandler);
	HTML.addListener("NetOperatingLoss",			"change", changeHandler);
	HTML.addListener("AlternateNetOperatingLoss",	"change", changeHandler);
	HTML.addListener("PrivateActivityBondsInterest","change", changeHandler);
	HTML.addListener("QualifiedSmallBusinessStock",	"change", changeHandler);
	HTML.addListener("IncentiveStockOptions",		"change", changeHandler);
	HTML.addListener("EstatesAndTrusts",			"change", changeHandler);
	HTML.addListener("DispositionOfProperty",		"change", changeHandler);
	HTML.addListener("Post1986Depreciation",		"change", changeHandler);
	HTML.addListener("PassiveActivities",			"change", changeHandler);
	HTML.addListener("LossLimitations",				"change", changeHandler);
	HTML.addListener("CirculationCosts",			"change", changeHandler);
	HTML.addListener("LongTermContracts",			"change", changeHandler);
	HTML.addListener("MiningCosts",					"change", changeHandler);
	HTML.addListener("ReseachCosts",				"change", changeHandler);
	HTML.addListener("InstallmentSales",			"change", changeHandler);
	HTML.addListener("IntangibleDrillingCosts",		"change", changeHandler);
	HTML.addListener("OtherIncome",					"change", changeHandler);

	HTML.hideElement("SpouseContainer");
	HTML.hideElement("DebugContainer");
});
