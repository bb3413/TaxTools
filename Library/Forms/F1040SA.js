
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Forms }	from "../Classes/Forms.js";
import { Line }		from "../Classes/Line.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

export class F1040SA extends Form {
	constructor(formname) {
		Debug.enter("F1040SA.Constructor()");
		super(formname);

		Forms.addForm(formname, this);

		this.lines["01"]	= new Line("Medical Expenses");
		this.lines["02"]	= new Line("AGI");
		this.lines["03"]	= new Line("7.5% or AGI");
		this.lines["04"]	= new Line("Medical Deduction");
		this.lines["05a"]	= new Line("State and Local Income Tax");
		this.lines["05b"]	= new Line("Real Estate Tax");
		this.lines["05c"]	= new Line("Personal Property Tax");
		this.lines["05d"]	= new Line("Total State and Local Taxes");
		this.lines["05e"]	= new Line("SALT after Limit");
		this.lines["06"]	= new Line("Other Taxes");
		this.lines["07"]	= new Line("Deduction for Taxes Paid");
		this.lines["08a"]	= new Line("Mortgage Interest");
		this.lines["08b"]	= new Line("Mortgage Interest Not from 1098");
		this.lines["08c"]	= new Line("Mortgage Points Not from 1098");
		this.lines["08d"]	= new Line("Reserved For Future Use");
		this.lines["08e"]	= new Line("Mortgage Deduction");
		this.lines["09"]	= new Line("Investment Interest");
		this.lines["10"]	= new Line("Interest Deduction");
		this.lines["11"]	= new Line("Cash Donations");
		this.lines["12"]	= new Line("Non-cash Donatons");
		this.lines["13"]	= new Line("Carry-over Donations");
		this.lines["14"]	= new Line("Donation Deduction");
		this.lines["15"]	= new Line("Casualty and Theft Deduction");
		this.lines["16"]	= new Line("Other Deduction");
		this.lines["17"]	= new Line("Itemized Deductions");

		Debug.exit("F1040SA.Constructor()");
	}

	calculate() {
		if (!this.modified) {
			throw new Error(`${formname} already calculated.`);
		}

		Debug.enter("F1040SA.calculate()");
		this.modified = false;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		this.lines["01"].value	= 0;								// Medical Expenses
		this.lines["02"].value	= Forms.getValue("F1040", "11b");	// AGI
		this.lines["03"].value	= Math.round(this.line("02") * 0.075);	// 7.5% or AGI
		this.lines["04"].value	= Math.max(0, this.subtract("01", "03"));	// Medical Deduction
		this.lines["05a"].value	= 0;								// State and Local Income Tax
		this.lines["05b"].value	= 0;								// Real Estate Tax
		this.lines["05c"].value	= 0;								// Personal Property Tax
		this.lines["05d"].value	= this.add("05a","05b","05c");		// Total State and Local Taxes
		this.lines["05e"].value	= Math.min(this.line("05d"),		// SALT after Limit
										   tt.getTaxValue("MaxSALT", tp.filing_status));
		this.lines["06"].value	= 0;								// Other Taxes
		this.lines["07"].value	= this.add("05e","06");				// Deduction for Taxes Paid
		this.lines["08a"].value	= 0;								// Mortgage Interest
		this.lines["08b"].value	= 0;								// Mortgage Interest Not from 1098
		this.lines["08c"].value	= 0;								// Mortgage Points Not from 1098
		this.lines["08d"].value	= 0;								// Reserved For Future Use
		this.lines["08e"].value	= this.add("08a","08b","08c");		// Mortgage Deduction
		this.lines["09"].value	= 0;								// Investment Interest
		this.lines["10"].value	= this.add("08e","09");				// Interest Deduction
		this.lines["11"].value	= 0;								// Cash Donations
		this.lines["12"].value	= 0;								// Non-cash Donatons
		this.lines["13"].value	= 0;								// Carry-over Donations
		this.lines["14"].value	= this.add("11","12","13");			// Donation Deduction
		this.lines["15"].value	= 0;								// Casualty and Theft Deduction
		this.lines["16"].value	= 0;								// Other Deduction
		this.lines["17"].value	= this.add("04","07","10","14","15","16");	// Itemized Deductions

		Debug.exit("F1040SA.calculate()");
	}
}
