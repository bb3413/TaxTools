
//
// Tax Tables for the Tax Year 2026
//
// This file contain tax information that is specific to the tax year 2026. Symbolic
// names in this file begin with "TY26" so the names do not conflict with corresponding
// symbols used for other tax years.
//
// This file contains the following tax tables. They are listed in the order they are
// declared in this file:
//
//	TYxx_values					Table of miscellaneous constant values
//	TYxx_amt_tax				AMT tax brackets
//	TYxx_income_tax_table		Income tax brackets
//	TYxx_ltc_table				LTCinsurance deduction amounts
//	TYxx_sales_tax_table		Sales tax deduction amounts
//	TYxx_ca_income_tax_table	California income tax brackets
//

//
// This table contains constant tax values.
//
const TY26_values = [
	// 	Name							Single		HoH			MFJ			QSS			MFS
	[ "BusinessMileage",				0.70,		0.70,		0.70,		0.70,		0.70		],		// TY25
	[ "CharityMileage",					0.14,		0.14,		0.14,		0.14,		0.14		],		// TY25
	[ "MedicalMileage",					0.21,		0.21,		0.21,		0.21,		0.21		],		// TY25

	[ "MaxCapitalLoss",					-3000,		-3000,		-3000,		-3000,		-1500		],		// TY25
	[ "MaxEducatorExpenses",			300,		300,		600,		300,		300			],		// TY25
	[ "MaxTaxedSS",						176100,		176100,		176100,		176100,		176100		],		// TY25
	[ "MaxSALT",						40000,		40000,		40000,		40000,		20000		],		// TY25
	[ "MaxStudentLoanInterest",			2500,		2500,		2500,		2500,		0			],		// TY25

	// OBBA deductions
	[ "MaxCarLoanInterestDeduction",	99999999,	99999999,	99999999,	99999999,	99999999	],		// TY25
	[ "MaxOvertimeDeduction",			99999999,	99999999,	99999999,	99999999,	0			],		// TY25
	[ "MaxTipsDeduction",				99999999,	99999999,	99999999,	99999999,	0			],		// TY25
	[ "MaxSeniorDeduction",				6000,		6000,		6000,		6000,		0			],		// TY25
	[ "SeniorDeductionPhaseOut",		75000,		75000,		150000,		75000,		75000		],		// TY25

	// Non-refundable credits
	[ "MaxAmericanOppCreditNoRefund",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxChildAndDependentCareCredit",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxChildTaxCredit",				99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxForeignTaxCredit",			300,		300,		600,		300,		300			],		// TY25
	[ "MaxLifetimeLearningCredit",		2000,		2000,		2000,		2000,		0			],		// TY25
	[ "MaxResidentialEnergyCredit",		99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxRetirementSavingsCredit",		1000,		1000,		2000,		1000,		1000		],		// TY25

	// Refundable credits
	[ "MaxAmericanOppCreditRefundable",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxCreditForOtherDependents",	99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxEarnedIncomeCredit",			61555,		61555,		68675,		61555,		0			],		// TY25
	[ "MaxPremiumTaxCredit",			99999999,	99999999,	99999999,	99999999,	0			],

	// AMT
	[ "AMT_Exemption",					90100,		90100,		140200,		140200,		70100		],
	[ "AMT_ExemptionPhaseOut",			500000,		500000,		1000000,	1000000,	500000		],

	// Capital gains ranges
	[ "CG_15PercentRangeStart",			49450,		66200,		98900,		98900,		49450		],
	[ "CG_20PercentRangestart",			545500,		579600,		613700,		613700,		306850		],
	
	// Social Security 50% taxable range
	[ "SS_50PercentRangeStart",			25000,		25000,		32000,		25000,		25000		],		// TY25
	[ "SS_50PercentRangeEnd",			34000,		34000,		44000,		34000,		34000		],		// TY25
	[ "SS_50PercentRangeLength",		9000,		9000,		12000,		9000,		9000		],		// TY25

	// Standard deduction and extra for 65 or blind
	[ "StandardDeduction",				16100,		24150,		32200,		32200,		16100		],
	[ "StandardDeductionExtra",			2050,		2050,		1650,		1650,		1650		],

	// California constants
	[ "CA_PersonalExemption",			153,		153,		153,		153,		153			],		// TY25
	[ "CA_DependentExemption",			475,		475,		475,		475,		475			],		// TY25
	[ "CA_StandardDeduction",			5706,		11412,		11412,		11412,		5706		],		// TY25
	[ "CA_BaseSalesTax",				7.25,		7.25,		7.25,		7.25,		7.25		],		// TY25
];

//
// Alternative Minimum Tax (AMT)
//
const TY26_amt_tax = [
	//				Start of	End of		Subtract	Rate
	//				Bracket		Bracket					Percent
	[ "Single",		0,			239100,		0,			26	],		// TY25
	[ "Single",		239100,		99999999,	4782,		28	],		// TY25

	[ "HoH",		0,			239100,		0,			26	],		// TY25
	[ "HoH",		239100,		99999999,	4782,		28	],		// TY25

	[ "MFJ",		0,			239100,		0,			26	],		// TY25
	[ "MFJ",		239100,		99999999,	4782,		28	],		// TY25

	[ "QSS",		0,			239100,		0,			26	],		// TY25
	[ "QSS",		239100,		99999999,	4782,		28	],		// TY25

	[ "MFS",		0,			119550,		0,			26	],		// TY25
	[ "MFS",		119550,		99999999,	2391,		28	],		// TY25
];

//
// Income Tax Table
//
// The income tax is computed by finding the bracket where the filing status
// matches and the income is within the bracket. The tax is computed by
// subtracting the start of the bracket from the income to determine the amount
// of income within the bracket. Multiply that amount by the tax rate and add
// the cumlative tax.
//
// The cumulative tax is the cumulative amount of tax from each of the previous
// brackets.
//
const TY26_income_tax_table = [
	// Filing		Start of	End of		Rate
	// Status		Bracket		Bracket		Percent
	[ "Single",		0,			12400,		10 ],
	[ "Single",		12400,		50400,		12 ],
	[ "Single",		50400,		105700,		22 ],
	[ "Single",		105700,		201775,		24 ],
	[ "Single",		201775,		256225,		32 ],
	[ "Single",		256225,		640600,		35 ],
	[ "Single",		640600,		99999999,	37 ],

	[ "HoH",		0,			17700,		10 ],
	[ "HoH",		17700,		67450,		12 ],
	[ "HoH",		67450,		105700,		22 ],
	[ "HoH",		105700,		201775,		24 ],
	[ "HoH",		201775,		256200,		32 ],
	[ "HoH",		256200,		640600,		35 ],
	[ "HoH",		640600,		99999999,	37 ],

	[ "MFJ",		0,			24800,		10 ],
	[ "MFJ",		24800,		100800,		12 ],
	[ "MFJ",		100800,		211400,		22 ],
	[ "MFJ",		211400,		403550,		24 ],
	[ "MFJ",		403550,		512450,		32 ],
	[ "MFJ",		512450,		768700,		35 ],
	[ "MFJ",		768700,		99999999,	37 ],

	[ "QSS",		0,			24800,		10 ],
	[ "QSS",		24800,		100800,		12 ],
	[ "QSS",		100800,		211400,		22 ],
	[ "QSS",		211400,		403550,		24 ],
	[ "QSS",		403550,		512450,		32 ],
	[ "QSS",		512450,		768700,		35 ],
	[ "QSS",		768700,		99999999,	37 ],

	[ "MFS",		0,			12400,		10 ],
	[ "MFS",		12400,		50400,		12 ],
	[ "MFS",		50400,		105700,		22 ],
	[ "MFS",		105700,		201775,		24 ],
	[ "MFS",		201775,		256225,		32 ],
	[ "MFS",		256225,		384350,		35 ],
	[ "MFS",		384350,		99999999,	37 ],
];

//
// Long Term Care Premiums
//
// The amount of the deduction for long term care (LTC) insurance premiums
// is limited by the age of the person.
//
const TY26_ltc_table = [
	// 			Mximum
	// Age		Premium
	[	71,		6020	],		// TY25
	[	61,		4810	],		// TY25
	[	51,		1800	],		// TY25
	[	41,		900		],		// TY25
	[	0,		480		],		// TY25
];

//
// Sales Tax Table
//
// This is the IRS table for determining the sales tax deduction for California.
//
// The informaton in this table comes from the instructions for schedule A at
// https://www.irs.gov/pub/irs-pdf/i1040sca.pdf.
//
const TY26_sales_tax_table = [
	//										Family Size
	// Income Range			1		2		3		4		5		>5
	[ 0,		20000,		412,	476,	519,	552,	580,	619		],		// TY25
	[ 20000,	30000,		564,	650,	709,	754,	792,	845		],		// TY25
	[ 30000,	40000,		637,	734,	801,	852,	895,	955		],		// TY25
	[ 40000,	50000,		698,	805,	877,	934,	981,	1046	],		// TY25
	[ 50000,	60000,		752,	866,	944,	1005,	1055,	1126	],		// TY25
	[ 60000,	70000,		798,	921,	1003,	1067,	1121,	1196	],		// TY25
	[ 70000,	80000,		841,	970,	1057,	1124,	1181,	1259	],		// TY25
	[ 80000,	90000,		879,	1015,	1106,	1176,	1235,	1318	],		// TY25
	[ 90000,	100000,		915,	1056,	1151,	1225,	1286,	1372	],		// TY25
	[ 100000,	120000,		963,	1110,	1211,	1288,	1352,	1442	],		// TY25
	[ 120000,	140000,		1023,	1180,	1286,	1368,	1437,	1532	],		// TY25
	[ 140000,	160000,		1079,	1243,	1355,	1442,	1514,	1615	],		// TY25
	[ 160000,	180000,		1128,	1301,	1418,	1508,	1584,	1690	],		// TY25
	[ 180000,	200000,		1175,	1355,	1477,	1571,	1649,	1760	],		// TY25
	[ 200000,	225000,		1223,	1410,	1537,	1635,	1716,	1831	],		// TY25
	[ 225000,	250000,		1274,	1469,	1600,	1702,	1787,	1907	],		// TY25
	[ 250000,	275000,		1320,	1522,	1659,	1765,	1853,	1977	],		// TY25
	[ 275000,	300000,		1365,	1574,	1715,	1825,	1915,	2043	],		// TY25
	[ 300000,	99999999,	1619,	1867,	2034,	2164,	2272,	2423	],		// TY25
];

//
// California Income Tax Table
//
// Single and MFS are the same. MFJ and QSS are the same.
//
const TY26_ca_income_tax_table = [
	// Filing		Start of	End of		Rate
	// Status		Bracket		Bracket		Percent
	[ "Single",		0,			11079,		1.0		],		// TY25
	[ "Single",		11079,		26264,		2.0		],		// TY25
	[ "Single",		26264,		41452,		4.0		],		// TY25
	[ "Single",		41452,		57542,		6.0		],		// TY25
	[ "Single",		57542,		72724,		8.0		],		// TY25
	[ "Single",		72724,		371479,		9.3		],		// TY25
	[ "Single",		371479,		445771,		10.3	],		// TY25
	[ "Single",		445771,		742953,		11.3	],		// TY25
	[ "Single",		742953,		99999999,	12.3	],		// TY25
	
	[ "HoH",		0,			22173,		.0		],		// TY25
	[ "HoH",		22173,		52530,		2.0		],		// TY25
	[ "HoH",		52530,		67716,		4.0		],		// TY25
	[ "HoH",		67716,		83805,		6.0		],		// TY25
	[ "HoH",		83805,		98990,		8.0		],		// TY25
	[ "HoH",		98990,		505208,		9.3		],		// TY25
	[ "HoH",		505208,		606251,		10.3	],		// TY25
	[ "HoH",		606251,		1010417,	11.3	],		// TY25
	[ "HoH",		1010417,	99999999,	12.3	],		// TY25

	[ "MFJ",		0,			22158,		1.0		],		// TY25
	[ "MFJ",		22158,		52528,		2.0		],		// TY25
	[ "MFJ",		52528,		82904,		4.0		],		// TY25
	[ "MFJ",		82904,		115084,		6.0		],		// TY25
	[ "MFJ",		115084,		145448,		8.0		],		// TY25
	[ "MFJ",		145448,		742958,		9.3		],		// TY25
	[ "MFJ",		742958,		891542,		10.3	],		// TY25
	[ "MFJ",		891542,		1485906,	11.3	],		// TY25
	[ "MFJ",		1485906,	99999999,	12.3	],		// TY25
];
