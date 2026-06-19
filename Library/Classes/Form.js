
class Form {
	// The forms object is indexed by form name. for each form, it returns an array with
	// all the instances of that form.
	static forms = {};

	static getFormValue(formname, lineno) {
		let sum = 0;

		let formlist = forms[formname];
		if (formlist.length > 0) {
			formlist.foreach(function(form) {
				sum += form.lines[lineno].value;
			});
		}

		return sum;
	}

	constructor(formname) {
		this.name	= formname;
		this.lines	= [];

		let formlist = forms[formname];
		formlist.push(this);
	}

	calculate() {
	}

	printForm() {
		console.log(`Form: ${this.name}`);
		this.lines.forEach(function(line, index) {
			console.log(`	lines[${index}]:	${line.label}	$line.value}`);
		});
		console.log("");
	}

	addLines(...indexlist) {
		let sum = 0;
		for (let i = 0; i < indexlist.length; i++) {
			let index = indexlist[i];
			sum += this.lines[index].value
		}
		return sum;
	}

	subLines(line1, line2) {
		// Subtract line1 from line2.
		return this.lines[line2].value - this.lines[line1].value;
	}

	getLine(line) {
		return this.lines[line].value;
	}
}

class F1040 extends Form {
	constructor(formname) {
		super(formname);

		this.name = "Form 1040";
		this.lines["1a"]	= new Line("Wages");
		this.lines["1b"]	= new Line("Household Wages");
		this.lines["1c"]	= new Line("Tip Income");
		this.lines["1d"]	= new Line("Medicaid Waiver Payments");
		this.lines["1e"]	= new Line("Dependent Care Benefits");
		this.lines["1f"]	= new Line("Adoption Benefits");
		this.lines["1g"]	= new Line("Wages from Form 8919");
		this.lines["1h"]	= new Line("Other Earned Income");
		this.lines["1i"]	= new Line("Nontaxable Combat Pay");
		this.lines["1z"]	= new Line("Total lines 1a-1h");
		this.lines["2a"]	= new Line("Tax-exempt Interest");
		this.lines["2b"]	= new Line("Taxable Interest");
		this.lines["3a"]	= new Line("Qualified Dividends");
		this.lines["3b"]	= new Line("Ordinary Dividends");
		this.lines["4a"]	= new Line("IRA Distributions");
		this.lines["4b"]	= new Line("Taxable IRA");
		this.lines["5a"]	= new Line("Pensions and Annuities");
		this.lines["5b"]	= new Line("Taxable Pensions and Annuities");
		this.lines["6a"]	= new Line("Social Security Benefits");
		this.lines["6b"]	= new Line("Taxable Social Security");
		this.lines["7a"]	= new Line("Capital Gain");
		this.lines["8"]		= new Line("Additional Income");
		this.lines["9"]		= new Line("Total Income");
		this.lines["10"]	= new Line("Adjustments to Income");
		this.lines["11a"]	= new Line("Adjusted Gross Income");
		this.lines["11b"]	= new Line("Adjusted Gross Income");
		this.lines["12e"]	= new Line("Deductions");
		this.lines["13a"]	= new Line("QBI Deduction");
		this.lines["13b"]	= new Line("Additional Deductions");
		this.lines["14"]	= new Line("Total Deductions");
		this.lines["15"]	= new Line("Taxable Income");
		this.lines["16"]	= new Line("Tax");
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
	}

	calculate() {
		// User inout values should already be set.
		this.lines["1a"].value	= getFormValue("W2", "1");
		this.lines["1b"].value	= 0;
		this.lines["1c"].value	= 0;
		this.lines["1d"].value	= 0;
		this.lines["1e"].value	= getFormValue("F2441", "26");
		this.lines["1f"].value	= getFormValue("F8839", "31");
		this.lines["1g"].value	= getFormValue("F8919", "6");
		this.lines["1h"].value	= 0;
		this.lines["1i"].value	= 0;
		this.lines["1z"].value	= addLines("1a", "1b", "1c", "1d", "1e", "1f", "1g", "1h");
		this.lines["2a"].value	= getFormValue("F1099INT",	"xx");
		this.lines["2b"].value	= getFormValue("F1099INT",	"xx");
		this.lines["3a"].value	= getFormValue("F1099DIV",	"xx");
		this.lines["3b"].value	= getFormValue("F1099DIV",	"xx");
		this.lines["4a"].value	= getFormValue("F1099R",	"xx");
		this.lines["4b"].value	= getFormValue("F1099R",	"xx");
		this.lines["5a"].value	= getFormValue("F1099R",	"xx");
		this.lines["5b"].value	= getFormValue("F1099R",	"xx");
		this.lines["6a"].value	= getFormValue("FSSA1099",	"xx");
		this.lines["6b"].value	= getFormValue("WS-SSTax",	"xx");
		this.lines["7a"].value	= getFormValue("F1040SD",	"xx");
		this.lines["8"].value	= getFormValue("F1040S1",	"10");
		this.lines["9"].value	= addLines("1z", "2b", "3b", "4b", "5b", "6b", "7a", "8");
		this.lines["10"].value	= getFormValue("F1040S1", "26");
		this.lines["11a"].value	= subLines("10", "9");
		this.lines["11b"].value	= getLine("11a");
		this.lines["12e"].value	= getDeductions();
		this.lines["13a"].value	= getFormValue("F8995", "xx");;
		this.lines["13b"].value	= getFormValue("F1040S1", "38");
		this.lines["14"].value	= addLines("12e", "13a", "13b");
		this.lines["15"].value	= Math.max(0, subLines("14", "11b"));
		this.lines["16"].value	= getFormValue("WS-IncTax", "xx");
		this.lines["17"].value	= getFormValue("F1040S2", "3");
		this.lines["18"].value	= addLines("16", "17");
		this.lines["19"].value	= getFormValue("F8812", "xx");
		this.lines["20"].value	= getFormValue("F1040S3", "8");
		this.lines["21"].value	= addLines("19", "20");
		this.lines["22"].value	= Math.max(0, subLines("21", "18"));
		this.lines["23"].value	= getFormValue("F1040S2", "21");
		this.lines["24"].value	= addLines("22", "23");
		this.lines["25a"].value	= getFormValue("W2", "xx");
		this.lines["25b"].value	= getFormValue("F1099INT", "xx") +
									getFormValue("F1099DIV", "xx") +
									getFormValue("F1099R", "xx") +
									getFormValue("FSSA1099", "xx");
		this.lines["25c"].value	= 0;	// Other withholding
		this.lines["25d"].value	= addLines("25a", "25b", "25c");
		this.lines["26"].value	= 0;	// Estimated tax payments
		this.lines["27a"].value	= getFormValue("WS-EIC", "xx");
		this.lines["28"].value	= getFormValue("F8812", "xx");
		this.lines["29"].value	= getFormValue("F8863", "8");
		this.lines["30"].value	= getFormValue("F8839", "13");
		this.lines["31"].value	= getFormValue("F1040S3", "15");
		this.lines["32"].value	= addLines("27a", "28", "29", "30", "31");
		this.lines["33"].value	= addLines("25d", "26", "32");
		if (getLine("33") > getLine("24")) {
			this.lines["34"].value	= subLines("24", "33");
			this.lines["35a"].value	= subLines("36", "34";
			this.lines["36"].value	= 0;	// Amount applied to next year's taxes.
			return;
		}
		this.lines["37"].value	= subLines("33", "24");
		this.lines["38"].value	= getFormValue("WS-Penalty", "xx");
	}
}
