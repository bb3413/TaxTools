
// Input fields
let tax_year						= 0;
let filing_status					= "";
let taxpayers_birthday				= "";
let spouses_birthday				= "";
let taxpayer_is_blind				= false;
let spouse_is_blind					= false;

let agi								= 0;		// 1040, line 11b
let qualified_dividends				= 0;		// 1040, line 3a
let capital_gains					= 0;		// 1040, line 7a
let taxable_income					= 0;		// 1040, line 15
let income_tax						= 0;		// 1040, line 16

let itemized_deduction				= 0;		// 1040 SA, line 17
let taxes_paid_deduction			= 0;		// 1040 SA, line 7
let qbi_deduction					= 0;		// 1040, line 13a

let state_tax_refund				= 0;		// 1040 S1, line 1
let investment_interest				= 0;
let depletion						= 0;
let net_operating_loss				= 0;
let alternate_net_operating_loss	= 0;
let private_activity_bonds_interest	= 0;
let qualified_small_business_stock	= 0;
let incentive_stock_options			= 0;
let estates_and_trusts				= 0;
let disposition_of_property			= 0;
let post_1986_depreciation			= 0;
let passive_activities				= 0;
let loss_limitations				= 0;
let circulation_costs				= 0;
let long_term_contracts				= 0;
let mining_costs					= 0;
let reseach_costs					= 0;
let installment_sales				= 0;
let intangible_drilling_costs		= 0;
let other_income					= 0;

// Debug fields
let standard_deduction				= 0;
let senior_deduction				= 0;		// 1040 S1A, line 37
let total_deductions				= 0;		// 1040, line14
let itemized						= false;

// Form 6251, Part I
let line_1a							= 0;		// Total deductions - senior deduction
let line_1b							= 0;		// AGI minus deductions (line 1a)
let line_2a							= 0;		// Deductions allowed for AMT
let line_2b							= 0;		// State tax refund; schedule 1, line 1 or 8z
let line_2c							= 0;		// Not used. Investment interest expense
let line_2d							= 0;		// Not used. Depletion
let line_2e							= 0;		// Not used. Net operating loss deduction
let line_2f							= 0;		// Not used. Alternative tax net operating loss deduction
let line_2g							= 0;		// Interest from private activity bonds
let line_2h							= 0;		// Qualified small business stock
let line_2i							= 0;		// Exercise of incentive stock options
let line_2j							= 0;		// Estates and trusts
let line_2k							= 0;		// Disposition of property
let line_2l							= 0;		// Pose-1986 depreciation
let line_2m							= 0;		// Passive activities
let line_2n							= 0;		// Loss limitations
let line_2o							= 0;		// Circulation costs
let line_2p							= 0;		// Long-term contracts
let line_2q							= 0;		// Mining costs
let line_2r							= 0;		// Reseach and experimental costs
let line_2s							= 0;		// Installment sales
let line_2t							= 0;		// Intangible drilling costs
let line_3							= 0;		// Other adjustments

let line_4							= 0;

// Form 6251, Part II
let line_5							= 0;
let line_6							= 0;
let line_7							= 0;
let line_8							= 0;
let line_9							= 0;
let line_10							= 0;
let line_11							= 0;

// Form 6251, Part III
let line_12							= 0;
let line_13							= 0;
let line_14							= 0;
let line_15							= 0;
let line_16							= 0;
let line_17							= 0;
let line_18							= 0;
let line_19							= 0;
let line_20							= 0;
let line_21							= 0;
let line_22							= 0;
let line_23							= 0;
let line_24							= 0;
let line_25							= 0;
let line_26							= 0;
let line_27							= 0;
let line_28							= 0;
let line_29							= 0;
let line_30							= 0;
let line_31							= 0;
let line_32							= 0;
let line_33							= 0;
let line_34							= 0;
let line_35							= 0;
let line_36							= 0;
let line_37							= 0;
let line_38							= 0;
let line_39							= 0;
let line_40							= 0;

