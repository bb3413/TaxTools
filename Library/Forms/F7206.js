
//
// Self-employment Health Insurance Deduction
//
// This is an implementation of form 7206..
//
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Forms }	from "../Classes/Forms.js";
import { Line }		from "../Classes/Line.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

export class F7206 extends Form {
	constructor(formname) {
		Debug.enter("F7206.Constructor()");
		super(formname);

		this.isSingleton = false;

		this.lines["01"]	= new Line("Health Insurance");
		this.lines["02"]	= new Line("LTC Insurance");		// Rounded down by age
		this.lines["03"]	= new Line("Total Health Insurance");
		this.lines["04"]	= new Line("Net Profit (business with Insurance");
		this.lines["05"]	= new Line("Net Profit (all businesses)");
		this.lines["06"]	= new Line("Profit Ratio");
		this.lines["07"]	= new Line("Deductible Part of SE Tax");
		this.lines["07x"]	= new Line("SE Tax * Profit Ratio");
		this.lines["08"]	= new Line("Profit - SE Tax");
		this.lines["09"]	= new Line("Retirement Plan Contributions, 1040S1, line 16");
		this.lines["10"]	= new Line("Profit - Retirement");
		this.lines["11"]	= new Line("Medicare Wages (W-2, box 5)");
		this.lines["12"]	= new Line("Form 2555, line 45");
		this.lines["13"]	= new Line("");
		this.lines["14"]	= new Line("SEHI Deduction");

		Debug.exit("F7206.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("F7206.calculate()");
		this.calculated = true;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		this.lines["01"].value	= 0;										// Health Insurance
		this.lines["02"].value	= 0;										// LTC Insurance (rounded down by age)
		this.lines["03"].value	= this.add("01", "02");						// Total Health Insurance
		this.lines["04"].value	= Forms.getValue("F1040SC", "31");			// Net Profit (business with Insurance)
		this.lines["05"].value	= this.line("04");							// Net Profit (all businesses)
		this.lines["06"].value	= this.line("04") / this.line("05");		// Profit Ratio
		this.lines["07"].value	= Forms.getValue("F1040S1", "15");			// Deductible Part of SE Tax
		this.lines["07x"].value	= this.line("07") * this.line("06");		// SE Tax * Profit Ratio
		this.lines["08"].value	= this.subtract("04", "07x");				// Profit - SE Tax
		this.lines["09"].value	= Forms.getValue("F1040S1", "16");			// Retirement Plan Contributions
		this.lines["10"].value	= this.subtract("08", "09");				// Profit - Retirement
		this.lines["11"].value	= Forms.getValue("W2", "05");				// Medicare Wages
		this.lines["12"].value	= Forms.getValue("F2555", "45");			//
		this.lines["13"].value	= Math.max(this.line("10"), this.line("11")) - this.line("12");
		this.lines["14"].value	= Math.min(this.line("03"), this.line("13"));	// SEHI Deduction

		Debug.exit("F7206.calculate()");
	}
}
