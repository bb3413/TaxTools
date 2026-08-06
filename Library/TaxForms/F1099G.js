
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Forms }	from "../Classes/Forms.js";
import { Line }		from "../Classes/Line.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

export class F1099G extends Form {
	constructor(formname) {
		Debug.enter("F1099G.Constructor()");
		super(formname);

		this.isSingleton = false;

		this.lines["01"]	= new Line("Unemployment Compensation");
		this.lines["02"]	= new Line("State or Local Refund");
		this.lines["03"]	= new Line("Box 2 Is for Tax Year");
		this.lines["04"]	= new Line("Income Tax Withheld");
		this.lines["05"]	= new Line("RTAA Payments");
		this.lines["06"]	= new Line("Taxable Grants");
		this.lines["07"]	= new Line("Agriculture Payments");
		this.lines["08"]	= new Line("If Checked, Business Income");
		this.lines["09"]	= new Line("Market Gain");
		this.lines["10"]	= new Line("Family Leave Benefits");
		this.lines["11a"]	= new Line("State");
		this.lines["11b"]	= new Line("State Identification");
		this.lines["12"]	= new Line("State Income Tax Withheld");

		Debug.exit("F1099G.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("F1099G.calculate()");
		this.calculated = true;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		Debug.exit("F1099G.calculate()");
	}
}
