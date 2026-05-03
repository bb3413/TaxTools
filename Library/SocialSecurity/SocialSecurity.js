
/*
 * Calculate the amount of Social Security that is taxable.
 *
 * This is an implementation of Worksheet 1 from 2024 IRS Publication 915 Social
 * Security and Equivalent Railroad Benefits.
 *
 *	Combined income				= Half of Social Security + AGI + Tax Exempt Interest 
 *	Social Security Income		= Combined Income - Adjustments
 *	Social Security Range		= MFJ		32,000 + 12,000 = 44,000
 *								  Other		25,000 + 9,000  = 34,000
 *
 * If Social Security Income < Social Security Range
 *		Taxable Amount = 0
 *
 *	If Social Security Income within Social Security Range
 *		Taxable Amount = 0 - 50%
 *
 *	If Social Security Income above Social Security Range
 *		Taxable Amount = 0 - 85%
 */

// Global variables
let ss_line_1	= 0;
let ss_line_2	= 0;
let ss_line_3	= 0;
let ss_line_4	= 0;
let ss_line_5	= 0;
let ss_line_6	= 0;
let ss_line_7	= 0;
let ss_line_8	= 0;
let ss_line_9	= 0;
let ss_line_10	= 0;
let ss_line_11	= 0;
let ss_line_12	= 0;
let ss_line_13	= 0;
let ss_line_14	= 0;
let ss_line_15	= 0;
let ss_line_16	= 0;
let ss_line_17	= 0;
let ss_line_18	= 0;
let ss_line_19	= 0;
	
function getTaxableSocialSecurity(
	filing_status,
	total_ss,
	income_wo_ss,
	tax_exempt_interest,
	adjustments,
	lived_with_spouse = false) {

	//
	// Compute the taxable portion of Social Security benefit.
	//

	SSTax_ResetLines();

	ss_line_1	= total_ss;								// Sum of all SSA-1099, box 5
	ss_line_2	= Round(ss_line_1 / 2);					// Half of total SS benefits
	ss_line_3	= income_wo_ss;							// 1040, lines 1z, 2b, 3b, 4b, 5b, 7, and 8
	ss_line_4	= tax_exempt_interest;					// 1040, line 2a
	ss_line_5	= 0;									// Not used
	ss_line_6	= ss_line_2 + ss_line_3 + ss_line_4 + ss_line_5;
	ss_line_7	= adjustments;							// Schedule 1, lines 11-20, 23, and 25
	if (ss_line_7 >= ss_line_6) {
		SSTax_PutOutput();
		return 0;
	}
	ss_line_8	= Max(ss_line_6 - ss_line_7, 0);			// SS income
	if (strCaseEqual(filing_status, "MFS") && lived_with_spouse) {
		ss_line_17 = ss_line_8 * 0.85;
	} else {
		ss_line_9	= get_SS_Start50(filing_status);		// Start of 50% taxable range
		if (ss_line_9 >= ss_line_8) {
			SSTax_PutOutput();
			return 0;
		}
		ss_line_10	= Max(ss_line_8 - ss_line_9, 0);		// Amount above base of range
		ss_line_11	= get_SS_Start50Range(filing_status);	// Length of 50% taxable range
		ss_line_12	= Max(ss_line_10 - ss_line_11, 0);		// Amount above top of range
		ss_line_13	= Min(ss_line_10, ss_line_11);			// Amount within range
		ss_line_14	= ss_line_13 * 0.5;						// 50% of amount within range
		ss_line_15	= Min(ss_line_2, ss_line_14);			// At most 50% is taxable
		ss_line_16	= ss_line_12 * 0.85;					// 85% of amount above range
		ss_line_17	= ss_line_15 + ss_line_16;				// Taxable amount
	}
	ss_line_18	= ss_line_1 * 0.85;							// At most 85% is taxable
	ss_line_19	= Min(ss_line_17, ss_line_18);				// Taxable amount

	SSTax_PutOutput();
	return Round(ss_line_19);
}

function SSTax_ResetLines() {
	ss_line_1	= 0;
	ss_line_2	= 0;
	ss_line_3	= 0;
	ss_line_4	= 0;
	ss_line_5	= 0;
	ss_line_6	= 0;
	ss_line_7	= 0;
	ss_line_8	= 0;
	ss_line_9	= 0;
	ss_line_10	= 0;
	ss_line_11	= 0;
	ss_line_12	= 0;
	ss_line_13	= 0;
	ss_line_14	= 0;
	ss_line_15	= 0;
	ss_line_16	= 0;
	ss_line_17	= 0;
	ss_line_18	= 0;
	ss_line_19	= 0;
}

function SSTax_PutOutput() {
	putDebugOutput("SSTax-Debug01", ss_line_1,	"Line 1",	"SS benefits");
	putDebugOutput("SSTax-Debug02", ss_line_2,	"Line 2",	"Half of SS benefits");
	putDebugOutput("SSTax-Debug03", ss_line_3,	"Line 3",	"Total income minus taxable SS");
	putDebugOutput("SSTax-Debug04", ss_line_4,	"Line 4",	"Tax exempt interest");
	putDebugOutput("SSTax-Debug05", ss_line_5,	"Line 5",	"Not used");
	putDebugOutput("SSTax-Debug06", ss_line_6,	"Line 6",	"line 2 + line 3 + line 4 + line 5");
	putDebugOutput("SSTax-Debug07", ss_line_7,	"Line 7",	"Adjustments");
	putDebugOutput("SSTax-Debug08", ss_line_8,	"Line 8",	"SS income");
	putDebugOutput("SSTax-Debug09", ss_line_9,	"Line 9",	"Start of 50% taxable range");
	putDebugOutput("SSTax-Debug10", ss_line_10,	"Line 10",	"Amount above base of range");
	putDebugOutput("SSTax-Debug11", ss_line_11,	"Line 11",	"Length of 50% taxable range");
	putDebugOutput("SSTax-Debug12", ss_line_12,	"Line 12",	"Amount above top of range");
	putDebugOutput("SSTax-Debug13", ss_line_13,	"Line 13",	"Amount within range");
	putDebugOutput("SSTax-Debug14", ss_line_14,	"Line 14",	"50% of amount within range");
	putDebugOutput("SSTax-Debug15", ss_line_15,	"Line 15",	"At most 50% is taxable");
	putDebugOutput("SSTax-Debug16", ss_line_16,	"Line 16",	"85% of amount above range");
	putDebugOutput("SSTax-Debug17", ss_line_17,	"Line 17",	"Taxable amount");
	putDebugOutput("SSTax-Debug18", ss_line_18,	"Line 18",	"At most 85% is taxable");
	putDebugOutput("SSTax-Debug19", ss_line_19,	"Line 19",	"Taxable amount");
}
