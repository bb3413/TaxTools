
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Line }		from "../Classes/Line.js";
import { Forms }	from "../Classes/Forms.js";
import { HTML }		from "../Classes/HTML.js";
import { Str }		from "../Classes/Str.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";
import { IncTax }	from "../Worksheets/IncTax.js";
import { SSTax }	from "../Worksheets/SSTax.js";

const FIELDS =	[
	// Line		Element
	// Number	Name
	[ "01a",	"Wages" ],
	[ "01b",	"HouseholdWages" ],
	[ "01c",	"TipIncome" ],
	[ "01d",	"MedicaidWaiverPayments" ],
	[ "01e",	"DependentCareBenefits" ],
	[ "01f",	"AdoptionBenefits" ],
	[ "01g",	"WagesFromForm8919" ],
	[ "01h",	"OtherEarnedIncome" ],
	[ "01i",	"NontaxableCombatPay" ],
	[ "01z",	"TotalLines1aTo1h" ],
	[ "02a",	"TaxExemptInterest" ],
	[ "02b",	"TaxableInterest" ],
	[ "03a",	"QualifiedDividends" ],
	[ "03b",	"OrdinaryDividends" ],
	[ "04a",	"IRADistributions" ],
	[ "04b",	"TaxableIRA" ],
	[ "05a",	"PensionsAndAnnuities" ],
	[ "05b",	"TaxablePensionsAndAnnuities" ],
	[ "06a",	"SocialSecurityBenefits" ],
	[ "06b",	"TaxableSocialSecurity" ],
	[ "07a",	"CapitalGain" ],
	[ "08",		"AdditionalIncome" ],
	[ "09",		"TotalIncome" ],
	[ "10",		"AdjustmentsToIncome" ],
	[ "11a",	"AdjustedGrossIncome" ],
	[ "11b",	"AdjustedGrossIncome" ],
	[ "12e",	"Deductions" ],
	[ "13a",	"QBIDeduction" ],
	[ "13b",	"AdditionalDeductions" ],
	[ "14",		"TotalDeductions" ],
	[ "15",		"TaxableIncome" ],
	[ "16",		"IncomeTax" ],
	[ "17",		"AdditionalTax" ],
	[ "18",		"TotalTax" ],
	[ "19",		"ChildTaxCredit" ],
	[ "20",		"NonrefundableCredits" ],
	[ "21",		"TotalNonrefundableCredits" ],
	[ "22",		"TaxMinusNonrefundableCredits" ],
	[ "23",		"OtherTaxes" ],
	[ "24",		"TotalTax" ],
	[ "25a",	"WithholdingFromW2" ],
	[ "25b",	"WithholdingFrom1099" ],
	[ "25c",	"OtherWithholding" ],
	[ "25d",	"TotalWithholding" ],
	[ "26",		"EstimatedTaxPayments" ],
	[ "27a",	"EarnedIncomeCredit" ],
	[ "28",		"AdditionalChildTaxCredit" ],
	[ "29",		"AmericanOpportunityCredit" ],
	[ "30",		"RefundableAdoptionCredit" ],
	[ "31",		"AdditionalRefundableCredits" ],
	[ "32",		"EstimatedPaymentsAndRefundableCredits" ],
	[ "33",		"TotalPayments" ],
	[ "34",		"Overpaid" ],
	[ "35a",	"Refund" ],
	[ "36",		"ApplyToNextYearsTax" ],
	[ "37",		"AmountOwed" ],
	[ "38",		"EstimatedTaxPenalty" ],
];

export class F1040 extends Form {
	constructor(formname) {
		Debug.enter("F1040.Constructor()");
		super(formname);

		Forms.addForm(formname, this);

		for (const field of FIELDS) {
			const lineno	= field[0];
			const name		= field[1];
			this.lines[lineno] = new Line(Str.camelCaseToEnglish(name));
		};

		Debug.exit("F1040.Constructor()");
	}

