
import { turnOffDebug, turnOnDebug }		from "../Library/Debug.js";
import { addListener }						from "../Library/HTML.js";
import { getUserInput, putUserOutput }		from "../Library/HTML.js";
import { min, max, round }					from "../Library/Numbers.js";
import { getTaxableSocialSecurity }			from "../Library/SocialSecurity/SocialSecurity.js";
import { initializeTaxTables }				from "../Library/TaxTables/TaxTables.js";

function calculategetTaxableSocialSecurity(event) {
	// Current year
	const filing_status_0			= getUserInput("FilingStatus-0", "text");
	const ss_received_0				= getUserInput("SocialSecurity-0");
	const ss_income_0				= getUserInput("Income-0");
	const tax_exempt_interest_0		= getUserInput("TaxExemptInterest-0");
	const adjustments_0				= getUserInput("Adjustments-0");
	let ss_taxable_0				= 0;
	let ss_received_alt				= 0;
	let ss_taxable_alt				= 0;

	// Previous year 1
	const filing_status_1			= getUserInput("FilingStatus-1", "text");
	const lump_sum_1				= getUserInput("LumpSum-1");
	const agi_1						= getUserInput("AGI-1");
	const tax_exempt_interest_1		= getUserInput("TaxExemptInterest-1");
	const ss_received_reported_1	= getUserInput("SocialSecurityReceivedReported-1");
	const ss_taxable_reported_1		= getUserInput("SocialSecurityTaxableReported-1");
	let ss_taxable_new_1			= 0;

	// Previous year 2
	const filing_status_2			= getUserInput("FilingStatus-2", "text");
	const lump_sum_2				= getUserInput("LumpSum-2");
	const agi_2						= getUserInput("AGI-2");
	const tax_exempt_interest_2		= getUserInput("TaxExemptInterest-2");
	const ss_received_reported_2	= getUserInput("SocialSecurityReceivedReported-2");
	const ss_taxable_reported_2		= getUserInput("SocialSecurityTaxableReported-2");
	let ss_taxable_new_2			= 0;

	let taxable_percent				= 0;

	putUserOutput("TaxableSocialSecurity-0",	0);
	putUserOutput("TaxablePercent-0",			"0%", "text");
	putUserOutput("TaxableSocialSecurityAlt",	0);
	putUserOutput("TaxablePercentAlt",			"0%", "text");
	putUserOutput("TaxableSocialSecurityNew-1",	0);
	putUserOutput("TaxablePercent-1",			"0%", "text");
	putUserOutput("TaxableSocialSecurityNew-2",	0);
	putUserOutput("TaxablePercent-2",			"0%", "text");
	if (ss_received_0 === 0) {
		return;
	}

	initializeTaxTables(filing_status_0);


	// Current year - Standard Method
	ss_taxable_0 = getTaxableSocialSecurity(
							filing_status_0,
							ss_received_0,
							ss_income_0,
							tax_exempt_interest_0,
							adjustments_0);

	taxable_percent = round(ss_taxable_0 / ss_received_0 * 100);
	putUserOutput("TaxableSocialSecurity-0",	ss_taxable_0);
	putUserOutput("TaxablePercent-0",			taxable_percent + "%",	"text");


	// Current year - Alternate Method
	ss_received_alt = ss_received_0 - lump_sum_1 - lump_sum_2;
	if (ss_received_alt !== 0) {
		ss_taxable_alt		= getTaxableSocialSecurity(
								filing_status_0,
								ss_received_alt,
								ss_income_0,
								tax_exempt_interest_0,
								adjustments_0);
	}

	// Previous Year 1
	if (lump_sum_1 !== 0) {
		ss_taxable_new_1	= getTaxableSocialSecurity(
								filing_status_1,
								ss_received_reported_1 + lump_sum_1,
								agi_1 - ss_taxable_reported_1,
								tax_exempt_interest_1,
								0);

		ss_taxable_new_1	-= ss_taxable_reported_1;
	}
	taxable_percent	= (lump_sum_1 === 0) ? 0 : round(ss_taxable_new_1 / lump_sum_1 * 100);
	ss_taxable_alt	+= ss_taxable_new_1;
	putUserOutput("TaxableSocialSecurityNew-1",		ss_taxable_new_1);
	putUserOutput("TaxablePercent-1",				taxable_percent + "%", "text");


	// Previous Year 2
	if (lump_sum_2 !== 0) {
		ss_taxable_new_2	= getTaxableSocialSecurity(
								filing_status_2,
								ss_received_reported_2 + lump_sum_2,
								agi_2 - ss_taxable_reported_2,
								tax_exempt_interest_2,
								0);

		ss_taxable_new_2	-= ss_taxable_reported_2;
	}
	taxable_percent	= (lump_sum_2 === 0) ? 0 : round(ss_taxable_new_2 / lump_sum_2 * 100);
	ss_taxable_alt	+= ss_taxable_new_2;
	putUserOutput("TaxableSocialSecurityNew-2",		ss_taxable_new_2);
	putUserOutput("TaxablePercent-2",				taxable_percent + "%", "text");


	// Alternate taxable amount
	taxable_percent = round(ss_taxable_alt / ss_received_0 * 100);
	putUserOutput("TaxableSocialSecurityAlt",		ss_taxable_alt);
	putUserOutput("TaxablePercentAlt",				taxable_percent + "%", "text");
}

function changeHandler(event) {
	// This is the function that is called if any input field is changed.
	turnOffDebug();
	calculategetTaxableSocialSecurity();
	turnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	addListener("FilingStatus-0",					"change", changeHandler);
	addListener("SocialSecurity-0",					"change", changeHandler);
	addListener("Income-0",							"change", changeHandler);
	addListener("TaxExemptInterest-0",				"change", changeHandler);
	addListener("Adjustments-0",					"change", changeHandler);

	addListener("SocialSecurity-0",					"change", changeHandler);
	addListener("TaxableSocialSecurity-0",			"change", changeHandler)

	addListener("FilingStatus-1",					"change", changeHandler);
	addListener("LumpSum-1",						"change", changeHandler);
	addListener("AGI-1",							"change", changeHandler);
	addListener("TaxExemptInterest-1",				"change", changeHandler);
	addListener("SocialSecurityReceivedReported-2",	"change", changeHandler);
	addListener("SocialSecurityTaxableReported-2",	"change", changeHandler);

	addListener("FilingStatus-2",					"change", changeHandler);
	addListener("LumpSum-2",						"change", changeHandler);
	addListener("AGI-2",							"change", changeHandler);
	addListener("TaxExemptInterest-2",				"change", changeHandler);
	addListener("SocialSecurityReceivedReported-2",	"change", changeHandler);
	addListener("SocialSecurityTaxableReported-2",	"change", changeHandler);

	turnOffDebug();
});
