
//
// This is a class with static properties and methods (global) that manages all the
// forms that have been created.
//
import { Debug }			from "../Classes/Debug.js";

// Tax Forms
import { F1040 }			from "../Forms/F1040.js";
import { F1040S1 }			from "../Forms/F1040S1.js";
import { F1040S1A }			from "../Forms/F1040S1A.js";
import { F1040S2 }			from "../Forms/F1040S2.js";
import { F1040S3 }			from "../Forms/F1040S3.js";
import { F1040SA }			from "../Forms/F1040SA.js";
import { F1040SC }			from "../Forms/F1040SC.js";
import { F1040SSE }			from "../Forms/F1040SSE.js";	// Self-employment Tax
import { F1099G }			from "../Forms/F1099G.js";
import { F540 }				from "../Forms/F540.js";		// California Income Tax
import { F540CA }			from "../Forms/F540CA.js";		// California Adjustments
import { F6251 }			from "../Forms/F6251.js";		// AMT worksheet
import { F7206 }			from "../Forms/F7206.js";		// Self-employment Health Insurance Deduction
import { W2 }				from "../Forms/W2.js";

// Worksheets
import { IncTax }			from "../Worksheets/IncTax.js";
import { SalesTax }			from "../Worksheets/SalesTax.js";
import { SSTax }			from "../Worksheets/SSTax.js";
import { Refund }			from "../Worksheets/Refund.js";

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
	"F1040SC":		F1040SC,
	"F1040SSE":		F1040SSE,
	"F1099G":		F1099G,
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

export class Forms {
	static reset() {
		instances		= {};
	}

	static addForm(formname, form) {
		if (!formname) {
			throw new Error("Forms.addForm: Form name is not set.");
		}

		let formlist = instances[formname];
		if (!formlist) {
			// This is the first form of this type.
			instances[formname] = [];
			formlist = instances[formname];
		}

		if ((formlist.length > 0) && (form.isSingleton)) {
			throw new Error(`Forms.addForm: Singleton form ${formname} already exists; cannot add.`)
			return;
		}

		formlist.push(form);
	}

	static calculateAll() {
		let f1040 = Forms.getForm("F1040");	// Do 1040 first if is exists.
		if (f1040 && f1040.modified) {
			f1040.calculate();
		}

		Forms.getAllForms().forEach(function(form) {
			if (form.modified) {
				form.calculate();
			}
		});
	}

	static createForm(formname) {
		const form_class = formsClassMap[formname];

		if (form_class) {
			return new form_class(formname);
		}

		return undefined;
	}

	static formNames(){
		// Get the names of all supported forms, whether they exist or not.
		return Object.keys(formsClassMap);
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

	static getForm(formname, index = 0) {
		// Get a form by type of form. If more than one fr of that type, you can specify the
		// index of the one you want.
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
		// This method will get a value from a tax form. If the form does not exist, it wll try to
		// create it. If it has not been calculated, it will be calculated. If the form has not been
		// implemented, zero will be returned. If there is more than one instance of the form, the lines
		// from all the instances are added together.
		Debug.enter(`Forms.getValue(${formname}, ${lineno})`);
		let sum = 0;
		let formlist = instances[formname];
		if (!formlist) {
			Forms.createForm(formname);	// Try to create; not an error if it fails.
			formlist = instances[formname];
		}

		if (formlist && formlist.length > 0) {
			formlist.forEach(function(form) {
				if (form.modified) {
					form.calculate();
				}
				for (let ln of lineno) {
					if (form.lines[ln] !== undefined) {
						sum += form.lines[ln].value;
					}
				}
			});
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
		if (!formlist) {
			Forms.createForm(formname);	// Try to create; not an error if it fails.
			formlist = instances[formname];
		}

		if (formlist && formlist.length > 0) {
			formlist.forEach(function(form) {
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
			});
		}
		Debug.exit(`Forms.getTextValue(${str})`);
		return str;
	}

	static toConsole() {
		let formlist = getAllFotms();
		formlist.forEach(function(form) {
			form.toConsole();
		});
	}
}