	calculate() {
		if (!this.modified) {
			throw new Error(`${formname} already calculated.`);
		}

		Debug.enter("F1040.calculate()");
		this.modified = false;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		// User input values are already set. If this calculation modifies one of
		// those values, it will be ignored.
		this.lines["01a"].value	= Forms.getValue("W2", "01");				// Wages
		this.lines["01b"].value	= 0;										// Household ages
		this.lines["01c"].value	= 0;										// Tip Income
		this.lines["01d"].value	= 0;										// Medicaid Waiver Payments
		this.lines["01e"].value	= Forms.getValue("F2441", "26");			// Dependent Care Benefits
		this.lines["01f"].value	= Forms.getValue("F8839", "31");			// Adoption Benefits
		this.lines["01g"].value	= Forms.getValue("F8919", "06");			// Wages from Form f8919
		this.lines["01h"].value	= 0;										// Other Earned Income
		this.lines["01i"].value	= 0;										// Nontaxable Combat Pay
		this.lines["01z"].value	= this.add("01a","01b","01c","01d","01e","01f","01g","01h");
		this.lines["02a"].value	= Forms.getValue("F1099INT",	"08");		// Tax-exempt Interest
		this.lines["02b"].value	= Forms.getValue("F1099INT",	"01");		// Taxable Interest
		this.lines["03a"].value	= Forms.getValue("F1099DIV",	"01b");		// Qualified Dividends
		this.lines["03b"].value	= Forms.getValue("F1099DIV",	"01a");		// Ordinary Dividends
		this.lines["04a"].value	= Forms.getValue("F1099R",		"01");		// IRA Distributions
		this.lines["04b"].value	= Forms.getValue("F1099R",		"02a") +	// Taxable IRA
									Forms.getValue("F8606",		"15c") +
									Forms.getValue("F8606",		"18") +
									Forms.getValue("F8606",		"25c");
		this.lines["05a"].value	= Forms.getValue("F1099R",		"01");		// Pensions and Annuities
		this.lines["05b"].value	= Forms.getValue("F1099R",		"02a");		// Taxable Pensions and Annuities
		this.lines["06a"].value	= Forms.getValue("FSSA1099",	"05");		// Social Security Benefits
		this.lines["06b"].value = 0;  // DELAY INITIALIZATION UNTIL LATER

		this.lines["07a"].value	= Forms.getValue("F1040SD",		"16") +		// Capital Gain
									Forms.getValue("F1040SD",	"21");
		this.lines["08"].value	= Forms.getValue("F1040S1",		"10");		// Additional Income

		// Reorder fields for dependency. Taxable SS, which is on 1040 line 6b, depends on 1040 lines 1z,
		// 2a, 2b, 3b, 4b, 5b, 6a, 7, 8, and 10. And, 1040 line 9 depends on Taxable SS.
		this.lines["10"].value	= Forms.getValue("F1040S1", "26");			// Adjustments to Income
		this.lines["06b"].value	= Forms.getValue("SSTax", "19");			// Taxable Social Security

		// Resume normal order
		this.lines["09"].value	= this.add("01z","02b","03b","04b","05b","06b","07a","08");	// Total Income
		this.lines["11a"].value	= this.subtract("09", "10");				// Adjusted Gross Income
		this.lines["11b"].value	= this.line("11a");							// Adjusted Gross Income

		const itemized_deductions	= Forms.getValue("F1040SA", "17");
		const standard_deduction	= tt.getStandardDeduction(
			tp.filing_status,
			tp.taxpayers_age,
			tp.spouses_age,
			tp.is_taxpayer_blind,
			tp.is_spouse_blind);

		this.lines["12e"].value	= Math.max(standard_deduction, itemized_deductions);	// Deductions
/*
		if (this.line("11a") - Forms.getValue("F1040S1", "13") - this.line("12e") < 3rd tax bracket limit) {
			this.lines["13a"].value = Forms.getValue("F8995", "15");
		} else {
			this.lines["13a"].value = Forms.getValue("F8995a", "19");
		}
*/
		this.lines["13a"].value	= Forms.getValue("F8995", "15");			// QBI Deduction
		this.lines["13b"].value	= Forms.getValue("F1040S1A", "38");			// Additional Deductions
		this.lines["14"].value	= this.add("12e","13a","13b");				// Total Deductions
		this.lines["15"].value	= Math.max(0, this.subtract("11b", "14"));	// Taxable Income
		this.lines["16"].value	= Forms.getValue("IncTax", "25");			// Income Tax
		this.lines["17"].value	= Forms.getValue("F1040S2", "03");			// Additional Tax
		this.lines["18"].value	= this.add("16", "17");						// Total Tax
		this.lines["19"].value	= Forms.getValue("F8812", "14");			// Child Tax Credit
		this.lines["20"].value	= Forms.getValue("F1040S3", "08");			// Non-refundable Credits
		this.lines["21"].value	= this.add("19", "20");						// Total Non-refundable Credits
		this.lines["22"].value	= Math.max(0, this.subtract("18", "21"));	// Tax minus Non-refundable Credits
		this.lines["23"].value	= Forms.getValue("F1040S2", "21");			// Other Taxes
		this.lines["24"].value	= this.add("22", "23");						// Total Tax
		this.lines["25a"].value	= Forms.getValue("W2", "02");				// Witholding from W-2s
		this.lines["25b"].value	= Forms.getValue("F1099INT", "04") +
									Forms.getValue("F1099DIV", "04") +
									Forms.getValue("F1099R", "04") +
									Forms.getValue("FSSA1099", "06");		// Withholding from 1099s
		this.lines["25c"].value	= Forms.getValue("F8959", "24");			// Other withholding
		this.lines["25d"].value	= this.add("25a", "25b", "25c");			// Total Withholding
		this.lines["26"].value	= 0;										// Estimated tax payments
		this.lines["27a"].value	= Forms.getValue("EIC", "xx");				// Earned Income Credit
		this.lines["28"].value	= Forms.getValue("F8812", "27");			// Additional Child Tax Credit
		this.lines["29"].value	= Forms.getValue("F8863", "08");			// American Opportunity Credit
		this.lines["30"].value	= Forms.getValue("F8839", "13");			// Refundable Adoption Credit
		this.lines["31"].value	= Forms.getValue("F1040S3", "15");			// Additional Refundable Credits
		this.lines["32"].value	= this.add("27a","28","29","30","31");		// Estimated Payments and Refundable Credits
		this.lines["33"].value	= this.add("25d","26","32");				// Total Payments
		if (this.line("33") > this.line("24")) {
			this.lines["34"].value	= this.subtract("33", "24");			// Overpaid
			this.lines["35a"].value	= this.subtract("34", "36");			// Refund
			this.lines["36"].value	= 0;									// Amount applied to next year's taxes.
		} else {
			this.lines["37"].value	= this.subtract("24", "33");				// Amount Owed
			this.lines["38"].value	= Forms.getValue("Penalty", "xx");			// Estimated Tax Penalty
		}
		Debug.exit("F1040.calculate()");
	}

	earnedIncome() {
			/*
			return 1040[1z] + 1040S1[3, 6, 8r, 8t, 8u] - 1040S1[15]
			*/
	}

	unearnedIncome() {
			/*
			return 1040[9] + 1040S1[24j] - (1040[1z] + 1040S1[3,6,8a,8d,8u,18])
			*/
	}

	static listFields() {
		const fields = [];

		for (const field of FIELDS) {
			fields.push(field);
		}

		return fields;
	}
}
