
document.addEventListener("DOMContentLoaded", () => {
	const LookupButton	= document.getElementById("LookupButton");
	const Result		= document.getElementById("Result");

	LookupButton.addEventListener("click", async () => {
		// 1. Collect inputs
		const address	= document.getElementById("StreetAddress").value;
		const city		= document.getElementById("City").value;
		const zip		= document.getElementById("ZipCode").value;

		if (!address || !city || !zip) {
			alert("All fields must be completed.");
			return;
		}

		// The code "pauses" here until fetchSalesTax finishes.
		putUserOutput("SalesTaxRate", "Waiting for server...");
		const salesTaxRate = await fetchSalesTaxRate(address, city, zip);
		if (salesTaxRate) {
			// Convert to percent
			const ratePercent = (salesTaxRate * 100).toFixed(3);
			putUserOutput("SalesTaxRate", ratePercent + "%");
		} else {
			alert("No results found or connection error.");
		}
	});
});