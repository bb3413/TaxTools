
// Tax Tables for the Tax Year 2025
//
// This file contain tax information that is specific to the tax year 2025. Symbolic
// names in this file begin with "TY25" so the names do not conflict with corresponding
// symbols used for other tax years.


//
// This table contains constant tax values.
//
const TY25_values = [
	// 	Name							Single		HoH			MFJ			QSS			MFS
	[ "BusinessMileage",				0.70,		0.70,		0.70,		0.70,		0.70		],
	[ "CharityMileage",					0.14,		0.14,		0.14,		0.14,		0.14		],
	[ "MedicalMileage",					0.21,		0.21,		0.21,		0.21,		0.21		],

	[ "MaxCapitalLoss",					-3000,		-3000,		-3000,		-3000,		-1500		],
	[ "MaxEducatorExpenses",			300,		300,		600,		300,		300			],
	[ "MaxTaxedSS",						176100,		176100,		176100,		176100,		176100		],
	[ "MaxSALT",						40000,		40000,		40000,		40000,		20000		],
	[ "MaxStudentLoanInterest",			2500,		2500,		2500,		2500,		0			],

	// OBBA Deductions
	[ "MaxCarLoanInterestDeduction",	99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxOvertimeDeduction",			99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxTipsDeduction",				99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxSeniorDeduction",				6000,		6000,		6000,		6000,		0			],

	// Non-refundable Credits
	[ "MaxAmericanOppCreditNoRefund",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxChildAndDependentCareCredit",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxChildTaxCredit",				99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxForeignTaxCredit",			300,		300,		600,		300,		300			],
	[ "MaxLifetimeLearningCredit",		2000,		2000,		2000,		2000,		0			],
	[ "MaxResidentialEnergyCredit",		99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxRetirementSavingsCredit",		1000,		1000,		2000,		1000,		1000		],

	// Refundable Credits
	[ "MaxAmericanOppCreditRefundable",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxCreditForOtherDependents",	99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxEarnedIncomeCredit",			61555,		61555,		68675,		61555,		0			],
	[ "MaxPremiumTaxCredit",			99999999,	99999999,	99999999,	99999999,	0			],
];

// Alternative Minimum Tax (AMT)
//
// This table only applies if AMT income is less than $626,350 ($1,252,700 for MFJ or QSS).
//
const TY25_amt_exemption = [ 
	//				Exemption	Phase Out
	[ "Single",		88100,		626350	],
	[ "HoH",		88100,		626350	],
	[ "MFJ",		137000,		1252700	],
	[ "QSS",		137000,		1252700	],
	[ "MFS",		68500,		626350	],
];

const TY25_amt_tax = [
	//				Start of	End of		Subtract	Rate
	//				Bracket		Bracket					Percent
	[ "Single",		0,			239100,		0,			26	],
	[ "Single",		239100,		99999999,	4782,		28	],

	[ "HoH",		0,			239100,		0,			26	],
	[ "HoH",		239100,		99999999,	4782,		28	],

	[ "MFJ",		0,			239100,		0,			26	],
	[ "MFJ",		239100,		99999999,	4782,		28	],

	[ "QSS",		0,			239100,		0,			26	],
	[ "QSS",		239100,		99999999,	4782,		28	],

	[ "MFS",		0,			119550,		0,			26	],
	[ "MFS",		119550,		99999999,	2391,		28	],
];

/* Capital Gains Table
 *
 * This table specifies the income at the start of the 15% and 20%
 * capital gains brackets.
 */
const TY25_capital_gains_table = [
	// Filing		Start		Start
	// Status		15%			20%
	[ "Single",		48350,		533400 ],
	[ "HoH",		64750,		566700 ],
	[ "MFJ",		96700,		600050 ],
	[ "QSS",		96700,		600050 ],
	[ "MFS",		48350,		300000 ],
];

/* Income Tax Table
 *
 * The income tax is computed by finding the bracket where the filing status
 * matches and the income is within the bracket. The tax is computed by
 * subtracting the start of the bracket from the income to determine the amount
 * of income within the bracket. Multiply that amount by the tax rate and add
 * the cumlative tax.
 *
 * The cumulative tax is the cumulative amount of tax from each of the previous
 * brackets.
 */
const TY25_income_tax_table = [
	// Filing		Start of	End of		Rate
	// Status		Bracket		Bracket		Percent
	[ "Single",		0,			11925,		10 ],
	[ "Single",		11925,		48475,		12 ],
	[ "Single",		48475,		103350,		22 ],
	[ "Single",		103350,		197300,		24 ],
	[ "Single",		197300,		250525,		32 ],
	[ "Single",		250525,		626350,		35 ],
	[ "Single",		626350,		99999999,	37 ],

	[ "HoH",		0,			17000,		10 ],
	[ "HoH",		17000,		64850,		12 ],
	[ "HoH",		64850,		103350,		22 ],
	[ "HoH",		103350,		197300,		24 ],
	[ "HoH",		197300,		250500,		32 ],
	[ "HoH",		250500,		626350,		35 ],
	[ "HoH",		626350,		99999999,	37 ],

	[ "MFJ",		0,			23850,		10 ],
	[ "MFJ",		23850,		96950,		12 ],
	[ "MFJ",		96950,		206700,		22 ],
	[ "MFJ",		206700,		394600,		24 ],
	[ "MFJ",		394600,		501050,		32 ],
	[ "MFJ",		501050,		751600,		35 ],
	[ "MFJ",		751600,		99999999,	37 ],

	[ "QSS",		0,			23850,		10 ],
	[ "QSS",		23850,		96950,		12 ],
	[ "QSS",		96950,		206700,		22 ],
	[ "QSS",		206700,		394600,		24 ],
	[ "QSS",		394600,		501050,		32 ],
	[ "QSS",		501050,		751600,		35 ],
	[ "QSS",		751600,		99999999,	37 ],

	[ "MFS",		0,			11925,		10 ],
	[ "MFS",		11925,		48475,		12 ],
	[ "MFS",		48475,		103350,		22 ],
	[ "MFS",		103350,		197300,		24 ],
	[ "MFS",		197300,		250525,		32 ],
	[ "MFS",		250525,		375800,		35 ],
	[ "MFS",		375800,		99999999,	37 ],
];

/* Long Term Care Premiums
 *
 * The amount of the deduction for long term care (LTC) insurance premiums
 * is limited by the age of the person.
 */
const TY25_ltc_table = [
	// 			Mximum
	// Age		Premium
	[	71,		6020	],
	[	61,		4810	],
	[	51,		1800	],
	[	41,		900		],
	[	0,		480		],
];

//
// Sales Tax Table
//
// This is the IRS table for determining the sales tax deduction for California.
//
// The informaton in this table comes from the instructions for schedule A at
// https://www.irs.gov/pub/irs-pdf/i1040sca.pdf.
//

const TY25_sales_tax_table = [
	//										Family Size
	// Income Range			1		2		3		4		5		>5
	[ 0,		20000,		412,	476,	519,	552,	580,	619		],
	[ 20000,	30000,		564,	650,	709,	754,	792,	845		],
	[ 30000,	40000,		637,	734,	801,	852,	895,	955		],
	[ 40000,	50000,		698,	805,	877,	934,	981,	1046	],
	[ 50000,	60000,		752,	866,	944,	1005,	1055,	1126	],
	[ 60000,	70000,		798,	921,	1003,	1067,	1121,	1196	],
	[ 70000,	80000,		841,	970,	1057,	1124,	1181,	1259	],
	[ 80000,	90000,		879,	1015,	1106,	1176,	1235,	1318	],
	[ 90000,	100000,		915,	1056,	1151,	1225,	1286,	1372	],
	[ 100000,	120000,		963,	1110,	1211,	1288,	1352,	1442	],
	[ 120000,	140000,		1023,	1180,	1286,	1368,	1437,	1532	],
	[ 140000,	160000,		1079,	1243,	1355,	1442,	1514,	1615	],
	[ 160000,	180000,		1128,	1301,	1418,	1508,	1584,	1690	],
	[ 180000,	200000,		1175,	1355,	1477,	1571,	1649,	1760	],
	[ 200000,	225000,		1223,	1410,	1537,	1635,	1716,	1831	],
	[ 225000,	250000,		1274,	1469,	1600,	1702,	1787,	1907	],
	[ 250000,	275000,		1320,	1522,	1659,	1765,	1853,	1977	],
	[ 275000,	300000,		1365,	1574,	1715,	1825,	1915,	2043	],
	[ 300000,	99999999,	1619,	1867,	2034,	2164,	2272,	2423	],
];

/* Social Security Table
 *
 * This table specifies the range of Social Security income that is
 * taxed at 50%. Below that range, it is not taxed. Above that range
 * is is taxed at 85%.
 */
const TY25_social_security_table = [
	// Filing		Base of		Length of	Top of
	// Status		Range		Range		Range
	[ "Single",		25000,		9000,		34000 ],
	[ "HoH",		25000,		9000,		34000 ],
	[ "MFJ",		32000,		12000,		44000 ],
	[ "QSS",		25000,		9000,		34000 ],
	[ "MFS",		25000,		9000,		34000 ],
];

/* Standard Deduction Table
 *
 * This table specifies the standard deduction for each filing status plus the
 * additional amount that is added if the taxpayer or spouse is 65 or blind.
 */
const TY25_std_deduction_table = [
	// Filing		Std			Blind or
	// Status		Deduction	65
	[ "Single",		15750,		2000 ],
	[ "HoH",		23625,		2000 ],
	[ "MFJ",		31500,		1600 ],
	[ "QSS",		31500,		1600 ],
	[ "MFS",		15750,		1600 ],
];

//-----------------------------------------------------------------------------
//
//			California Tax tables
//
//-----------------------------------------------------------------------------

const TT25_ca_personal_exemption	= 153;
const TT25_ca_dependent_exemption	= 475;

/* California Standard Deduction Table
 *
 * This table specifies the standard deduction for each filing status plus the
 * additional amount that is added if the taxpayer or spouse is 65 or blind.
 */
const TY25_ca_std_deduction_table = [
	// Filing		Standard
	// Status		Deduction
	[ "Single",		5706	],
	[ "HoH",		11412	],
	[ "MFJ",		11412	],
	[ "QSS",		11412	],
	[ "MFS",		5706	],
];

/* California Income Tax Table
 *
 * Single and MFS are the same. MFJ and QSS are the same.
 */
const TY25_ca_income_tax_table = [
	// Filing		Start of	End of		Rate
	// Status		Bracket		Bracket		Percent
	[ "Single",		0,			11079,		1.0		],
	[ "Single",		11079,		26264,		2.0		],
	[ "Single",		26264,		41452,		4.0		],
	[ "Single",		41452,		57542,		6.0		],
	[ "Single",		57542,		72724,		8.0		],
	[ "Single",		72724,		371479,		9.3		],
	[ "Single",		371479,		445771,		10.3	],
	[ "Single",		445771,		742953,		11.3	],
	[ "Single",		742953,		99999999,	12.3	],
	
	[ "HoH",		0,			22173,		.0		],
	[ "HoH",		22173,		52530,		2.0		],
	[ "HoH",		52530,		67716,		4.0		],
	[ "HoH",		67716,		83805,		6.0		],
	[ "HoH",		83805,		98990,		8.0		],
	[ "HoH",		98990,		505208,		9.3		],
	[ "HoH",		505208,		606251,		10.3	],
	[ "HoH",		606251,		1010417,	11.3	],
	[ "HoH",		1010417,	99999999,	12.3	],

	[ "MFJ",		0,			22158,		1.0		],
	[ "MFJ",		22158,		52528,		2.0		],
	[ "MFJ",		52528,		82904,		4.0		],
	[ "MFJ",		82904,		115084,		6.0		],
	[ "MFJ",		115084,		145448,		8.0		],
	[ "MFJ",		145448,		742958,		9.3		],
	[ "MFJ",		742958,		891542,		10.3	],
	[ "MFJ",		891542,		1485906,	11.3	],
	[ "MFJ",		1485906,	99999999,	12.3	],
];