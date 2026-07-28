
//
// This is a class with static properties and methods (global) that manages all the
// forms that have been created.
//
import { Debug }		from "../Classes/Debug.js";

// Tax Forms
import { F1040 }		from "../Forms/F1040.js";
import { F1040S1 }		from "../Forms/F1040S1.js";
import { F1040S1A }		from "../Forms/F1040S1A.js";
import { F1040S2 }		from "../Forms/F1040S2.js";
import { F1040S3 }		from "../Forms/F1040S3.js";
import { F1040SA }		from "../Forms/F1040SA.js";
import { F1040SB }		from "../Forms/F1040SB.js";
import { F1040SC }		from "../Forms/F1040SC.js";
import { F1040SD }		from "../Forms/F1040SD.js";
import { F1040SE }		from "../Forms/F1040SE.js";
import { F1040SSE }		from "../Forms/F1040SSE.js";	// Self-employment Tax
import { F1041 }		from "../Forms/F1041.js";
import { F1065B }		from "../Forms/F1065B.js";
import { F1098 }		from "../Forms/F1098.js";
import { F1098E }		from "../Forms/F1098E.js";
import { F1098T }		from "../Forms/F1098T.js";
import { F1099B }		from "../Forms/F1099B.js";
import { F1099C }		from "../Forms/F1099C.js";
import { F1099DIV }		from "../Forms/F1099DIV.js";
import { F1099G }		from "../Forms/F1099G.js";
import { F1099INT }		from "../Forms/F1099INT.js";
import { F1099K }		from "../Forms/F1099K.js";
import { F1099LTC }		from "../Forms/F1099LTC.js";
import { F1099MISC }	from "../Forms/F1099MISC.js";
import { F1099NEC }		from "../Forms/F1099NEC.js";
import { F1099OID }		from "../Forms/F1099OID.js";
import { F1099R }		from "../Forms/F1099R.js";
import { F1099S }		from "../Forms/F1099S.js";
import { F1120S }		from "../Forms/F1120S.js";
import { F2441 }		from "../Forms/F2441.js";
import { F540 }			from "../Forms/F540.js";		// California Income Tax
import { F540CA }		from "../Forms/F540CA.js";		// California Adjustments
import { F6251 }		from "../Forms/F6251.js";		// AMT worksheet
import { F7206 }		from "../Forms/F7206.js";		// Self-employment Health Insurance Deduction
import { W2 }			from "../Forms/W2.js";

// Worksheets
import { IncTax }		from "../Worksheets/IncTax.js";
import { SalesTax }		from "../Worksheets/SalesTax.js";
import { SSTax }		from "../Worksheets/SSTax.js";
import { Refund }		from "../Worksheets/Refund.js";

// California Worksheets
import { CA_HiIncDeductions }	from "../Worksheets/CA_HiIncDeductions.js";
import { CA_HiIncExemptions }	from "../Worksheets/CA_HiIncExemptions.js";

let instances	= {};	// This variable is indexed by form name. For each form, it
						// returns an array with all the instances of that form.

const formsClassMap = {	// Map the form names to the actual class references.
	// Tax Forms
	"F1040":		F1040,
	"F1040S1":		F1040S1,
	"F1040S1A":		F1040S1A,
	"F1040S2":		F1040S2,
	"F1040S3":		F1040S3,
	"F1040SA":		F1040SA,
	"F1040SB":		F1040SB,
	"F1040SC":		F1040SC,
	"F1040SD":		F1040SD,
	"F1040SE":		F1040SE,
	"F1040SSE":		F1040SSE,
	"F1041":		F1041,
	"F1065B":		F1065B,
	"F1098":		F1098,
	"F1098E":		F1098E,
	"F1098T":		F1098T,
	"F1099B":		F1099B,
	"F1099C":		F1099C,
	"F1099DIV":		F1099DIV,
	"F1099G":		F1099G,
	"F1099INT":		F1099INT,
	"F1099K":		F1099K,
	"F1099LTC":		F1099LTC,
	"F1099MISC":	F1099MISC,
	"F1099NEC":		F1099NEC,
	"F1099OID":		F1099OID,
	"F1099R":		F1099R,
	"F1099S":		F1099S,
	"F1120S":		F1120S,
	"F2441":		F2441,
	"F540":			F540,
	"F540CA":		F540CA,
	"F6251":		F6251,
	"F7206":		F7206,
	"W2":			W2,

	// Worksheets
	"IncTax":		IncTax,
	"Refund":		Refund,
	"SalesTax":		SalesTax,
	"Simple":		SalesTax,
	"SSTax":		SSTax,

	// California Worksheets
	"CA_HiIncDeductions":		CA_HiIncDeductions,
	"CA_HiIncExemptions":		CA_HiIncDeductions,
};

const print_order = [
	"F1040",
	"F1040S1",
	"F1040S1A",
	"F1040S2",
	"F1040S3",
	"F1040SA",
	"F1040SB",
	"F1040SC",
	"F1040SD",
	"F1040SE",
	"F1040SSE",
	"F1041",
	"F1065B",
	"F1120S",
	"F2441",
	"F6251",
	"F7206",
	"F540",
	"F540CA",
];

