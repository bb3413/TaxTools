
// Tax Tables for the Tax Year 2026
//
// This file contain tax information that is specific to the tax year 2026. Symbolic
// names in this file begin with "TY26" so the names do not conflict with corresponding
// symbols used for other tax years.

//
// This table contains constant tax values.
//
const TY26_values = [
	// 	Name							Single		HoH			MFJ			QSS			MFS
	[ "BusinessMileage",				0.70,		0.70,		0.70,		0.70,		0.70		],		// 2025
	[ "CharityMileage",					0.14,		0.14,		0.14,		0.14,		0.14		],		// 2025
	[ "MedicalMileage",					0.21,		0.21,		0.21,		0.21,		0.21		],		// 2025

	[ "MaxCapitalLoss",					-3000,		-3000,		-3000,		-3000,		-1500		],		// 2025
	[ "MaxEducatorExpenses",			300,		300,		600,		300,		300			],		// 2025
	[ "MaxTaxedSS",						176100,		176100,		176100,		176100,		176100		],		// 2025
	[ "MaxSALT",						40000,		40000,		40000,		40000,		20000		],		// 2025
	[ "MaxStudentLoanInterest",			2500,		2500,		2500,		2500,		0			],		// 2025

	// OBBA Deductions
	[ "MaxCarLoanInterestDeduction",	99999999,	99999999,	99999999,	99999999,	99999999	],		// 2025
	[ "MaxOvertimeDeduction",			99999999,	99999999,	99999999,	99999999,	0			],		// 2025
	[ "MaxTipsDeduction",				99999999,	99999999,	99999999,	99999999,	0			],		// 2025
	[ "MaxSeniorDeduction",				6000,		6000,		6000,		6000,		0			],		// 2025

	// Non-refundable Credits
	[ "MaxAmericanOppCreditNoRefund",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxChildAndDependentCareCredit",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxChildTaxCredit",				99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxForeignTaxCredit",			300,		300,		600,		300,		300			],		// 2025
	[ "MaxLifetimeLearningCredit",		2000,		2000,		2000,		2000,		0			],		// 2025
	[ "MaxResidentialEnergyCredit",		99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxRetirementSavingsCredit",		1000,		1000,		2000,		1000,		1000		],		// 2025

	// Refundable Credits
	[ "MaxAmericanOppCreditRefundable",	99999999,	99999999,	99999999,	99999999,	0			],
	[ "MaxCreditForOtherDependents",	99999999,	99999999,	99999999,	99999999,	99999999	],
	[ "MaxEarnedIncomeCredit",			61555,		61555,		68675,		61555,		0			],		// 2025
	[ "MaxPremiumTaxCredit",			99999999,	99999999,	99999999,	99999999,	0			],
];

// Alternative Minimum Tax (AMT)
//
// This table only applies if AMT income is less than $626,350 ($1,252,700 for MFJ or QSS).
//
const TY26_amt_exemption = [ 
	//				Exemption	Phase Out
	[ "Single",		90100,		500000	],
	[ "HoH",		90100,		500000	],
	[ "MFJ",		140200,		1000000	],
	[ "QSS",		140200,		1000000	],
	[ "MFS",		70100,		500000	],
];

const TY26_amt_tax = [																// 2025
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
const TY26_capital_gains_table = [
	// Filing		Start		Start
	// Status		15%			20%
	[ "Single",		49450,		545500 ],
	[ "HoH",		66200,		579600 ],
	[ "MFJ",		98900,		613700 ],
	[ "QSS",		98900,		613700 ],
	[ "MFS",		49450,		306850 ],
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
const TY26_income_tax_table = [
	// Filing		Start of	End of		Rate
	// Status		Bracket		Bracket			Percent
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

/* Long Term Care Premiums
 *
 * The amount of the deduction for long term care (LTC) insurance premiums
 * is limited by the age of the person.
 */
const TY26_ltc_table = [																	// 2025
	// 			Mximum
	// Age		Premium
	[	71,		6020	],
	[	61,		4810	],
	[	51,		1800	],
	[	41,		900		],
	[	0,		480		],
];

/* Social Security Table
 *
 * This table specifies the range of Social Security income that is
 * taxed at 50%. Below that range, it is not taxed. Above that range
 * is is taxed at 85%.
 */
const TY26_social_security_table = [														// 2025
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
const TY26_std_deduction_table = [
	// Filing		Std			Blind or
	// Status		Deduction	65
	[ "Single",		16100,		2050 ],
	[ "HoH",		24150,		2050 ],
	[ "MFJ",		32200,		1650 ],
	[ "QSS",		32200,		1650 ],
	[ "MFS",		16100,		1650 ],
];

//-----------------------------------------------------------------------------
//
//			California Tax tables
//
//-----------------------------------------------------------------------------

const TT26_ca_personal_exemption	= 153;												// 2025
const TT26_ca_dependent_exemption	= 475;												// 2025

/* California Standard Deduction Table
 *
 * This table specifies the standard deduction for each filing status plus the
 * additional amount that is added if the taxpayer or spouse is 65 or blind.
 */
const TY26_ca_std_deduction_table = [														// 2025
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
const TY26_ca_income_tax_table = [														// 2025
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
	
	[ "HoH",		0,			22173,		1.0		],
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