function calculateAMT_Income() {
	// This funtion performs the calculations in form 6251, part I.

	line_1a	= total_deductions - senior_deduction;
	line_1b	= Max(0, agi - line_1a);
	if (itemized)
		line_2a = taxes_paid_deduction;
	else
		line_2a = standard_deduction;
	line_2b	= state_tax_refund;					// Subtraction
	line_2c	= investment_interest;
	line_2d	= depletion;
	line_2e	= net_operating_loss;
	line_2f	= alternate_net_operating_loss;		// Subtraction
	line_2g	= private_activity_bonds_interest;
	line_2h	= qualified_small_business_stock;
	line_2i	= incentive_stock_options;
	line_2j	= estates_and_trusts;
	line_2k	= disposition_of_property;
	line_2l	= post_1986_depreciation;
	line_2m	= passive_activities;
	line_2n	= loss_limitations;
	line_2o	= circulation_costs;
	line_2p	= long_term_contracts;
	line_2q	= mining_costs;
	line_2r	= reseach_costs;
	line_2s	= installment_sales;				// Subtraction
	line_2t	= intangible_drilling_costs;
	line_3	= other_income;
	
	line_4	=	line_1b
				+ line_2a
				- line_2b
				+ line_2c
				+ line_2d
				+ line_2e
				- line_2f
				+ line_2g
				+ line_2h
				+ line_2i
				+ line_2j
				+ line_2k
				+ line_2l
				+ line_2m
				+ line_2n
				+ line_2o
				+ line_2p
				+ line_2q
				+ line_2r
				- line_2s
				+ line_2t
				+ line_3;
}

function AMT_TaxWithCapGains() {
	// This funtion performs the calculations in form 6251, part III.
	
	line_12	= line_6;			// line 6 = AMT income - AMT exemption
	line_13	= capital_gains + qualified_dividends;
	line_14	= 0;				// Leave blank for now.
	line_15	= line_13 + line_14;
	line_16	= Min(line_12, line_15);
	line_17	= line_12 - line_16;
	line_18	= get_AMT_Tax(filing_status, line_17);
	line_19	= get_CapGains_15_Start(filing_status);
	line_20	= taxable_income;
	line_21	= Max(0, line_19 - line_20);
	line_22	= Min(line_12, line_13);
	line_23	= Min(line_21, line_22);				// 0%
	line_24	= line_22 - line_23;
	line_25	= get_CapGains_20_Start(filing_status);
	line_26	= line_21;
	line_27	= taxable_income;
	line_28	= line_26 + line_27;
	line_29	= Max(0, line_25 - line_28);
	line_30	= Min(line_24, line_29);
	line_31	= Round(line_30 * 0.15);				// 15%
	line_32	= line_23 + line_30;
	if (line_12 != line_32) {
		line_33	= line_22 - line_32;
		line_34	= Round(line_33 * 0.20);			// 20%
		if (line_14 != 0) {
			line_35	= line_17 + line_32 + line_33;
			line_36	= line_12 - line_35;
			line_37	= Round(line_36 * 0.25);		// 25%
		}
	}
	line_38	= line_18 + line_31 + line_34 + line_37;
	line_39	= get_AMT_Tax(filing_status, line_12);
	line_40	= Min(line_38, line_39);

	return line_40;
}

function CalculateAMT() {
	
	InitializeTaxTables(filing_status, tax_year);
	
	let end_of_year				= new Date("12/31/" + tax_year);
	let taxpayers_age			= Age(taxpayers_birthday, end_of_year);
	let spouses_age				= Age(spouses_birthday, end_of_year);

	standard_deduction			= getStandardDeduction(
										filing_status,
										taxpayers_age, spouses_age,
										taxpayer_is_blind, spouse_is_blind);

	senior_deduction			= getSeniorDeduction(filing_status, agi, taxpayers_age, spouses_age);
	itemized					= itemized_deduction > standard_deduction;
	total_deductions			= ((itemized) ? itemized_deduction : standard_deduction) +
									qbi_deduction +
									senior_deduction;

	// Calculate the AMT Income on form 6251, part I
	calculateAMT_Income();			// Initializes lines 1-4 of form 6251, part I

	// Calculate the AMT Tax on form 6251, part II
	line_5	= get_AMT_Exemption(filing_status, line_4);
	line_6	= line_4 - line_5;			// line 6 = AMT income - AMT exemption
	if (line_6 > 0) {
		if ((capital_gains > 0) || (qualified_dividends > 0)) {
			line_7	= AMT_TaxWithCapGains();
		} else {
			line_7 = get_AMT_Tax(filing_status, line_6);
		}
		line_8	= 0;					// AMT foreign tax credit
		line_9	= line_7 - line_8;		// AMT
	} else {	// AMT income is < AMT exemption, therefore AMT = 0
		line_6	= 0;
		line_7	= 0;
		line_9	= 0;					// AMT
		line_11	= 0;
	}
	line_10	= income_tax;				// 1040, line 16, normal income tax
	line_11	= Max(0, line_9 - line_10);	// AMT
}

