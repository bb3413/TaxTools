
function calculateTax() {
	let gross_profit					= 0;
	let gross_income					= 0;
	let total_expenses					= 0;
	let car_and_truck					= 0;
	let net_profit						= 0;
	let self_employment_tax				= 0;
	let self_employment_tax_adjustment	= 0;
	let qbi_deduction					= 0;
	let sehi_adjustment					= 0;
	let net_profit_after_sehi			= 0;
	let profit_for_sehi_calculation		= 0;
	let medical_insurance				= 0;
	let medical_deduction				= 0;
	let retirement_plan_contributions	= 0;	// IRA contributions

	initializeTaxTables();

	car_and_truck = HTML.getUserInput("CarAndTruck");
	if (car_and_truck === 0) {
		car_and_truck = getBusinessMileageDeduction(HTML.getUserInput("CarAndTruckMiles"));
	}

	// Expenses
	total_expenses =
		HTML.getUserInput("Advertising") +
		car_and_truck +
		HTML.getUserInput("CommissionsAndFees") +
		HTML.getUserInput("ContractLabor") +
		HTML.getUserInput("Depletion") +
		HTML.getUserInput("Depreciation") +
		HTML.getUserInput("EmployeeBenefitPrograms") +
		HTML.getUserInput("Insurance") +
		HTML.getUserInput("Interest") +
		HTML.getUserInput("ProfessionalServices") +
		HTML.getUserInput("OfficeExpenses") +
		HTML.getUserInput("PensionPlan") +
		HTML.getUserInput("Rent") +
		HTML.getUserInput("Repairs") +
		HTML.getUserInput("Supplies") +
		HTML.getUserInput("TaxesAndLicenses") +
		HTML.getUserInput("Travel") +
		HTML.getUserInput("Utilities") +
		HTML.getUserInput("Wages") +
		HTML.getUserInput("OtherExpenses");

	// Calculate new profit
	gross_profit	= HTML.getUserInput("Sales") - HTML.getUserInput("Returns") - HTML.getUserInput("Cost");
	gross_income	= gross_profit + HTML.getUserInput("OtherIncome");
	net_profit		= gross_income - total_expenses - HTML.getUserInput("HomeOfficeExpense");

	// Calculate self-employemnt tax
	self_employment_tax				= getSETax(net_profit, 0);
	self_employment_tax_adjustment	= round(self_employment_tax / 2);

	// Calculate SEHI adjustment
	medical_insurance				= HTML.getUserInput("MedicalInsurance");
	sehi_adjustment					= getSEHIDeduction(
											medical_insurance,
											0,		// LTC insurane
											net_profit,
											self_employment_tax_adjustment,
											0);		// Retirement plan contribution
	
	net_profit_after_sehi		= net_profit - sehi_adjustment;
	medical_deduction			= medical_insurance - sehi_adjustment;

	qbi_deduction					= round(max(0, net_profit -
										self_employment_tax_adjustment -
										retirement_plan_contributions -
										sehi_adjustment) * 0.20);

	HTML.putUserOutput("GrossProfit",					gross_profit);
	HTML.putUserOutput("GrossIncome",					gross_income);
	HTML.putUserOutput("NetProfit",						net_profit);
	HTML.putUserOutput("SelfEmploymentTax",				self_employment_tax);
	HTML.putUserOutput("QBI_Deduction",					qbi_deduction);
	HTML.putUserOutput("SelfEmploymentTaxAdjustment",	self_employment_tax_adjustment);

	HTML.putUserOutput("NetProfitAfterSEHI",				net_profit_after_sehi);
	HTML.putUserOutput("SEHI_Adjustment",				sehi_adjustment);
	HTML.putUserOutput("MedicalDeduction",				medical_deduction);

	HTML.putUserOutput("GrossIncome",					gross_income);
	HTML.putUserOutput("TotalExpenses",					total_expenses);
}

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	Debug.reset();
	calculateTax();
	Debug.turnOn();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	// Income
	HTML.addListener("Sales",					"change", changeHandler);
	HTML.addListener("Returns",					"change", changeHandler);
	HTML.addListener("Cost",						"change", changeHandler);
	HTML.addListener("OtherIncome",				"change", changeHandler);
	HTML.addListener("HomeOfficeExpense",		"change", changeHandler);
	// HTML.addListener("GrossIncome",			"change", changeHandler);

	// Expenses
	HTML.addListener("Advertising",				"change", changeHandler);
	HTML.addListener("CarAndTruck",				"change", changeHandler);
	HTML.addListener("CarAndTruckMiles",			"change", changeHandler);
	HTML.addListener("CommissionsAndFees",		"change", changeHandler);
	HTML.addListener("ContractLabor",			"change", changeHandler);
	HTML.addListener("Depletion",				"change", changeHandler);
	HTML.addListener("Depreciation",				"change", changeHandler);
	HTML.addListener("EmployeeBenefitPrograms",	"change", changeHandler);
	HTML.addListener("Insurance",				"change", changeHandler);
	HTML.addListener("Interest",					"change", changeHandler);
	HTML.addListener("ProfessionalServices",		"change", changeHandler);
	HTML.addListener("MedicalInsurance",			"change", changeHandler);
	HTML.addListener("OfficeExpenses",			"change", changeHandler);
	HTML.addListener("PensionPlan",				"change", changeHandler);
	HTML.addListener("Rent",						"change", changeHandler);
	HTML.addListener("Repairs",					"change", changeHandler);
	HTML.addListener("Supplies",					"change", changeHandler);
	HTML.addListener("TaxesAndLicenses",			"change", changeHandler);
	HTML.addListener("Travel",					"change", changeHandler);
	HTML.addListener("Utilities",				"change", changeHandler);
	HTML.addListener("Wages",					"change", changeHandler);
	HTML.addListener("OtherExpenses",			"change", changeHandler);
	// HTML.addListener("TotalExpenses",			"change", changeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const Sales = document.getElementById('Sales');
	Sales.focus({
		preventScroll: true
	});

	HTML.hideElement("DebugContainer");
});
