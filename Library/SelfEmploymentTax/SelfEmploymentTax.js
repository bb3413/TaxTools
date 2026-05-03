
/*
 * Self-employment Tax Calculation
 *
 * This is an implementation of the Schedule SE worksheet.
 */

// Global variables
let se_line_1a	= 0;
let se_line_1b	= 0;
let se_line_2	= 0;
let se_line_3	= 0;
let se_line_4a	= 0;
let se_line_4b	= 0;
let se_line_4c	= 0;
let se_line_5a	= 0;
let se_line_5b	= 0;
let se_line_6	= 0;
let se_line_7	= 0;
let se_line_8a	= 0;
let se_line_8b	= 0;
let se_line_8c	= 0;
let se_line_8d	= 0;
let se_line_9	= 0;
let se_line_10	= 0;
let se_line_11	= 0;
let se_line_12	= 0;

function SE_Tax(
	profit_from_business,
	ss_wages) {		// Boxes 3 and 7 on W-2

	SETax_ResetLines();
	
	se_line_1a	= 0;								// Ignore - for use with farm income
	se_line_1b	= 0;								// Ignore - for use with farm income
	se_line_2	= profit_from_business;				// Net profit from business, from schedule C, line 31
	se_line_3	= se_line_1a + se_line_1b + se_line_2;	// Total self-imployment income
	se_line_4a	= (se_line_3 > 0) ? se_line_3 * .9235 : se_line_3;	// 92.35%
	se_line_4b = 0;									// Ignore
	se_line_4c = se_line_4a + se_line_4b;
	if (se_line_4c < 400) {
		SETax_PutOutput();
		return 0;										// No self-employment tax due
	}
	se_line_5a	= 0;								// Ignore - church employee income
	se_line_5b	= se_line_5a * .9235;				// 92.35%
	if (se_line_5b < 100) {
		se_line_5b = 0;
	}
	se_line_6	= se_line_4c + se_line_5b;
	se_line_7	= 176100;							// Maximum amount of wages subject to SS tax
	se_line_8a	= ss_wages;							// Boxes 3 and 7 on W-2
	se_line_8b	= 0;								// Unreported tips subject to ss tax
	se_line_8c	= 0;								// Wages subject to ss tax
	se_line_8d	= se_line_8a + se_line_8b + se_line_8c;// Total wages outside business subject to ss tax
	se_line_9	= se_line_7 - se_line_8d;
	se_line_10 = 0;
	if (se_line_9 <= 0) {
		se_line_10	= 0;
	} else {
		se_line_10 = Min(se_line_6, se_line_9) * 0.124;	// 12.4% Social Security tax
	}
	se_line_11	= se_line_6 * 0.029;					// 2.9% Medicatre tax
	se_line_12	= se_line_10 + se_line_11;			// Social Security tax + Medicare tax = Self-employment tax

	SETax_PutOutput();
	return Round(se_line_12);
}

function SETax_ResetLines() {
	se_line_1a	= 0;
	se_line_1b	= 0;
	se_line_2	= 0;
	se_line_3	= 0;
	se_line_4a	= 0;
	se_line_4b	= 0;
	se_line_4c	= 0;
	se_line_5a	= 0;
	se_line_5b	= 0;
	se_line_6	= 0;
	se_line_7	= 0;
	se_line_8a	= 0;
	se_line_8b	= 0;
	se_line_8c	= 0;
	se_line_8d	= 0;
	se_line_9	= 0;
	se_line_10	= 0;
	se_line_11	= 0;
	se_line_12	= 0;
}

function SETax_PutOutput() {
	putDebugOutput("SETax-Debug01", se_line_1a,	"Line 1a",	"Ignore - for use with farm income");
	putDebugOutput("SETax-Debug02", se_line_1b,	"Line 1b",	"Ignore - for use with farm income");
	putDebugOutput("SETax-Debug03", se_line_2,	"Line 2",	"Net profit from business, from schedule C, line 31");
	putDebugOutput("SETax-Debug04", se_line_3,	"Line 3",	"Total self-imployment income");
	putDebugOutput("SETax-Debug05", se_line_4a,	"Line 4a",	"92.35% of line 3");
	putDebugOutput("SETax-Debug06", se_line_4b,	"Line 4b",	"Not used");
	putDebugOutput("SETax-Debug07", se_line_4c,	"Line 4c",	"line 4a + line 4b");
	putDebugOutput("SETax-Debug08", se_line_5a,	"Line 5a",	"Ignore - church employee income");
	putDebugOutput("SETax-Debug09", se_line_5b,	"Line 5b",	"92.35% of line 5a");
	putDebugOutput("SETax-Debug10", se_line_6,	"Line 6",	"line 4c + line 5b");
	putDebugOutput("SETax-Debug11", se_line_7,	"Line 7",	"176,100 - Maximum amount of wages subject to SS tax");
	putDebugOutput("SETax-Debug12", se_line_8a,	"Line 8a",	"Social Security wages - Boxes 3 and 7 on W-2");
	putDebugOutput("SETax-Debug13", se_line_8b,	"Line 8b",	"Unreported tips subject to Social Security tax");
	putDebugOutput("SETax-Debug14", se_line_8c,	"Line 8c",	"Wages subject to Social Security tax");
	putDebugOutput("SETax-Debug15", se_line_8d,	"Line 8d",	"Total wages outside business subject to Social Security tax");
	putDebugOutput("SETax-Debug16", se_line_9,	"Line 9",	"line 7 - line 8d");
	putDebugOutput("SETax-Debug17", se_line_10,	"Line 10",	"12.4% of Min(line 6, line 9) - Social Security tax");
	putDebugOutput("SETax-Debug18", se_line_11,	"Line 11",	"2.9% of line 6 - Medicatre tax");
	putDebugOutput("SETax-Debug19", se_line_12,	"Line 12",	"Social Security tax + Medicare tax = Self-employment tax");
}