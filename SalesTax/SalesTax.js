
let tax_tear						= 0;
let adjusted_gross_income			= 0;
let family_size						= 0;
let zip_code						= 0;
	
const fetchTaxRate = async (zipCode) => {
	// California State Portal (CDTFA) tax rate API.
	const url = `https://services.maps.cdtfa.ca.gov/api/taxrate/GetRateByAddress?zip=${zipCode}`;
	const url2 = "https://services.maps.cdtfa.ca.gov/api/taxrate/GetRateByAddress?zip=95135";
	

	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log(`Tax Rate for ${zipCode}:`, data.TotalRate);
	} catch (error) {
		console.error('Error fetching tax rate:', error);
	}
};

const getSalesTax = async (zipCode) => {
	const url = `https://api.api-ninjas.com/v1/salestax?zip_code=${zipCode}`;
	const apiKey = "YOUR_API_KEY";	// Sign up at api-ninjas.com

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: { 'X-Api-Key': apiKey },
		});
		const data = await response.json();
		console.log(`Tax Rate for ${zipCode}:`, data.total_rate);
	} catch (error) {
		console.error('Error:', error);
	}
};

function CalculateAmount() {
	
	InitializeTaxTables("single", tax_year);
	
	sales_tax_deduction = getSalesTaxDeduction(adjusted_gross_income, family_size);	
	// fetchTaxRate(zip_code);
	// getSalesTax(zip_code);
}

function GetInputValues() {
	tax_year						= getUserInput("TaxYear");
	adjusted_gross_income			= getUserInput("AdjustedGrossIncome");
	family_size						= getUserInput("FamilySize");
	zip_code						= getUserInput("ZipCode");
}

function PutResults() {
	putUserOutput("SalesTaxDeduction",	sales_tax_deduction);
}

function ChangeHandler(event) {
	// This is the function that is called if any input field is changed.
	TurnOffDebug();
	GetInputValues();
	CalculateAmount();
	PutResults();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	addListener("TaxYear",					"change", ChangeHandler);
	addListener("AdjustedGrossIncome",		"change", ChangeHandler);
	addListener("FamilySize",				"change", ChangeHandler);
	addListener("ZipCode",					"change", ChangeHandler);

	ChangeHandler();
});