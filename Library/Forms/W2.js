
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Forms }	from "../Classes/Forms.js";
import { HTML }		from "../Classes/HTML.js";
import { Line }		from "../Classes/Line.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

const FIELDS = [
	// Line		Element
	// Number	Name
	[ "01", 	"Wages" ],
	[ "02", 	"FederalTaxWithheld" ],
	[ "03", 	"SocialSecurityWages" ],
	[ "04", 	"SocialSecurityTaxWithheld" ],
	[ "05", 	"MedicareWages" ],
	[ "06", 	"MedicareTaxWithheld" ],
	[ "07", 	"SocialSecurityTips" ],
	[ "08", 	"AllocatedTips" ],
	[ "09", 	"NotUsed" ],
	[ "10", 	"DependentCareBenefits" ],
	[ "11", 	"NonqualifiedPlans" ],
	[ "12a", 	"OptionA" ],
	[ "12b", 	"OptionB" ],
	[ "12c", 	"OptionC" ],
	[ "12d", 	"OptionD" ],
	[ "13a", 	"StatuatoryEmployee" ],
	[ "13b", 	"RetirementPlan" ],
	[ "13c", 	"TPartySickPlan" ],
	[ "14a", 	"OtherA" ],
	[ "14b", 	"OtherB" ],
	[ "14c", 	"OtherC" ],
	[ "14d", 	"OtherD" ],
	[ "15", 	"StateIdentification" ],
	[ "16", 	"StateWages" ],
	[ "17", 	"StateTaxWithheld" ],
	[ "18", 	"LocalWages" ],
	[ "19", 	"LocalTaxWithheld" ],
	[ "20", 	"LocalityName" ],
];

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
		this.lines["12a"]	= new Line("Option A");
		this.lines["12b"]	= new Line("Option B");
		this.lines["12c"]	= new Line("Option C");
		this.lines["12d"]	= new Line("Option D");
		this.lines["13a"]	= new Line("Statutory Employee");
		this.lines["13b"]	= new Line("Retirement Plan");
		this.lines["13c"]	= new Line("Third-party Sick Pay");
		this.lines["14a"]	= new Line("Other A");
		this.lines["14b"]	= new Line("Other B");
		this.lines["14c"]	= new Line("Other C");
		this.lines["14d"]	= new Line("Other D");
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

	static listFields() {
		const fields = [];

		FIELDS.forEach(function(field) {
			fields.push(field);
		});

		return fields;
	}
}
