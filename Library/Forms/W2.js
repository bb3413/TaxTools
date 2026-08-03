
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Forms }	from "../Classes/Forms.js";
import { HTML }		from "../Classes/HTML.js";
import { Line }		from "../Classes/Line.js";
import { Objects }	from "../Classes/Objects.js";
import { Str }		from "../Classes/Str.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

export class W2 extends Form {
	static getUserInput(index = 1) {	// Index starts at 1.
		//
		// Create a new W-2 form and initialize it with information from the Web page.
		//
		const element = document.getElementById(`form-w2-${index}-input`);
		if (!element) {
			if (Debug.strict()) {
				throw new Error(`getElementValue: Element not found: form-w2-${index}-input`);
			}
			return;
		}

		let inputs = {};

		inputs["01"]		= HTML.getUserInput(`w2-${index}-01`, "");
		inputs["02"]		= HTML.getUserInput(`w2-${index}-02`, "");
		inputs["03"]		= HTML.getUserInput(`w2-${index}-03`, "");
		inputs["04"]		= HTML.getUserInput(`w2-${index}-04`, "");
		inputs["05"]		= HTML.getUserInput(`w2-${index}-05`, "");
		inputs["06"]		= HTML.getUserInput(`w2-${index}-06`, "");
		inputs["07"]		= HTML.getUserInput(`w2-${index}-07`, "");
		inputs["08"]		= HTML.getUserInput(`w2-${index}-08`, "");
		inputs["09"]		= HTML.getUserInput(`w2-${index}-09`, "");
		inputs["10"]		= HTML.getUserInput(`w2-${index}-10`, "");
		inputs["11"]		= HTML.getUserInput(`w2-${index}-11`, "");
		inputs["12a1"]		= HTML.getUserInput(`w2-${index}-12a1`, "");
		inputs["12a2"]		= HTML.getUserInput(`w2-${index}-12a2`, "");
		inputs["12b1"]		= HTML.getUserInput(`w2-${index}-12b1`, "");
		inputs["12b2"]		= HTML.getUserInput(`w2-${index}-12b2`, "");
		inputs["12c1"]		= HTML.getUserInput(`w2-${index}-12c1`, "");
		inputs["12c2"]		= HTML.getUserInput(`w2-${index}-12c2`, "");
		inputs["12d1"]		= HTML.getUserInput(`w2-${index}-12d1`, "");
		inputs["12d2"]		= HTML.getUserInput(`w2-${index}-12d2`, "");
		inputs["13a"]		= HTML.getUserInput(`w2-${index}-13a`, "");
		inputs["13b"]		= HTML.getUserInput(`w2-${index}-13b`, "");
		inputs["13c"]		= HTML.getUserInput(`w2-${index}-13c`, "");
		inputs["14a1"]		= HTML.getUserInput(`w2-${index}-14a1`, "text");
		inputs["14a2"]		= HTML.getUserInput(`w2-${index}-14a2`, "");
		inputs["14b1"]		= HTML.getUserInput(`w2-${index}-14b1`, "text");
		inputs["14b2"]		= HTML.getUserInput(`w2-${index}-14b2`, "");
		inputs["14c1"]		= HTML.getUserInput(`w2-${index}-14c1`, "text");
		inputs["14c2"]		= HTML.getUserInput(`w2-${index}-14c2`, "");
		inputs["14d1"]		= HTML.getUserInput(`w2-${index}-14d1`, "text");
		inputs["14d2"]		= HTML.getUserInput(`w2-${index}-14d2`, "");
		inputs["15"]		= HTML.getUserInput(`w2-${index}-15`, "text");
		inputs["16"]		= HTML.getUserInput(`w2-${index}-16`, "");
		inputs["17"]		= HTML.getUserInput(`w2-${index}-17`, "");
		inputs["18"]		= HTML.getUserInput(`w2-${index}-18`, "");
		inputs["19"]		= HTML.getUserInput(`w2-${index}-19`, "");
		inputs["20"]		= HTML.getUserInput(`w2-${index}-20`, "text");
		
		if (!Objects.isUsed(inputs)) {
			return;
		}

		const w2 = Forms.createForm("W2");

		w2.lines["01"  ].user_value	= inputs["01"];
		w2.lines["02"  ].user_value	= inputs["02"];
		w2.lines["03"  ].user_value	= inputs["03"];
		w2.lines["04"  ].user_value	= inputs["04"];
		w2.lines["05"  ].user_value	= inputs["05"];
		w2.lines["06"  ].user_value	= inputs["06"];
		w2.lines["07"  ].user_value	= inputs["07"];
		w2.lines["08"  ].user_value	= inputs["08"];
		w2.lines["09"  ].user_value	= inputs["09"];
		w2.lines["10"  ].user_value	= inputs["10"];
		w2.lines["11"  ].user_value	= inputs["11"];
		w2.lines["12a1"].user_value	= inputs["12a1"];
		w2.lines["12a2"].user_value	= inputs["12a2"];
		w2.lines["12b1"].user_value	= inputs["12b1"];
		w2.lines["12b2"].user_value	= inputs["12b2"];
		w2.lines["12c1"].user_value	= inputs["12c1"];
		w2.lines["12c2"].user_value	= inputs["12c2"];
		w2.lines["12d1"].user_value	= inputs["12d1"];
		w2.lines["12d2"].user_value	= inputs["12d2"];
		w2.lines["13a" ].user_value	= inputs["13a"];
		w2.lines["13b" ].user_value	= inputs["13b"];
		w2.lines["13c" ].user_value	= inputs["13c"];
		w2.lines["14a1"].user_value	= inputs["14a1"];
		w2.lines["14a2"].user_value	= inputs["14a2"];
		w2.lines["14b1"].user_value	= inputs["14b1"];
		w2.lines["14b2"].user_value	= inputs["14b2"];
		w2.lines["14c1"].user_value	= inputs["14c1"];
		w2.lines["14c2"].user_value	= inputs["14c2"];
		w2.lines["14d1"].user_value	= inputs["14d1"];
		w2.lines["14d2"].user_value	= inputs["14d2"];
		w2.lines["15"  ].user_value	= inputs["15"];
		w2.lines["16"  ].user_value	= inputs["16"];
		w2.lines["17"  ].user_value	= inputs["16"];
		w2.lines["18"  ].user_value	= inputs["18"];
		w2.lines["19"  ].user_value	= inputs["19"];
		w2.lines["20"  ].user_value	= inputs["20"];
	}