// When getValue() or getTextValue() is called, the default is to return 0 or "" if the
// form has not been created. However, some forms get input from other forms and need to
// be created and calculated before the value is returned. This array lists those forms.
const create_on_demand = [
	// Forms
	"F1040",
	"F1040S1",
	"F1040S1A",
	"F1040S2",
	"F1040S3",
	"F1040SA",
	"F1040SB",
	"F1040SC",
	"F1040SD",
	"F1040SE",
	"F1040SSE",
//	"F1041",
//	"F1065B",
//	"F1098",
//	"F1098E",
//	"F1098T",
//	"F1099B",
//	"F1099C",
//	"F1099DIV",
//	"F1099G",
//	"F1099INT",
//	"F1099K",
//	"F1099LTC",
//	"F1099MISC",
//	"F1099NEC",
//	"F1099OID",
//	"F1099R",
//	"F1099S",
//	"F1120S",
	"F2441",
	"F540",
	"F540CA",
	"F6251",
	"F7206",
//	"W2",

	// Worksheets
	"IncTax",
	"Refund",
	"SalesTax",
	"Simple",
	"SSTax",

	// California Worksheets
	"CA_HiIncDeductions",
	"CA_HiIncExemptions",
];

function addForm(formname, form) {
	if (!formname) {
		throw new Error("Forms addForm: Form name is not set.");
	}

	let formlist = instances[formname];
	if (!formlist) {
		// This is the first form of this type.
		instances[formname] = [];
		formlist = instances[formname];
	}

	if ((formlist.length > 0) && (form.isSingleton)) {
		throw new Error(`Forms addForm: Singleton form ${formname} already exists; cannot add.`)
		return;
	}

	formlist.push(form);
}

export class Forms {
	static reset() {
		instances		= {};
	}

	static createForm(formname) {
		const form_class = formsClassMap[formname];

		if (form_class) {
			const form = new form_class(formname);
			addForm(formname, form);
			return form;
		}

		return undefined;
	}

	static formsToPrint() {
		const forms = [];

		for (const formname of print_order) {
			let formlist = instances[formname];
			if (formlist) {
				for (const form of formlist) {
					forms.push(form);
				}
			}
		}

		return forms;
	}

	static getAllForms(formname = "") {
		// Get all the form objects that have been created, or all the forms of a particular type.
		let all_forms	= [];
		let formnames	= [];

		if (formname) {
			formnames = [ formname ];
		} else {
			formnames = Object.keys(instances);
		}

		for (const formname of formnames) {
			let formlist = instances[formname];
			for (const form of formlist) {
				all_forms.push(form);
			}
		}
		return all_forms;
	}

	static getClass(class_name) {
		return formsClassMap[class_name];
	}

	static getForm(formname, index = 0) {
		//
		// Get an instance of a form. If it has not been created, undefined will be returned.
		//
		let formlist = instances[formname];
		let instance = undefined;

		if (!formlist) {
			// Return undefined.
			// throw new Error(`Forms.getForm: Form ${formname} not found.`);
		} else {
			if (formlist.length === 0) {
				// Return undefined.
				// throw new Error(`Forms.getForm: No instances of form ${formname}.`);
			} else if ((formlist.length-1) < index) {
				throw new Error(`Forms.getForm: Index (${index}) is > last instance of form.`);
			} else {
				instance = formlist[index];
			}
		}

		return instance;
	}

	static getValue(formname, ...lineno) {
		// This method will get a value from a tax form. If the form does not exist, it wlll try to
		// create it. If it has not been calculated, it will be calculated. If the form has not been
		// implemented, zero will be returned. If there is more than one instance of the form, the lines
		// from all the instances are added together.
		Debug.enter(`Forms.getValue(${formname}, ${lineno})`);
		let sum = 0;
		let formlist = instances[formname];
		if (!formlist && create_on_demand.includes(formname)) {
			// Try to create; not an error if it fails; it may be a form that is not implemented yet.
			Forms.createForm(formname);
			formlist = instances[formname];
		}

		if (formlist) {
			for (const form of formlist) {
				if (form.modified) {
					form.calculate();
				}
				for (let ln of lineno) {
					if (form.lines[ln] !== undefined) {
						sum += form.lines[ln].value;
					}
				}
			}
		}
		Debug.exit(`Forms.getValue(${sum})`);
		return sum;
	}

	static getTextValue(formname, ...lineno) {
		// This method will get a text value from a tax form. If the form does not exist, it wll try to
		// create it. If it has not been calculated, it will be calculated. If the form has not been
		// implemented, "" will be returned. If there is more than one instance of the form, the lines
		// from all the instances are concatinated together.
		Debug.enter(`Forms.getTextValue(${formname}, ${lineno})`);
		let str = "";
		let formlist = instances[formname];
		if (!formlist && create_on_demand.includes(formname)) {
			// Try to create; not an error if it fails; it may be a form that is not implemented yet.
			Forms.createForm(formname);
			formlist = instances[formname];
		}

		if (formlist) {
			for (const form of formlist) {
				if (form.modified) {
					form.calculate();
				}
				for (let ln of lineno) {
					if (form.lines[ln] !== undefined) {
						if (str) {
							str += " ";
						}
						str += form.lines[ln].value;
					}
				}
			}
		}
		Debug.exit(`Forms.getTextValue(${str})`);
		return str;
	}

	static listAllForms(){
		// Return array with the names of all suported tax forms and worksheets.
		return Object.keys(formsClassMap);
	}

	static listAllTaxForms(){
		const tax_forms = [];

		// Return array with the names of the suported tax forms.
		for (const name of Object.keys(formsClassMap)) {
			if (name.startsWith("F") || name === "W2") {
				tax_forms.push(name);
			}
		}

		return tax_forms;
	}

	static listAllWorksheets(){
		// Return array with the names of the suported worksheets.
		for (const name of Object.keys(formsClassMap)) {
			if (!name.startsWith("F") && name !== "W2") {
				tax_forms.push(name);
			}
		}
	}

	static toConsole() {
		let formlist = getAllFotms();
		for (const form of formlist) {
			form.toConsole();
		}
	}
}
