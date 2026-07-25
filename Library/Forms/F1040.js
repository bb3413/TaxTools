
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Line }		from "../Classes/Line.js";
import { Forms }	from "../Classes/Forms.js";
import { HTML }		from "../Classes/HTML.js";
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

		this.lines["01a"]	= new Line("Wages");
		this.lines["01b"]	= new Line("Household Wages");
		this.lines["01c"]	= new Line("Tip Income");
		this.lines["01d"]	= new Line("Medicaid Waiver Payments");
		this.lines["01e"]	= new Line("Dependent Care Benefits");
		this.lines["01f"]	= new Line("Adoption Benefits");
		this.lines["01g"]	= new Line("Wages from Form 8919");
		this.lines["01h"]	= new Line("Other Earned Income");
		this.lines["01i"]	= new Line("Nontaxable Combat Pay");
		this.lines["01z"]	= new Line("Total lines 1a To 1h");
		this.lines["02a"]	= new Line("Tax-exempt Interest");
		this.lines["02b"]	= new Line("Taxable Interest");
		this.lines["03a"]	= new Line("Qualified Dividends");
		this.lines["03b"]	= new Line("Ordinary Dividends");
		this.lines["04a"]	= new Line("IRA Distributions");
		this.lines["04b"]	= new Line("Taxable IRA");
		this.lines["05a"]	= new Line("Pensions and Annuities");
		this.lines["05b"]	= new Line("Taxable Pensions and Annuities");
		this.lines["06a"]	= new Line("Social Security Benefits");
		this.lines["06b"]	= new Line("Taxable Social Security");
		this.lines["07a"]	= new Line("Capital Gain");
		this.lines["08"]	= new Line("Additional Income");
		this.lines["09"]	= new Line("Total Income");
		this.lines["10"]	= new Line("Adjustments to Income");
		this.lines["11a"]	= new Line("Adjusted Gross Income");
		this.lines["11b"]	= new Line("Adjusted Gross Income");
		this.lines["12e"]	= new Line("Deductions");
		this.lines["13a"]	= new Line("QBI Deduction");
		this.lines["13b"]	= new Line("Additional Deductions");
		this.lines["14"]	= new Line("Total Deductions");
		this.lines["15"]	= new Line("Taxable Income");
		this.lines["16"]	= new Line("Income Tax");
		this.lines["17"]	= new Line("Additional Tax");
		this.lines["18"]	= new Line("Total Tax");
		this.lines["19"]	= new Line("Child Tax Credit");
		this.lines["20"]	= new Line("Non-refundable Credits");
		this.lines["21"]	= new Line("Total Non-refundable Credits");
		this.lines["22"]	= new Line("Tax minus Non-refundable Credits");
		this.lines["23"]	= new Line("Other Taxes");
		this.lines["24"]	= new Line("Total Tax");
		this.lines["25a"]	= new Line("Withholding from W-2s");
		this.lines["25b"]	= new Line("Withholding from 1099s");
		this.lines["25c"]	= new Line("Other Withholding");
		this.lines["25d"]	= new Line("Total Withholding");
		this.lines["26"]	= new Line("Estimated Tax Payments");
		this.lines["27a"]	= new Line("Earned Income Credit");
		this.lines["28"]	= new Line("Additional Child Tax Credit");
		this.lines["29"]	= new Line("American Opportunity Credit");
		this.lines["30"]	= new Line("Refundable Adoption Credit");
		this.lines["31"]	= new Line("Additional Refundable Credits");
		this.lines["32"]	= new Line("Estimated Payments and Refundable Credits");
		this.lines["33"]	= new Line("Total Payments");
		this.lines["34"]	= new Line("Overpaid");
		this.lines["35a"]	= new Line("Refund");
		this.lines["36"]	= new Line("Apply to Next Year's Tax");
		this.lines["37"]	= new Line("Amount Owed");
		this.lines["38"]	= new Line("Estimated Tax Penalty");

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

	//
	// Static methods
	//
	static getFieldsForInput(input) {
		// Gets the fields from the web page, process any debug keywords,
		// and convert to an integer. Put the values into the object passed
		// as a parameter.

		FIELDS.forEach(function(line) {
			const lineno		= line[0];
			const element_name	= line[1];
			const var_name		= Str.toSnake(label);
			
			input[var_name] = HTML.getUserInput(line[1]);
		});
	}

	static getFieldsForSave() {
		// This method gets the fields from the web page and create an array in the
		// format needed to save the value to a file.
		const title		= [ "W2" ];
		const form		= [];

		FIELDS.forEach(function(line) {
			const lineno		= line[0];
			const element_name	= line[1];
			const value			= HTML.getElementValue(element_name);
			if (value) {	// Don't save blank lines.
				form.push( [ lineno, value ] );
			}
		});
		
		if (form.length > 0) {
			return title.concat(form);
		} else {
			return [];
		}
	}

	static putFieldsFormRestore(form) {
		// This method puts the fields read from a saved file back onto the
		// web page.
		form.pop();		// Ignore the form name.

		form.forEach(function(line) {
			let lineno			= line[0];
			let element_name	= line[1];
			HTML.putElementValue(element_name, value);
		});
	}

	static listFields() {
		const fields = [];

		FIELDS.forEach(function(field) {
			fields.push(field);
		});

		return fields;
	}
}
