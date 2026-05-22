
function slowAlert(message) {
	// Wrap the alert in a brief timeout so it moves behind refreshing the
	// display in priority; allow the SalesTaxRate field to finish being cleared.
	setTimeout(() => { alert(message); }, 10);
}