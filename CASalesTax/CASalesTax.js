
async function buttonHandler(event) {
	const address	= document.getElementById("StreetAddress").value;
	const city		= document.getElementById("City").value;
	const zip		= document.getElementById("ZipCode").value;

	putUserOutput("SalesTaxRate", "");
	if (!address || !city || !zip) {
		slowAlert("Street address, city, and zip code must all be provided.");
		return;
	}

	// The code "pauses" here until fetchSalesTaxRate() finishes.
	putUserOutput("SalesTaxRate", "Waiting for server...");
	const salesTaxRate = await fetchSalesTaxRate(address, city, zip);
	if (salesTaxRate) {
		putUserOutput("SalesTaxRate", salesTaxRate + "%");
	} else {
		putUserOutput("SalesTaxRate", "");
		slowAlert("Unable to lookup sales tax.");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("LookupButton").addEventListener("click", buttonHandler);
});

