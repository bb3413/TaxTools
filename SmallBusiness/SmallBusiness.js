
import { Dates }		from "../Library/Classes/Dates.js";
import { Debug }		from "../Library/Classes/Debug.js";
import { Forms }		from "../Library/Classes/Forms.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { Taxpayer }		from "../Library/Classes/Taxpayer.js";
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
		mapInputValues(inputs);										// Map input values to tax forms
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
	const tt		= TaxTable.getTaxTable();
	const f1040SC	= Forms.createForm("F1040SC");
	const f7206		= Forms.createForm("F7206");	// Self-employment Health Insurance Deduction

	// Income
	f1040SC.lines["01"].override_value(inputs.sales);
	f1040SC.lines["02"].override_value(inputs.returns);
	f1040SC.lines["04"].override_value(inputs.cost);
	f1040SC.lines["06"].override_value(inputs.other_income);
	f1040SC.lines["30"].override_value(inputs.home_office_expense);

	// Expenses
	let car_and_truck = inputs.car_and_truck;
	if (car_and_truck === 0) {
		car_and_truck = tt.getBusinessMileageDeduction(inputs.car_and_truck_miles);
	}
	f1040SC.lines["08" ].override_value(inputs.advertising);
	f1040SC.lines["09" ].override_value(car_and_truck);
	f1040SC.lines["10" ].override_value(inputs.commissions_and_fees);
	f1040SC.lines["11" ].override_value(inputs.contract_labor);
	f1040SC.lines["12" ].override_value(inputs.depletion);
	f1040SC.lines["13" ].override_value(inputs.depreciation);
	f1040SC.lines["14" ].override_value(inputs.employee_benefit_programs);
	f1040SC.lines["15" ].override_value(inputs.insurance);
	f1040SC.lines["16a"].override_value(inputs.interest);
	f1040SC.lines["17" ].override_value(inputs.professional_services);
	f1040SC.lines["18" ].override_value(inputs.office_expenses);
	f1040SC.lines["19" ].override_value(inputs.pension_plan);
	f1040SC.lines["20a"].override_value(inputs.rent);
	f1040SC.lines["21" ].override_value(inputs.repairs);
	f1040SC.lines["22" ].override_value(inputs.supplies);
	f1040SC.lines["23" ].override_value(inputs.taxes_and_licenses);
	f1040SC.lines["24a"].override_value(inputs.travel);
	f1040SC.lines["25" ].override_value(inputs.utilities);
	f1040SC.lines["26" ].override_value(inputs.wages);
	f1040SC.lines["27b"].override_value(inputs.other_expenses);

	f7206.lines["01"].override_value(inputs.medical_insurance);
}

function putOutputs(inputs) {
	//
	// Get the information we are interested in and write them to the web page.
	//
	const retirement_contributions	= 0;
	const net_profit				= Forms.getValue("F1040SC",	"31");
	const se_tax					= Forms.getValue("F1040SSE", "12");
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

	HTML.putUserOutput("NetProfitAfterSEHI",			Math.max(0, net_profit - sehi_adjustment));
	HTML.putUserOutput("SEHI_Adjustment",				sehi_adjustment);
	HTML.putUserOutput("MedicalDeduction",				Math.max(0, inputs.medical_insurance - sehi_adjustment));

	HTML.putUserOutput("TotalExpenses",					Forms.getValue("F1040SC", "28"));
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
