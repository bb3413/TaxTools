
import { Alert }				from "../Library/Classes/Alert.js";
import { HTML }					from "../Library/Classes/HTML.js";
import { fetchSalesTaxRate }	from "../Library/SalesTax/SalesTaxFromCDTFA.js";

async function buttonHandler(event) {
	try {
		const address	= document.getElementById("StreetAddress").value;
		const city		= document.getElementById("City").value;
		const zip		= document.getElementById("ZipCode").value;

		HTML.putUserOutput("SalesTaxRate", "");
		if (!address || !city || !zip) {
			// Alert.slowAlert("Street address, city, and zip code must all be provided.");
			throw new Error("Street address, city, and zip code must all be provided.");
			return;
		}

		// The code "pauses" here until fetchSalesTaxRate() finishes.
		HTML.putUserOutput("SalesTaxRate", "Waiting for server...");
		const salesTaxRate = await fetchSalesTaxRate(address, city, zip);
		if (salesTaxRate) {
			HTML.putUserOutput("SalesTaxRate", salesTaxRate + "%");
		} else {
			HTML.putUserOutput("SalesTaxRate", "");
			// Alert.slowAlert("Unable to lookup sales tax.");
			throw new Error("Unable to lookup sales tax.");
		}
	} catch (err) {
		HTML.putElementValue("ErrorMessageOutput", err);
		document.getElementById("ErrorMessageOutput").scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("LookupButton").addEventListener("click", buttonHandler);
});

