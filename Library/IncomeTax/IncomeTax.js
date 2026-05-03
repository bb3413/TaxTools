
/*
 * Income Tax Calculation
 *
 * This is an implementation of the Qualified Dividends and Capital Gains Tax
 * Worksheet, used in TaxSlayer 2024.
 */

// Global variables
let tx_line_1	= 0;
let tx_line_2	= 0;
let tx_line_3	= 0;
let tx_line_4	= 0;
let tx_line_5	= 0;
let tx_line_6	= 0;
let tx_line_7	= 0;
let tx_line_8	= 0;
let tx_line_9	= 0;
let tx_line_10	= 0;
let tx_line_11	= 0;
let tx_line_12	= 0;
let tx_line_13	= 0;
let tx_line_14	= 0;
let tx_line_15	= 0;
let tx_line_16	= 0;
let tx_line_17	= 0;
let tx_line_18	= 0;
let tx_line_19	= 0;
let tx_line_20	= 0;
let tx_line_21	= 0;
let tx_line_22	= 0;
let tx_line_23	= 0;
let tx_line_24	= 0;
let tx_line_25	= 0;

function getIncomeTax(
	filing_status,
	taxable_income,
	qualified_dividends,
	capital_gains) {
	
	IncTax_ResetLines();

	tx_line_1	= taxable_income;						// 1040, line 15
	tx_line_2	= qualified_dividends;					// 1040, line 3a
	tx_line_3	= capital_gains;						// 1040, line 7
	tx_line_4	= tx_line_2 + tx_line_3;				// Total capital gains
	tx_line_5	= Max(tx_line_1 - tx_line_4, 0);		// Total ordinary income
	tx_line_6	= get_CapGains_15_Start(filing_status);	// Start of 15% CG bracket
	tx_line_7	= Min(tx_line_1, tx_line_6);
	tx_line_8	= Min(tx_line_5, tx_line_7);
	tx_line_9	= Max(tx_line_7 - tx_line_8, 0);		// Amount taxed at 0%
	tx_line_10	= Min(tx_line_1, tx_line_4);
	tx_line_11	= tx_line_9;
	tx_line_12	= Max(tx_line_10 - tx_line_11, 0);
	tx_line_13	= get_CapGains_20_Start(filing_status);	// Start of 20% CG bracket
	tx_line_14	= Min(tx_line_1, tx_line_13);
	tx_line_15	= tx_line_5 + tx_line_9;
	tx_line_16	= Max(tx_line_14 - tx_line_15, 0);
	tx_line_17	= Min(tx_line_12, tx_line_16);
	tx_line_18	= tx_line_17 * 0.15;					// 15%
	tx_line_19	= tx_line_9 + tx_line_17;
	tx_line_20	= Max(tx_line_10 - tx_line_19, 0);
	tx_line_21	= tx_line_20 * 0.20;					// 20%
	tx_line_22	= getIncomeTaxFromTable(filing_status, tx_line_5);	// Compute income tax on line_5
	tx_line_23	= tx_line_18 + tx_line_21 + tx_line_22;
	tx_line_24	= getIncomeTaxFromTable(filing_status, tx_line_1);	// Compute income tax on line_1
	tx_line_25	= Min(tx_line_23, tx_line_24);

	IncTax_PutOutput();
	return Round(tx_line_25);
}

function IncTax_ResetLines() {
	tx_line_1	= 0;
	tx_line_2	= 0;
	tx_line_3	= 0;
	tx_line_4	= 0;
	tx_line_5	= 0;
	tx_line_6	= 0;
	tx_line_7	= 0;
	tx_line_8	= 0;
	tx_line_9	= 0;
	tx_line_10	= 0;
	tx_line_11	= 0;
	tx_line_12	= 0;
	tx_line_13	= 0;
	tx_line_14	= 0;
	tx_line_15	= 0;
	tx_line_16	= 0;
	tx_line_17	= 0;
	tx_line_18	= 0;
	tx_line_19	= 0;
	tx_line_20	= 0;
	tx_line_21	= 0;
	tx_line_22	= 0;
	tx_line_23	= 0;
	tx_line_24	= 0;
	tx_line_25	= 0;
}

function IncTax_PutOutput() {
	putDebugOutput("IncTax-Debug01", tx_line_1,	"Line 1",	"1040, line 15 Taxable Income");
	putDebugOutput("IncTax-Debug02", tx_line_2,	"Line 2",	"1040, line 3a Qualified Dividends");
	putDebugOutput("IncTax-Debug03", tx_line_3,	"Line 3",	"1040, line 7 Capital Gains");
	putDebugOutput("IncTax-Debug04", tx_line_4,	"Line 4",	"Total capital gains");
	putDebugOutput("IncTax-Debug05", tx_line_5,	"Line 5",	"Total ordinary income");
	putDebugOutput("IncTax-Debug06", tx_line_6,	"Line 6",	"Start of 15% capital gains bracket");
	putDebugOutput("IncTax-Debug07", tx_line_7,	"Line 7",	"Min(line 1, line 6)");
	putDebugOutput("IncTax-Debug08", tx_line_8,	"Line 8",	"Min(line 5, line 7)");
	putDebugOutput("IncTax-Debug09", tx_line_9,	"Line 9",	"Amount taxed at 0%");
	putDebugOutput("IncTax-Debug10", tx_line_10,	"Line 10",	"Min(line 1, line 4)");
	putDebugOutput("IncTax-Debug11", tx_line_11,	"Line 11",	"line 9");
	putDebugOutput("IncTax-Debug12", tx_line_12,	"Line 12",	"line 10 - line 11");
	putDebugOutput("IncTax-Debug13", tx_line_13,	"Line 13",	"Start of 20% capital gains bracket");
	putDebugOutput("IncTax-Debug14", tx_line_14,	"Line 14",	"Min(line 1, line 13)");
	putDebugOutput("IncTax-Debug15", tx_line_15,	"Line 15",	"line 5 + line 9");
	putDebugOutput("IncTax-Debug16", tx_line_16,	"Line 16",	"line 14 - line 15");
	putDebugOutput("IncTax-Debug17", tx_line_17,	"Line 17",	"Min(line 12, line 16");
	putDebugOutput("IncTax-Debug18", tx_line_18,	"Line 18",	"15% of line 17");
	putDebugOutput("IncTax-Debug19", tx_line_19,	"Line 19",	"line 9 + line 17");
	putDebugOutput("IncTax-Debug20", tx_line_20,	"Line 20",	"line 10 - line 19");
	putDebugOutput("IncTax-Debug21", tx_line_21,	"Line 21",	"20% of line 20");
	putDebugOutput("IncTax-Debug22", tx_line_22,	"Line 22",	"Income tax for line 5");
	putDebugOutput("IncTax-Debug23", tx_line_23,	"Line 23",	"line 18 + line 21 + line 22");
	putDebugOutput("IncTax-Debug24", tx_line_24,	"Line 24",	"Compute income tax on line 1");
	putDebugOutput("IncTax-Debug25", tx_line_25,	"Line 25",	"Min(line 23, line 24)");
}