function GetInput() {
	tax_year						= getUserInput("TaxYear");
	filing_status					= getUserInput("FilingStatus",		"text");
	taxpayers_birthday				= getUserInput("TaxpayersBirthday",	"text");
	spouses_birthday				= getUserInput("SpousesBirthday",	"text");
	taxpayer_is_blind				= getUserInput("TaxpayerIsBlind");
	spouse_is_blind					= getUserInput("SpouseIsBlind");

	// Input fields
	agi								= getUserInput("AGI");
	qualified_dividends				= getUserInput("QualifiedDividends");
	capital_gains					= getUserInput("CapitalGains");
	taxable_income					= getUserInput("TaxableIncome");
	income_tax						= getUserInput("IncomeTax");

	itemized_deduction				= getUserInput("ItemizedDeduction");
	taxes_paid_deduction			= getUserInput("TaxesPaidDeduction");
	qbi_deduction					= getUserInput("QBIDeduction");
	
	state_tax_refund				= getUserInput("StateTaxRefund");
	investment_interest				= getUserInput("InvestmentInterestExpense");
	depletion						= getUserInput("Depletion");
	net_operating_loss				= getUserInput("NetOperatingLoss");
	alternate_net_operating_loss	= getUserInput("AlternateNetOperatingLoss");
	private_activity_bonds_interest	= getUserInput("PrivateActivityBondsInterest");
	qualified_small_business_stock	= getUserInput("QualifiedSmallBusinessStock");
	incentive_stock_options			= getUserInput("IncentiveStockOptions");
	estates_and_trusts				= getUserInput("EstatesAndTrusts");
	disposition_of_property			= getUserInput("DispositionOfProperty");
	post_1986_depreciation			= getUserInput("Post1986Depreciation");
	passive_activities				= getUserInput("PassiveActivities");
	loss_limitations				= getUserInput("LossLimitations");
	circulation_costs				= getUserInput("CirculationCosts");
	long_term_contracts				= getUserInput("LongTermContracts");
	mining_costs					= getUserInput("MiningCosts");
	reseach_costs					= getUserInput("ReseachCosts");
	installment_sales				= getUserInput("InstallmentSales");
	intangible_drilling_costs		= getUserInput("IntangibleDrillingCosts");
	other_income					= getUserInput("OtherIncome");
	
	amt_income						= 0;
	amt_exemption					= 0;
	amt								= 0;

	// Debug fields
	standard_deduction				= 0;
	senior_deduction				= 0;
	total_deductions				= 0;
	itemized						= false;

	// Form 6251, Part I
	line_1a							= 0;
	line_1b							= 0;
	line_2a							= 0;
	line_2b							= 0;
	line_2c							= 0;
	line_2d							= 0;
	line_2e							= 0;
	line_2f							= 0;
	line_2g							= 0;
	line_2h							= 0;
	line_2i							= 0;
	line_2j							= 0;
	line_2k							= 0;
	line_2l							= 0;
	line_2m							= 0;	
	line_2n							= 0;
	line_2o							= 0;
	line_2p							= 0;
	line_2q							= 0;
	line_2r							= 0;
	line_2s							= 0;
	line_2t							= 0;
	line_3							= 0;
	line_4							= 0;

	// Form 6251, Part II
	line_5							= 0;
	line_6							= 0;
	line_7							= 0;
	line_8							= 0;
	line_9							= 0;
	line_10							= 0;
	line_11							= 0;

	// Form 6251, Part III
	line_12							= 0;
	line_13							= 0;
	line_14							= 0;
	line_15							= 0;
	line_16							= 0;
	line_17							= 0;
	line_18							= 0;
	line_19							= 0;
	line_20							= 0;
	line_21							= 0;
	line_22							= 0;
	line_23							= 0;
	line_24							= 0;
	line_25							= 0;
	line_26							= 0;
	line_27							= 0;
	line_28							= 0;
	line_29							= 0;
	line_30							= 0;
	line_31							= 0;
	line_32							= 0;
	line_33							= 0;
	line_34							= 0;
	line_35							= 0;
	line_36							= 0;
	line_37							= 0;
	line_38							= 0;
	line_39							= 0;
	line_40							= 0;
}

