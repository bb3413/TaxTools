
import { turnOffDebug, turnOnDebug }		from "../Library/Debug.js";
import { addListener }						from "../Library/HTML.js";
import { getUserInput, putUserOutput }		from "../Library/HTML.js";
import { min, max, round }					from "../Library/Numbers.js";
import { getSEHIDeduction }					from "../Library/SelfEmployment/SEHIDeduction.js";
import { getSETax }							from "../Library/SelfEmployment/SelfEmploymentTax.js";
import { initializeTaxTables }				from "../Library/TaxTables/TaxTables.js";
import { getBusinessMileageDeduction }		from "../Library/TaxTables/TaxTables.js";

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
	self_employment_tax				= getSETax(net_profit, 0);
	self_employment_tax_adjustment	= round(self_employment_tax / 2);

	// Calculate SEHI adjustment
	medical_insurance				= getUserInput("MedicalInsurance");
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

	putUserOutput("GrossProfit",					gross_profit);
	putUserOutput("GrossIncome",					gross_income);
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

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	turnOffDebug();
	calculateTax();
	turnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	// Income
	addListener("Sales",					"change", changeHandler);
	addListener("Returns",					"change", changeHandler);
	addListener("Cost",						"change", changeHandler);
	addListener("OtherIncome",				"change", changeHandler);
	addListener("HomeOfficeExpense",		"change", changeHandler);
	// addListener("GrossIncome",			"change", changeHandler);

	// Expenses
	addListener("Advertising",				"change", changeHandler);
	addListener("CarAndTruck",				"change", changeHandler);
	addListener("CarAndTruckMiles",			"change", changeHandler);
	addListener("CommissionsAndFees",		"change", changeHandler);
	addListener("ContractLabor",			"change", changeHandler);
	addListener("Depletion",				"change", changeHandler);
	addListener("Depreciation",				"change", changeHandler);
	addListener("EmployeeBenefitPrograms",	"change", changeHandler);
	addListener("Insurance",				"change", changeHandler);
	addListener("Interest",					"change", changeHandler);
	addListener("ProfessionalServices",		"change", changeHandler);
	addListener("MedicalInsurance",			"change", changeHandler);
	addListener("OfficeExpenses",			"change", changeHandler);
	addListener("PensionPlan",				"change", changeHandler);
	addListener("Rent",						"change", changeHandler);
	addListener("Repairs",					"change", changeHandler);
	addListener("Supplies",					"change", changeHandler);
	addListener("TaxesAndLicenses",			"change", changeHandler);
	addListener("Travel",					"change", changeHandler);
	addListener("Utilities",				"change", changeHandler);
	addListener("Wages",					"change", changeHandler);
	addListener("OtherExpenses",			"change", changeHandler);
	// addListener("TotalExpenses",			"change", changeHandler);

	// Using autofocus attribute scrolls the page to that element; this will move the
	// focus but display the page without sccrolling to that element.
	const Sales = document.getElementById('Sales');
	Sales.focus({
		preventScroll: true
	});

	changeHandler();
});
