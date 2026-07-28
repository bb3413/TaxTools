
//
// California Itemized Deductions Worksheet for high incomes from the
// Instructions for Schedule CA (540) California Adjustments, page 36.
//
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Forms }	from "../Classes/Forms.js";
import { Line }		from "../Classes/Line.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

export class CA_HiIncDeductions extends Form {
	constructor(formname) {
		Debug.enter("CA_HiIncDeductions.Constructor()");
		super(formname);

		this.lines["01"]	= new Line("Total Deductions");
		this.lines["02"]	= new Line("Medical + Interest, + Theft");
		this.lines["03"]	= new Line("Deductions - line 2");
		this.lines["04"]	= new Line("80%");
		this.lines["05"]	= new Line("Federal AGI");
		this.lines["06"]	= new Line("Itemized Deductions Phaseout");
		this.lines["07"]	= new Line("AGI - Phaseout");
		this.lines["08"]	= new Line("6% of Amount Over Phaseout");
		this.lines["09"]	= new Line("Min line 4 or 8");
		this.lines["10"]	= new Line("Line 1 - 9");
		this.lines["deductions"]	= new Line("deductions");

		Debug.exit("CA_HiIncDeductions.Constructor()");
	}

	calculate() {
		if (!this.modified) {
			throw new Error(`${formname} already calculated.`);
		}

		Debug.enter("CA_HiIncDeductions.calculate()");
		this.modified = false;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		this.lines["01"].value	= Forms.getValue("F540CA", "D-28");		// Total Deductions
		this.lines["02"].value	= Forms.getValue("F1040SA", "04") +		// Medical Expenses
									Forms.getValue("F1040SA", "09") +	// Interest
									Forms.getValue("F1040SA", "15");	// Casualy and Theft
		this.lines["03"].value	= this.subtract("01", "02");			// Deductions - line 2
		if (this.line("03") <= 0) {
			this.lines["Deductions"].value	= this.line("01");
		} else {
			this.lines["04"].value	= Math.round(this.line("03") * 0.80);	// 80%
			this.lines["05"].value	= Forms.getValue("F1040", "11b");		// Federal AGI
			this.lines["06"].value	= tt.getTaxValue("CA_HiIncPhaseout", tp.filing_status);
			this.lines["07"].value	= this.subtract("05", "06");			// AGI - Phaseout
			if (this.line("07") <= 0) {
				this.lines["Deductions"].value	= this.line("01");
			} else {
				this.lines["08"].value	= Math.round(this.line("07") * 0.06);	// 6% of Amount Over Phaseout
				this.lines["09"].value	= this.min("04", "08");				//
				this.lines["10"].value	= this.subtract("01", "09");		//
				this.lines["deductions"].value	= this.line("10");
			}
		}

		Debug.exit("CA_HiIncDeductions.calculate()");
	}
}