function PutOutput() {
	
	putUserOutput("AMTIncome",		line_4);
	putUserOutput("AMTExemption",	line_5);
	putUserOutput("AMT",			line_11);
	
	// Debug fields
	putDebugOutput("Debug01", standard_deduction,		"Standard Deduction");
	putDebugOutput("Debug02", senior_deduction,			"Senior Deduction");
	putDebugOutput("Debug03", total_deductions,			"Total Deductions");
	putDebugOutput("Debug04", itemized,					"Itemized");

	// Form 6251, Part I
	putDebugOutput("Debug07", line_1a,	"Line 1a Total deductions - senior deduction");
	putDebugOutput("Debug08", line_1b,	"Line 1b AGI minus deductions (line 1a)");
	putDebugOutput("Debug09", line_2a,	"Line 2a Deductions allowed for AMT");
	putDebugOutput("Debug10", line_2b,	"Line 2b State tax refund; schedule 1, line 1 or 8z");
	putDebugOutput("Debug11", line_2c,	"Line 2c Investment interest expense");
	putDebugOutput("Debug12", line_2d,	"Line 2d Depletion");
	putDebugOutput("Debug13", line_2e,	"Line 2e Net operating loss deduction");
	putDebugOutput("Debug14", line_2f,	"Line 2f Alternative tax net operating loss deduction");
	putDebugOutput("Debug15", line_2g,	"Line 2g Interest from private activity bonds");
	putDebugOutput("Debug16", line_2h,	"Line 2h Qualified small business stock");
	putDebugOutput("Debug17", line_2i,	"Line 2i Exercise of incentive stock options");
	putDebugOutput("Debug18", line_2j,	"Line 2j Estates and trusts");
	putDebugOutput("Debug19", line_2k,	"Line 2k Disposition of property");
	putDebugOutput("Debug20", line_2l,	"Line 2l Post-1986 depreciation");
	putDebugOutput("Debug21", line_2m,	"Line 2m Passive activities");
	putDebugOutput("Debug22", line_2n,	"Line 2n Loss limitations");
	putDebugOutput("Debug23", line_2o,	"Line 2o Circulation costs");
	putDebugOutput("Debug24", line_2p,	"Line 2p Long-term contracts");
	putDebugOutput("Debug25", line_2q,	"Line 2q Mining costs");
	putDebugOutput("Debug26", line_2r,	"Line 2r Reseach and experimental costs");
	putDebugOutput("Debug27", line_2s,	"Line 2s Installment sales");
	putDebugOutput("Debug28", line_2t,	"Line 2t Intangible drilling costs");
	putDebugOutput("Debug29", line_3,	"Line 3 Other adjustments");
	putDebugOutput("Debug30", line_4,	"Line 4 AMT Income (total of lines 1b through line 3");

	// Form 6251, Part II
	putDebugOutput("Debug31", line_5,	"Line 5 AMT Exemption");
	putDebugOutput("Debug32", line_6,	"Line 6 AMT Income (line 4) minus Exemption");
	putDebugOutput("Debug33", line_7,	"Line 7 Result from form 6251, Part III");
	putDebugOutput("Debug34", line_8,	"Line 8 AMT Foreign Tax Credit");
	putDebugOutput("Debug35", line_9,	"Line 9 Tentative Minimum Tax");
	putDebugOutput("Debug36", line_10,	"Line 10 Normal Income Tax (1040, line 13a)");
	putDebugOutput("Debug37", line_11,	"Line 11 AMT");

	// Form 6251, Part III
	putDebugOutput("Debug38", line_12,	"Line 12");
	putDebugOutput("Debug39", line_13,	"Line 13");
	putDebugOutput("Debug40", line_14,	"Line 14");
	putDebugOutput("Debug41", line_15,	"Line 15");
	putDebugOutput("Debug42", line_16,	"Line 16");
	putDebugOutput("Debug43", line_17,	"Line 17");
	putDebugOutput("Debug44", line_18,	"Line 18");
	putDebugOutput("Debug45", line_19,	"Line 19");
	putDebugOutput("Debug46", line_20,	"Line 20");
	putDebugOutput("Debug47", line_21,	"Line 21");
	putDebugOutput("Debug48", line_22,	"Line 22");
	putDebugOutput("Debug49", line_23,	"Line 23");
	putDebugOutput("Debug50", line_24,	"Line 24");
	putDebugOutput("Debug51", line_25,	"Line 25");
	putDebugOutput("Debug52", line_26,	"Line 26");
	putDebugOutput("Debug53", line_27,	"Line 27");
	putDebugOutput("Debug54", line_28,	"Line 28");
	putDebugOutput("Debug55", line_29,	"Line 29");
	putDebugOutput("Debug56", line_30,	"Line 30");
	putDebugOutput("Debug57", line_31,	"Line 31");
	putDebugOutput("Debug58", line_32,	"Line 32");
	putDebugOutput("Debug59", line_33,	"Line 33");
	putDebugOutput("Debug60", line_34,	"Line 34");
	putDebugOutput("Debug61", line_35,	"Line 35");
	putDebugOutput("Debug62", line_36,	"Line 36");
	putDebugOutput("Debug63", line_37,	"Line 37");
	putDebugOutput("Debug64", line_38,	"Line 38");
	putDebugOutput("Debug65", line_39,	"Line 39");
	putDebugOutput("Debug66", line_40,	"Line 40");
}

