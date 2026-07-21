
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { Forms }		from "../Library/Classes/Forms.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { Taxpayer }		from "../Library/Classes/Taxpayer.js";
import { TaxData }		from "../Library/Classes/TaxData.js";
import { TaxTable }		from "../Library/Classes/TaxTable.js";

function changeHandler(event) {
	//
	// This function is called when any input field is changed. It calculates the
	// whole deduction (not just the field tha was changed).
	//
	try {
		// Reset static (global) variables to erase information from a previous calculation.
		HTML.putElementValue("ErrorMessageOutput", "");
		Debug.reset();
		Forms.reset();
		Taxpayer.reset();

		const inputs	= getInputs();								// Get inputs from the web page
		const tax_table	= TaxTable.getTaxTable(inputs.tax_year);	// Initialize tax tables; ignore return value.
		const taxpayer	= createTaxpayer(inputs);					// Initialize taxpayer; ignore return value.
		const tax_data	= mapInputValues(inputs);					// Map input values to tax forms

		TaxData.loadForms(tax_data.forms);							// Create tax forms for the taxpayer's data
		putOutputs(inputs);											// Put results on web page
		Debug.turnOn();												// Put debug info on web page if enabled
	} catch (err) {
		HTML.putElementValue("ErrorMessageOutput", err);
		document.getElementById("ErrorMessageOutput").scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

function createTaxpayer(inputs) {
	const taxpayer		= new Taxpayer();
	taxpayer.tax_year	= inputs.tax_year;
	return taxpayer;
}

function getInputs() {
	//
	// Get the values from the web page. Put them in an object literal so the values
	// can be accessed by name.
	//
	const inputs = {};

	inputs.tax_year					= Dates.getTaxYear();

	// Income
	inputs.sales					= HTML.getUserInput("Sales");
	inputs.returns					= HTML.getUserInput("Returns");
	inputs.cost						= HTML.getUserInput("Cost");
	inputs.other_income				= HTML.getUserInput("OtherIncome");
	inputs.home_office_expense		= HTML.getUserInput("HomeOfficeExpense");

	// Expenses
	inputs.medical_insurance		= HTML.getUserInput("MedicalInsurance");
	inputs.advertising				= HTML.getUserInput("Advertising");
	inputs.car_and_truck			= HTML.getUserInput("CarAndTruck");
	inputs.car_and_truck_miles		= HTML.getUserInput("CarAndTruckMiles");
	inputs.commissions_and_fees		= HTML.getUserInput("CommissionsAndFees");
	inputs.contract_labor			= HTML.getUserInput("ContractLabor");
	inputs.depletion				= HTML.getUserInput("Depletion");
	inputs.depreciation				= HTML.getUserInput("Depreciation");
	inputs.employee_benefit_programs= HTML.getUserInput("EmployeeBenefitPrograms");
	inputs.insurance				= HTML.getUserInput("Insurance");
	inputs.interest					= HTML.getUserInput("Interest");
	inputs.professional_services	= HTML.getUserInput("ProfessionalServices");
	inputs.office_expenses			= HTML.getUserInput("OfficeExpenses");
	inputs.pension_plan				= HTML.getUserInput("PensionPlan");
	inputs.rent						= HTML.getUserInput("Rent");
	inputs.repairs					= HTML.getUserInput("Repairs");
	inputs.supplies					= HTML.getUserInput("Supplies");
	inputs.taxes_and_licenses		= HTML.getUserInput("TaxesAndLicenses");
	inputs.travel					= HTML.getUserInput("Travel");
	inputs.utilities				= HTML.getUserInput("Utilities");
	inputs.wages					= HTML.getUserInput("Wages");
	inputs.other_expenses			= HTML.getUserInput("OtherExpenses");

	return inputs;
}

function mapInputValues(inputs) {
	//
	// For each entry on the web page, figure out where it goes on the tax forms. Make a
	// list of the forms that are needed and the lines on those forms that need to be
	// initialized.
	//
	const tt = TaxTable.getTaxTable();

	// Build an array with the tax forms entered by the taxpayer.
	const tax_data	= new TaxData();
	const f1040SC	= tax_data.addForm("F1040SC");
	const f7206		= tax_data.addForm("F7206");	// Self-employment Health Insurance Deduction

	// Income
	tax_data.addLine(f1040SC,	"01",	inputs.sales);
	tax_data.addLine(f1040SC,	"02",	inputs.returns);
	tax_data.addLine(f1040SC,	"04",	inputs.cost);
	tax_data.addLine(f1040SC,	"06",	inputs.other_income);
	tax_data.addLine(f1040SC,	"30",	inputs.home_office_expense);

	// Expenses
	let car_and_truck = inputs.car_and_truck;
	if (car_and_truck === 0) {
		car_and_truck = tt.getBusinessMileageDeduction(inputs.car_and_truck_miles);
	}
	tax_data.addLine(f1040SC,	"08",	inputs.advertising);
	tax_data.addLine(f1040SC,	"09",	car_and_truck);
	tax_data.addLine(f1040SC,	"10",	inputs.commissions_and_fees);
	tax_data.addLine(f1040SC,	"11",	inputs.contract_labor);
	tax_data.addLine(f1040SC,	"12",	inputs.depletion);
	tax_data.addLine(f1040SC,	"13",	inputs.depreciation);
	tax_data.addLine(f1040SC,	"14",	inputs.employee_benefit_programs);
	tax_data.addLine(f1040SC,	"15",	inputs.insurance);
	tax_data.addLine(f1040SC,	"16a",	inputs.interest);
	tax_data.addLine(f1040SC,	"17",	inputs.professional_services);
	tax_data.addLine(f1040SC,	"18",	inputs.office_expenses);
	tax_data.addLine(f1040SC,	"19",	inputs.pension_plan);
	tax_data.addLine(f1040SC,	"20a",	inputs.rent);
	tax_data.addLine(f1040SC,	"21",	inputs.repairs);
	tax_data.addLine(f1040SC,	"22",	inputs.supplies);
	tax_data.addLine(f1040SC,	"23",	inputs.taxes_and_licenses);
	tax_data.addLine(f1040SC,	"24a",	inputs.travel);
	tax_data.addLine(f1040SC,	"25",	inputs.utilities);
	tax_data.addLine(f1040SC,	"26",	inputs.wages);
	tax_data.addLine(f1040SC,	"27b",	inputs.other_expenses);

	tax_data.addLine(f7206,		"01",	inputs.medical_insurance);

	return tax_data;
}

function putOutputs(inputs) {
	//
	// Get the information we are interested in and write them to the web page.
	//
	const retirement_contributions	= 0;
	const net_profit				= Forms.getValue("F1040SC",	"31");
	const se_tax					= Forms.getValue("SETax", "12");
	const sehi_adjustment			= Forms.getValue("F7206", "14");
	const qbi_deduction				= Math.round(Math.max(0, net_profit -
										(se_tax / 2) -
										retirement_contributions -
										sehi_adjustment) * 0.20);

	HTML.putUserOutput("GrossProfit",					Forms.getValue("F1040SC", "05"));
	HTML.putUserOutput("GrossIncome",					Forms.getValue("F1040SC", "07"));
	HTML.putUserOutput("NetProfit",						net_profit);
	HTML.putUserOutput("SelfEmploymentTax",				se_tax);
	HTML.putUserOutput("QBI_Deduction",					qbi_deduction);
	HTML.putUserOutput("SelfEmploymentTaxAdjustment",	Math.round(se_tax / 2));

	HTML.putUserOutput("NetProfitAfterSEHI",			net_profit - sehi_adjustment);
	HTML.putUserOutput("SEHI_Adjustment",				sehi_adjustment);
	HTML.putUserOutput("MedicalDeduction",				inputs.medical_insurance - sehi_adjustment);
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	//

	// Income
	HTML.addListener("Sales",					"change", changeHandler);
	HTML.addListener("Returns",					"change", changeHandler);
	HTML.addListener("Cost",					"change", changeHandler);
	HTML.addListener("OtherIncome",				"change", changeHandler);
	HTML.addListener("HomeOfficeExpense",		"change", changeHandler);
	// HTML.addListener("GrossIncome",			"change", changeHandler);

	// Expenses
	HTML.addListener("Advertising",				"change", changeHandler);
	HTML.addListener("CarAndTruck",				"change", changeHandler);
	HTML.addListener("CarAndTruckMiles",		"change", changeHandler);
	HTML.addListener("CommissionsAndFees",		"change", changeHandler);
	HTML.addListener("ContractLabor",			"change", changeHandler);
	HTML.addListener("Depletion",				"change", changeHandler);
	HTML.addListener("Depreciation",			"change", changeHandler);
	HTML.addListener("EmployeeBenefitPrograms",	"change", changeHandler);
	HTML.addListener("Insurance",				"change", changeHandler);
	HTML.addListener("Interest",				"change", changeHandler);
	HTML.addListener("ProfessionalServices",	"change", changeHandler);
	HTML.addListener("MedicalInsurance",		"change", changeHandler);
	HTML.addListener("OfficeExpenses",			"change", changeHandler);
	HTML.addListener("PensionPlan",				"change", changeHandler);
	HTML.addListener("Rent",					"change", changeHandler);
	HTML.addListener("Repairs",					"change", changeHandler);
	HTML.addListener("Supplies",				"change", changeHandler);
	HTML.addListener("TaxesAndLicenses",		"change", changeHandler);
	HTML.addListener("Travel",					"change", changeHandler);
	HTML.addListener("Utilities",				"change", changeHandler);
	HTML.addListener("Wages",					"change", changeHandler);
	HTML.addListener("OtherExpenses",			"change", changeHandler);
	// HTML.addListener("TotalExpenses",		"change", changeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const Sales = document.getElementById('Sales');
	Sales.focus({
		preventScroll: true
	});

	HTML.hideElement("DebugContainer");
});
