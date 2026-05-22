
function CalculateTax() {
	let gross_profit					= 0;
	let gross_income					= 0;
	let total_expenses					= 0;
	let car_and_truck					= 0;
	let net_profit						= 0;
	let self_employment_tax				= 0;
	let qbi_deduction					= 0;
	let sehi_adjustment					= 0;
	let net_profit_after_sehi			= 0;
	let profit_for_sehi_calculation		= 0;
	let medical_insurance				= 0;
	let medical_deduction				= 0;
	const retirement_plan_contributions	= getUserInput("PensionPlan");
	
	InitializeTaxTables();

	car_and_truck = getUserInput("CarAndTruck");
	if (car_and_truck === 0) {
		car_and_truck = getBusinessMileageDeduction(getUserInput("CarAndTruckMiles"));
	}
		
	// Expenses
	total_expenses =
		getUserInput("Advertising") +
		car_and_truck +
		getUserInput("CommissionsAndFees") +
		getUserInput("ContractLabor") +
		getUserInput("Depletion") +
		getUserInput("Depreciation") +
		getUserInput("EmployeeBenefitPrograms") +
		getUserInput("Insurance") +
		getUserInput("Interest") +
		getUserInput("ProfessionalServices") +
		getUserInput("OfficeExpenses") +
		getUserInput("PensionPlan") +
		getUserInput("Rent") +
		getUserInput("Repairs") +
		getUserInput("Supplies") +
		getUserInput("TaxesAndLicenses") +
		getUserInput("Travel") +
		getUserInput("Utilities") +
		getUserInput("Wages") +
		getUserInput("OtherExpenses");
	
	// Calculate new profit
	gross_profit	= getUserInput("Sales") - getUserInput("Returns") - getUserInput("Cost");
	gross_income	= gross_profit + getUserInput("OtherIncome");
	net_profit		= gross_income - total_expenses - getUserInput("HomeOfficeExpense");

	// Calculate self-employemnt tax
	self_employment_tax				= SE_Tax(net_profit, 0);
	self_employment_tax_adjustment	= Round(self_employment_tax / 2);
	
	// Calculate SEHI adjustment
	maximum_sehi_adjustment			= net_profit - self_employment_tax_adjustment - retirement_plan_contributions;
	medical_insurance				= getUserInput("MedicalInsurance");
	if (medical_insurance < maximum_sehi_adjustment) {
		// Subtract all medical insurance from profit
		net_profit_after_sehi		= net_profit - medical_insurance;
		sehi_adjustment				= medical_insurance;
		medical_deduction			= 0;
	} else {
		// Divide medical insurance between SEHI and medical deduction.
		net_profit_after_sehi		= net_profit - maximum_sehi_adjustment;
		sehi_adjustment				= maximum_sehi_adjustment;
		medical_deduction			= medical_insurance - maximum_sehi_adjustment;
	}

	qbi_deduction					= Round((net_profit -
										self_employment_tax_adjustment -
										retirement_plan_contributions -
										sehi_adjustment) * 0.20);
							   
	putUserOutput("NetProfit",						net_profit);
	putUserOutput("SelfEmploymentTax",				self_employment_tax);
	putUserOutput("QBI_Deduction",					qbi_deduction);
	putUserOutput("SelfEmploymentTaxAdjustment",	self_employment_tax_adjustment);

	putUserOutput("NetProfitAfterSEHI",				net_profit_after_sehi);
	putUserOutput("SEHI_Adjustment",				sehi_adjustment);
	putUserOutput("MedicalDeduction",				medical_deduction);
	
	putUserOutput("GrossIncome",					gross_income);
	putUserOutput("TotalExpenses",					total_expenses);
}

function ChangeHandler(event) {
	// This is the function that is called if any input field is changed.
	TurnOffDebug();
	CalculateTax();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	// Income
	addListener("Sales",					"change", ChangeHandler);
	addListener("Returns",					"change", ChangeHandler);
	addListener("Cost",						"change", ChangeHandler);
	addListener("OtherIncome",				"change", ChangeHandler);
	addListener("HomeOfficeExpense",		"change", ChangeHandler);
	// addListener("GrossIncome",			"change", ChangeHandler);

	// Expenses
	addListener("Advertising",				"change", ChangeHandler);
	addListener("CarAndTruck",				"change", ChangeHandler);
	addListener("CarAndTruckMiles",			"change", ChangeHandler);
	addListener("CommissionsAndFees",		"change", ChangeHandler);
	addListener("ContractLabor",			"change", ChangeHandler);
	addListener("Depletion",				"change", ChangeHandler);
	addListener("Depreciation",				"change", ChangeHandler);
	addListener("EmployeeBenefitPrograms",	"change", ChangeHandler);
	addListener("Insurance",				"change", ChangeHandler);
	addListener("Interest",					"change", ChangeHandler);
	addListener("ProfessionalServices",		"change", ChangeHandler);
	addListener("MedicalInsurance",			"change", ChangeHandler);
	addListener("OfficeExpenses",			"change", ChangeHandler);
	addListener("PensionPlan",				"change", ChangeHandler);
	addListener("Rent",						"change", ChangeHandler);
	addListener("Repairs",					"change", ChangeHandler);
	addListener("Supplies",					"change", ChangeHandler);
	addListener("TaxesAndLicenses",			"change", ChangeHandler);
	addListener("Travel",					"change", ChangeHandler);
	addListener("Utilities",				"change", ChangeHandler);
	addListener("Wages",					"change", ChangeHandler);
	addListener("OtherExpenses",			"change", ChangeHandler);
	// addListener("TotalExpenses",			"change", ChangeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const Sales = document.getElementById('Sales');
	Sales.focus({
		preventScroll: true
	});

	ChangeHandler();
});
