
//
// Tax Tables for the Tax Year 2024
//
// This file contain tax information that is specific to the tax year 2024. Symbolic
// names in this file begin with "TY24" so the names do not conflict with corresponding
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
const TY24_values = [
	// 	Name							Single		HoH			MFJ			QSS			MFS
	[ "BusinessMileage",				0.67,		0.67,		0.67,		0.67,		0.67		],
	[ "CharityMileage",					0.14,		0.14,		0.14,		0.14,		0.14		],
	[ "MedicalMileage",					0.21,		0.21,		0.21,		0.21,		0.21		],

	[ "MaxCapitalLoss",					-3000,		-3000,		-3000,		-3000,		-1500		],
	[ "MaxEducatorExpenses",			300,		300,		600,		300,		300			],
	[ "MaxTaxedSS",						176100,		176100,		176100,		176100,		176100		],
	[ "MaxSALT",						10000,		10000,		10000,		10000,		10000		],
	[ "MaxStudentLoanInterest",			2500,		2500,		2500,		2500,		0			],

	// OBBA deductions
	[ "MaxCarLoanInterestDeduction",	0,			0,			0,			0,			0			],
	[ "MaxOvertimeDeduction",			0,			0,			0,			0,			0			],
	[ "MaxTipsDeduction",				0,			0,			0,			0,			0			],
	[ "MaxSeniorDeduction",				0,			0,			0,			0,			0			],
	[ "SeniorDeductionPhaseOut",		0,			0,			0,			0,			0			],

	// Non-refundable credits
	[ "MaxAmericanOppCreditNoRefund",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxChildAndDependentCareCredit",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxChildTaxCredit",				99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxForeignTaxCredit",			300,		300,		600,		300,		300			],
	[ "MaxLifetimeLearningCredit",		2000,		2000,		2000,		2000,		0			],
	[ "MaxResidentialEnergyCredit",		99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxRetirementSavingsCredit",		1000,		1000,		2000,		1000,		1000		],

	// Refundable credits
	[ "MaxAmericanOppCreditRefundable",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxCreditForOtherDependents",	99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxEarnedIncomeCredit",			59899,		59899,		66819,		59899,		0			],
	[ "MaxPremiumTaxCredit",			99999999,	99999999,	99999999,	99999999,	0			],

	// AMT
	[ "AMT_Exemption",					85700,		85700,		133500,		133500,		66650		],
	[ "AMT_ExemptionPhaseOut",			609350,		609350,		1218700,	1218700,	609350		],

	// Capital gains ranges
	[ "CG_15PercentRangeStart",			47025,		63000,		94050,		94050,		47025		],
	[ "CG_20PercentRangestart",			518900,		551350,		583750,		583750,		291850		],
	
	// Social Security 50% taxable range
	[ "SS_50PercentRangeStart",			25000,		25000,		32000,		25000,		25000		],
	[ "SS_50PercentRangeEnd",			34000,		34000,		44000,		34000,		34000		],
	[ "SS_50PercentRangeLength",		9000,		9000,		12000,		9000,		9000		],

	// Standard deduction and extra for 65 or blind
	[ "StandardDeduction",				14600,		21900,		29200,		29200,		14600		],
	[ "StandardDeductionExtra",			1950,		1950,		1550,		1550,		1550		],

	// California constants
	[ "CA_PersonalExemption",			149,		149,		149,		149,		149			],
	[ "CA_DependentExemption",			447,		447,		447,		447,		447			],
	[ "CA_StandardDeduction",			5540,		11080,		11080,		11080,		5540		],
	[ "CA_BaseSalesTax",				7.25,		7.25,		7.25,		7.25,		7.25		],
];

//
// Alternative Minimum Tax (AMT)
//
const TY24_amt_tax = [
	//				Start of	End of		Subtract	Rate
	//				Bracket		Bracket					Percent
	[ "Single",		0,			232600,		0,			26	],
	[ "Single",		239100,		99999999,	4782,		28	],

	[ "HoH",		0,			232600,		0,			26	],
	[ "HoH",		239100,		99999999,	4782,		28	],

	[ "MFJ",		0,			232600,		0,			26	],
	[ "MFJ",		232600,		99999999,	4782,		28	],

	[ "QSS",		0,			232600,		0,			26	],
	[ "QSS",		232600,		99999999,	4782,		28	],

	[ "MFS",		0,			116300,		0,			26	],
	[ "MFS",		119550,		99999999,	2391,		28	],
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
const TY24_income_tax_table = [
	// Filing		Start of	End of		Rate
	// Status		Bracket		Bracket		Percent
	[ "Single",		0,			11600,		10 ],
	[ "Single",		11600,		47150,		12 ],
	[ "Single",		47150,		100525,		22 ],
	[ "Single",		100525,		191950,		24 ],
	[ "Single",		191950,		243725,		32 ],
	[ "Single",		243725,		609350,		35 ],
	[ "Single",		609350,		99999999,	37 ],

	[ "HoH",		0,			16550,		10 ],
	[ "HoH",		16550,		63100,		12 ],
	[ "HoH",		63100,		100500,		22 ],
	[ "HoH",		100500,		191950,		24 ],
	[ "HoH",		191950,		243725,		32 ],
	[ "HoH",		243725,		609350,		35 ],
	[ "HoH",		609350,		99999999,	37 ],

	[ "MFJ",		0,			23200,		10 ],
	[ "MFJ",		23200,		94300,		12 ],
	[ "MFJ",		94300,		201050,		22 ],
	[ "MFJ",		201050,		383900,		24 ],
	[ "MFJ",		383900,		487450,		32 ],
	[ "MFJ",		487450,		731200,		35 ],
	[ "MFJ",		731200,		99999999,	37 ],
	
	[ "QSS",		0,			23200,		10 ],
	[ "QSS",		23200,		94300,		12 ],
	[ "QSS",		94300,		201050,		22 ],
	[ "QSS",		201050,		383900,		24 ],
	[ "QSS",		383900,		487450,		32 ],
	[ "QSS",		487450,		731200,		35 ],
	[ "QSS",		731200,		99999999,	37 ],

	[ "MFS",		0,			11600,		10 ],
	[ "MFS",		11600,		47150,		12 ],
	[ "MFS",		47150,		100525,		22 ],
	[ "MFS",		100525,		191950,		24 ],
	[ "MFS",		191950,		243725,		32 ],
	[ "MFS",		243725,		365600,		35 ],
	[ "MFS",		365600,		99999999,	37 ],
];

//
// Long Term Care Premiums
//
// The amount of the deduction for long term care (LTC) insurance premiums
// is limited by the age of the person.
//
const TY24_ltc_table = [
	// 			Mximum
	// Age		Premium
	[	71,		5880	],
	[	61,		4710	],
	[	51,		1760	],
	[	41,		880		],
	[	0,		470		],
];

//
// Sales Tax Table
//
// This is the IRS table for determining the sales tax deduction for California.
//
// The informaton in this table comes from the instructions for schedule A at
// https://www.irs.gov/pub/irs-pdf/i1040sca.pdf.
//
const TY24_sales_tax_table = [
	//										Family Size
	// Income Range			1		2		3		4		5		>5
	[ 0,		20000,		406,	469,	511,	544,	571,	610		],
	[ 20000,	30000,		555,	640,	698,	742,	780,	832		],
	[ 30000,	40000,		627,	723,	789,	839,	881,	940		],
	[ 40000,	50000,		687,	793,	864,	920,	966,	1030	],
	[ 50000,	60000,		740,	853,	930,	990,	1039,	1109	],
	[ 60000,	70000,		786,	907,	988,	1051,	1104,	1178	],
	[ 70000,	80000,		828,	955,	1041,	1107,	1163,	1240	],
	[ 80000,	90000,		866,	999,	1089,	1158,	1216,	1298	],
	[ 90000,	100000,		901,	1040,	1133,	1206,	1266,	1351	],
	[ 100000,	120000,		948,	1093,	1192,	1268,	1331,	1420	],
	[ 120000,	140000,		1007,	1162,	1266,	1347,	1415,	1509	],
	[ 140000,	160000,		1062,	1224,	1334,	1420,	1491,	1590	],
	[ 160000,	180000,		1111,	1281,	1396,	1485,	1560,	1664	],
	[ 180000,	200000,		1157,	1334,	1454,	1547,	1624,	1733	],
	[ 200000,	225000,		1204,	1388,	1513,	1610,	1690,	1803	],
	[ 225000,	250000,		1254,	1446,	1575,	1676,	1760,	1878	],
	[ 250000,	275000,		1300,	1499,	1634,	1738,	1825,	1947	],
	[ 300000,	99999999,	1594,	1838,	2003,	2131,	2237,	2386	],
];

//
// California Income Tax Table
//
// Single and MFS are the same. MFJ and QSS are the same.
//
const TY24_ca_income_tax_table = [
	// Filing		Start of	End of		Rate
	// Status		Bracket		Bracket		Percent
	[ "Single",		0,			10756,		1		],
	[ "Single",		10756,		25499,		2		],
	[ "Single",		25499,		40245,		4		],
	[ "Single",		40245,		55866,		6		],
	[ "Single",		55866,		70606,		8		],
	[ "Single",		70606,		360659,		9.3		],
	[ "Single",		360659,		432787,		10.3	],
	[ "Single",		432787,		721314,		11.3	],
	[ "Single",		721314,		99999999,	12.3	],
		
	[ "HoH",		0,			21527,		1		],
	[ "HoH",		21527,		51000,		2		],
	[ "HoH",		51000,		65744,		4		],
	[ "HoH",		65744,		81364,		6		],
	[ "HoH",		81364,		96107,		8		],
	[ "HoH",		96107,		490493,		9.3		],
	[ "HoH",		490493,		588593,		10.3	],
	[ "HoH",		588593,		980987,		11.3	],
	[ "HoH",		980987,		99999999,	12.3	],
	
	[ "MFJ",		0,			21512,		1		],
	[ "MFJ",		21512,		50998,		2		],
	[ "MFJ",		50998,		80490,		4		],
	[ "MFJ",		80490,		111732,		6		],
	[ "MFJ",		111732,		141212,		8		],
	[ "MFJ",		141212,		721318,		9.3		],
	[ "MFJ",		721318,		865574,		10.3	],
	[ "MFJ",		865574,		1442628,	11.3	],
	[ "MFJ",		1442628,	99999999,	12.3	],
];
