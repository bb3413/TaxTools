
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

		for (const field of FIELDS) {
			const lineno	= field[0];
			const name		= field[1];
			this.lines[lineno] = new Line(Str.camelCaseToEnglish(name));
		};

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

		for (const field of FIELDS) {
			fields.push(field);
		}

		return fields;
	}
}