function ChangeHandler(event) {
	TurnOffDebug();
	GetInput();
	CalculateAMT();
	PutOutput();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	//
	// Wait for the DOM to be fully loaded before trying to access any elements.
	//
	addListener("TaxYear",						"change", ChangeHandler);
	addListener("FilingStatus",					"change", ChangeHandler);
	addListener("TaxpayersBirthday",			"change", ChangeHandler);
	addListener("SpousesBirthday",				"change", ChangeHandler);
	addListener("TaxpayerIsBlind",				"change", ChangeHandler);
	addListener("SpouseIsBlind",				"change", ChangeHandler);

	// Input fields
	addListener("AGI",							"change", ChangeHandler);
	addListener("QualifiedDividends",			"change", ChangeHandler);
	addListener("CapitalGains",					"change", ChangeHandler);
	addListener("TaxableIncome",				"change", ChangeHandler);
	addListener("IncomeTax",					"change", ChangeHandler);

	addListener("ItemizedDeduction",			"change", ChangeHandler);
	addListener("TaxesPaidDeduction",			"change", ChangeHandler);
	addListener("QBIDeduction",					"change", ChangeHandler);

	addListener("StateTaxRefund",				"change", ChangeHandler);
	addListener("InvestmentInterestExpense",	"change", ChangeHandler);
	addListener("Depletion",					"change", ChangeHandler);
	addListener("NetOperatingLoss",				"change", ChangeHandler);
	addListener("AlternateNetOperatingLoss",	"change", ChangeHandler);
	addListener("PrivateActivityBondsInterest",	"change", ChangeHandler);
	addListener("QualifiedSmallBusinessStock",	"change", ChangeHandler);
	addListener("IncentiveStockOptions",		"change", ChangeHandler);
	addListener("EstatesAndTrusts",				"change", ChangeHandler);
	addListener("DispositionOfProperty",		"change", ChangeHandler);
	addListener("Post1986Depreciation",			"change", ChangeHandler);
	addListener("PassiveActivities",			"change", ChangeHandler);
	addListener("LossLimitations",				"change", ChangeHandler);
	addListener("CirculationCosts",				"change", ChangeHandler);
	addListener("LongTermContracts",			"change", ChangeHandler);
	addListener("MiningCosts",					"change", ChangeHandler);
	addListener("ReseachCosts",					"change", ChangeHandler);
	addListener("InstallmentSales",				"change", ChangeHandler);
	addListener("IntangibleDrillingCosts",		"change", ChangeHandler);
	addListener("OtherIncome",					"change", ChangeHandler);
	
	ChangeHandler();
});
