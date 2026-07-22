
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Forms }	from "../Classes/Forms.js";
import { Line }		from "../Classes/Line.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

export class W2 extends Form {
	constructor(formname) {
		Debug.enter("W2.Constructor()");
		super(formname);

		this.isSingleton = false;
		Forms.addForm(formname, this);

		this.lines["01"]	= new Line("Wages");
		this.lines["02"]	= new Line("Income Tax Withheld");
		this.lines["03"]	= new Line("SS Wages");
		this.lines["04"]	= new Line("SS Tax Withheld");
		this.lines["05"]	= new Line("Medicare Wages");
		this.lines["06"]	= new Line("Medicare Tax Withheld");
		this.lines["07"]	= new Line("Social Security Tips");
		this.lines["08"]	= new Line("Allocated Tips");
		this.lines["09"]	= new Line("Not used");
		this.lines["10"]	= new Line("Dependent Care Benefits");
		this.lines["11"]	= new Line("Non-qualified Plans");
		this.lines["12-X"]	= new Line("Option");
		this.lines["13a"]	= new Line("Statutory Employee");
		this.lines["13b"]	= new Line("Retirement Plan");
		this.lines["13c"]	= new Line("Third-party Sick Pay");
		this.lines["14-X"]	= new Line("Other");
		this.lines["15"]	= new Line("State, ID");
		this.lines["16"]	= new Line("State Wages");
		this.lines["17"]	= new Line("State Income Tax Withheld");
		this.lines["18"]	= new Line("Local Wages");
		this.lines["19"]	= new Line("Local Income Tax Withheld");
		this.lines["20"]	= new Line("Locality Name");

		Debug.exit("W2.Constructor()");
	}

	calculate() {
		if (!this.modified) {
			throw new Error(`${formname} already calculated.`);
		}

		Debug.enter("W2.calculate()");
		this.modified = false;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		this.lines["13a"].value	= false,	// Statutory Employee
		this.lines["13b"].value	= false,	// Retirement Plan
		this.lines["13c"].value	= false,	// Third-party Sick Pay
		this.lines["15"].value	= "",		// State, ID
		this.lines["20"].value	= ""		// Locality Name

		Debug.exit("W2.calculate()");
	}
}