	constructor(formname) {
		Debug.enter("W2.Constructor()");
		super(formname);

		this.isSingleton = false;

		this.lines["01"]	= new Line("Wages");
		this.lines["02"]	= new Line("Federal Tax Withheld");
		this.lines["03"]	= new Line("Social Security Wages");
		this.lines["04"]	= new Line("Social Security Tax Withheld");
		this.lines["05"]	= new Line("Medicare Wages");
		this.lines["06"]	= new Line("Medicare Tax Withheld");
		this.lines["07"]	= new Line("Social Security Tips");
		this.lines["08"]	= new Line("Allocated Tips");
		this.lines["09"]	= new Line("Not Used");
		this.lines["10"]	= new Line("Dependent Care Benefits");
		this.lines["11"]	= new Line("Nonqualified Plans");
		this.lines["12a1"]	= new Line("Option A");
		this.lines["12a2"]	= new Line("Option A");
		this.lines["12b1"]	= new Line("Option B");
		this.lines["12b2"]	= new Line("Option B");
		this.lines["12c1"]	= new Line("Option C");
		this.lines["12c2"]	= new Line("Option C");
		this.lines["12d1"]	= new Line("Option D");
		this.lines["12d2"]	= new Line("Option D");
		this.lines["13a"]	= new Line("Statuatory Employee");
		this.lines["13b"]	= new Line("Retirement Plan");
		this.lines["13c"]	= new Line("Third-Party Sick Plan");
		this.lines["14a1"]	= new Line("Other A");
		this.lines["14a2"]	= new Line("Other A");
		this.lines["14b1"]	= new Line("Other B");
		this.lines["14b2"]	= new Line("Other B");
		this.lines["14c1"]	= new Line("Other C");
		this.lines["14c2"]	= new Line("Other C");
		this.lines["14d1"]	= new Line("Other D");
		this.lines["14d2"]	= new Line("Other D");
		this.lines["15"]	= new Line("State Identification");
		this.lines["16"]	= new Line("State Wages");
		this.lines["17"]	= new Line("State Tax Withheld");
		this.lines["18"]	= new Line("Local Wages");
		this.lines["19"]	= new Line("Local Tax Withheld");
		this.lines["20"]	= new Line("Locality Name");

		Debug.exit("W2.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("W2.calculate()");
		this.calculated = true;
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
