
async function fetchSalesTaxRate(address, city, zip) {
	// encodeURIComponent handles spaces and special characters like "#" safely
	const cleanAddress	= encodeURIComponent(address.trim());
	const cleanCity		= encodeURIComponent(city.trim());
	const cleanZip		= encodeURIComponent(zip.trim());
	let salesTaxRate	= 0;

	// Accessing the cdtfa.ca.gov server from the client results in a security error. The
	// proxy.php script accesses the server for us, but from the our server.	
	const url = 'https://www.bruceblinn.com/6-OtherStuff/Taxes/TaxToolsDev/Library/SalesTax/' + 
		`CDTFA-Proxy.php?address=${cleanAddress}&city=${cleanCity}&zip=${cleanZip}`; // BCB change "TaxToolsDev" to "TaxTools"

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Server responded with status: ${response.status}`);
		}

		const data = await response.json();
		if (data && data.taxRateInfo && data.taxRateInfo.length > 0) {
			console.log("Sales Tax Rate: ",			data.taxRateInfo[0].rate);
			console.log("Sales Tax County: ",		data.taxRateInfo[0].county);
			console.log("Sales Tax Jurisdiction: ",	data.taxRateInfo[0].jurisdiction);
			salesTaxRate = data.taxRateInfo[0].rate;
		}
	} catch (error) {
		console.error("fetchSalesTaxRate() Error:", error);
	}
	
	return salesTaxRate;
}
