

// Tax Tables for the Tax Year 2024
//
// This file contain tax information that is specific to the tax year 2024. Symbolic
// names in this file begin with "TY24" so the names do not conflict with corresponding
// symbols used for other tax years.

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
	
	// OBBA
	[ "MaxCarLoanInterestDeduction",	0,			0,			0,			0,			0			],
	[ "MaxOvertimeDeduction",			0,			0,			0,			0,			0			],
	[ "MaxTipsDeduction",				0,			0,			0,			0,			0			],
	[ "MaxSeniorDeduction",				0,			0,			0,			0,			0			],

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
	[ "MaxEarnedIncomeCredit",			59899,		59899,		66819,		59899,		0			],
	[ "MaxPremiumTaxCredit",			99999999,	99999999,	99999999,	99999999,	0			],
];

// Alternative Minimum Tax (AMT)
//
const TY24_amt_exemption = [ 
	//				Exemption	Phase Out
	[ "Single",		85700,		609350	],
	[ "HoH",		85700,		609350	],
	[ "MFJ",		133300,		1218700	],
	[ "QSS",		133300,		1218700	],
	[ "MFS",		66650,		609350	],
];

// The subtraction field is from 2025.
const TY24_amt_tax = [
	//				Start of	End of		Subtract	Rate
	//				Bracket		Bracket					Percent
	[ "Single",		0,			232600,		0,			26	],
	[ "Single",		239100,		99999999,	4782,		28	],

	[ "HoH",		0,			232600,		0,			26	],
	[ "HoH",		239100,		99999999,	4782,		28	],

	[ "MFJ",		0,			232600,		0,			26	],
	[ "MFJ",		239100,		99999999,	4782,		28	],

	[ "QSS",		0,			232600,		0,			26	],
	[ "QSS",		239100,		99999999,	4782,		28	],

	[ "MFS",		0,			116300,		0,			26	],
	[ "MFS",		119550,		99999999,	2391,		28	],
];

/* Capital Gains Table
 *
 * This table specifies the income at the start of the 15% and 20%
 * capital gains brackets.
 */
const TY24_capital_gains_table = [
	// Filing		Start		Start
	// Status		15%			20%
	[ "Single",		47025,		518900 ],
	[ "HoH",		63000,		551350 ],
	[ "MFJ",		94050,		583750 ],
	[ "QSS",		94050,		583750 ],
	[ "MFS",		47025,		291850 ],
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

/* Long Term Care Premiums
 *
 * The amount of the deduction for long term care (LTC) insurance premiums
 * is limited by the age of the person.
 */
const TY24_ltc_table = [
	// 			Mximum
	// Age		Premium
	[	71,		5880	],
	[	61,		4710	],
	[	51,		1760	],
	[	41,		880		],
	[	0,		470		],
];

/* Social Security Table
 *
 * This table specifies the range of Social Security income that is
 * taxed at 50%. Below that range, it is not taxed. Above that range
 * is is taxed at 85%.
 */
const TY24_social_security_table = [
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
const TY24_std_deduction_table = [
	// Filing		Standard	Blind or
	// Status		Deduction	65
	[ "Single",		14600,		1950 ],
	[ "HoH",		21900,		1950 ],
	[ "MFJ",		29200,		1550 ],
	[ "QSS",		29200,		1550 ],
	[ "MFS",		14600,		1550 ],
];

//-----------------------------------------------------------------------------
//
//			California Tax tables
//
//-----------------------------------------------------------------------------

const TT24_ca_personal_exemption	= 149;
const TT24_ca_dependent_exemption	= 447;

/* California Standard Deduction Table
 *
 * This table specifies the standard deduction for each filing status plus the
 * additional amount that is added if the taxpayer or spouse is 65 or blind.
 */
const TY24_ca_std_deduction_table = [
	// Filing		Standard
	// Status		Deduction
	[ "Single",		5540	],
	[ "HoH",		11080	],
	[ "MFJ",		11080	],
	[ "QSS",		11080	],
	[ "MFS",		5540	],
];

/* California Income Tax Table
 *
 * Single and MFS are the same. MFJ and QSS are the same.
 */
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