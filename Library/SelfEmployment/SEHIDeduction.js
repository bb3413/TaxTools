
import { putDebugOutput }		from "../Debug.js";
import { min, max, round }		from "../Numbers.js";

/*
 * Self-employment Health Insirance Deduction
 *
 * This is an implementation of form 7206 worksheet (see TaxSlayer output).
 */

// Global variables
let sehi_line_1		= 0;
let sehi_line_2		= 0;
let sehi_line_3		= 0;
let sehi_line_4		= 0;
let sehi_line_5		= 0;
let sehi_line_6		= 0;
let sehi_line_7		= 0;
let sehi_line_8		= 0;
let sehi_line_9		= 0;
let sehi_line_10	= 0;
let sehi_line_11	= 0;
let sehi_line_12	= 0;
let sehi_line_13	= 0;
let sehi_line_14	= 0;

function getSEHIDeduction(
	health_insurance,
	ltc_insurance,		// Adjusted for age
	net_profit,
	setax_deduction,
	retirement_plan_contributions) {

	SEHI_ResetLines();
	
	if (net_profit === 0) {
		SEHI_PutOutput();
		return 0;
	}

	sehi_line_1		= health_insurance;
	sehi_line_2		= ltc_insurance;
	sehi_line_3		= sehi_line_1 + sehi_line_2;		// Total health insurance
	sehi_line_4		= net_profit;
	sehi_line_5		= net_profit;
	sehi_line_6		= sehi_line_4 / sehi_line_5;
	sehi_line_7		= setax_deduction * sehi_line_6;
	sehi_line_8		= sehi_line_4 - sehi_line_7;		// Net profit - SETax deduction
	sehi_line_9		= retirement_plan_contributions;	// Schedule 1, line 16
	sehi_line_10	= sehi_line_8 - sehi_line_9;		// Net profit - SETax deduction - retirement contribution
	sehi_line_11	= 0;								// Medicare wages from S-corp
	sehi_line_12	= 0;								// Foreign earned income exclusion, S1, line 8d
	sehi_line_13	= max(sehi_line_10, sehi_line_11) - sehi_line_12;
	sehi_line_14	= min(sehi_line_3, sehi_line_13);

	SEHI_PutOutput();
	return round(sehi_line_14);
}

function SEHI_ResetLines() {
	sehi_line_1		= 0;
	sehi_line_2		= 0;
	sehi_line_3		= 0;
	sehi_line_4		= 0;
	sehi_line_5		= 0;
	sehi_line_6		= 0;
	sehi_line_7		= 0;
	sehi_line_8		= 0;
	sehi_line_9		= 0;
	sehi_line_10	= 0;
	sehi_line_11	= 0;
	sehi_line_12	= 0;
	sehi_line_13	= 0;
	sehi_line_14	= 0;
}

function SEHI_PutOutput() {
	putDebugOutput("SEHI-Debug01", sehi_line_1,		"Line 1",	"Health insurance");
	putDebugOutput("SEHI-Debug02", sehi_line_2,		"Line 2",	"LTC insurance");
	putDebugOutput("SEHI-Debug03", sehi_line_3,		"Line 3",	"Total health insurance");
	putDebugOutput("SEHI-Debug04", sehi_line_4,		"Line 4",	"Net profit");
	putDebugOutput("SEHI-Debug05", sehi_line_5,		"Line 5",	"Net profit");
	putDebugOutput("SEHI-Debug06", sehi_line_6,		"Line 6",	"Line 4 / line 5");
	putDebugOutput("SEHI-Debug07", sehi_line_7,		"Line 7",	"SE tax_deduction * line 6");
	putDebugOutput("SEHI-Debug08", sehi_line_8,		"Line 8",	"Net profit - SETax deduction");
	putDebugOutput("SEHI-Debug09", sehi_line_9,		"Line 9",	"Retirement plan contributions");
	putDebugOutput("SEHI-Debug10", sehi_line_10,	"Line 10",	"Net profit - SETax deduction - retirement contributio");
	putDebugOutput("SEHI-Debug11", sehi_line_11,	"Line 11",	"Medicare wages from S-corp");
	putDebugOutput("SEHI-Debug12", sehi_line_12,	"Line 12",	"Foreign earned income exclusion, S1, line 8d");
	putDebugOutput("SEHI-Debug13", sehi_line_13,	"Line 13",	"max(line 10, line 11) - line 12");
	putDebugOutput("SEHI-Debug14", sehi_line_14,	"Line 14",	"min(line_3, line 13) = SEHI deduction");
}

export { getSEHIDeduction };
