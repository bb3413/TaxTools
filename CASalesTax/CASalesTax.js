
import { Alert }				from "../Library/Classes/Alert.js";
import { HTML }					from "../Library/Classes/HTML.js";
import { fetchSalesTaxRate }	from "../Library/SalesTax/SalesTaxFromCDTFA.js";

async function buttonHandler(event) {
	const address	= document.getElementById("StreetAddress").value;
	const city		= document.getElementById("City").value;
	const zip		= document.getElementById("ZipCode").value;

	HTML.putUserOutput("SalesTaxRate", "");
	if (!address || !city || !zip) {
		Alert.slowAlert("Street address, city, and zip code must all be provided.");
		return;
	}

	// The code "pauses" here until fetchSalesTaxRate() finishes.
	HTML.putUserOutput("SalesTaxRate", "Waiting for server...");
	const salesTaxRate = await fetchSalesTaxRate(address, city, zip);
	if (salesTaxRate) {
		HTML.putUserOutput("SalesTaxRate", salesTaxRate + "%");
	} else {
		HTML.putUserOutput("SalesTaxRate", "");
		Alert.slowAlert("Unable to lookup sales tax.");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("LookupButton").addEventListener("click", buttonHandler);
});

