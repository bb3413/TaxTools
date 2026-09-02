
//
// This module provides utilities to manage the names of forms.
//
import { TaxFormWeb }	from "../Classes/TaxFormWeb.js";

// Tax Forms
import { F1040 }		from "../TaxForms/F1040.js";
import { F1040S1 }		from "../TaxForms/F1040S1.js";
import { F1040S1A }		from "../TaxForms/F1040S1A.js";
import { F1040S2 }		from "../TaxForms/F1040S2.js";
import { F1040S3 }		from "../TaxForms/F1040S3.js";
import { F1040SA }		from "../TaxForms/F1040SA.js";
//import { F1040SB }	from "../TaxForms/F1040SB.js";
import { F1040SC }		from "../TaxForms/F1040SC.js";
//import { F1040SD }	from "../TaxForms/F1040SD.js";
//import { F1040SE }	from "../TaxForms/F1040SE.js";
import { F1040SSE }		from "../TaxForms/F1040SSE.js";	// Self-employment Tax
//import { F1041 }		from "../TaxForms/F1041.js";
//import { F1065B }		from "../TaxForms/F1065B.js";
//import { F1098 }		from "../TaxForms/F1098.js";
//import { F1098E }		from "../TaxForms/F1098E.js";
//import { F1098T }		from "../TaxForms/F1098T.js";
//import { F1099B }		from "../TaxForms/F1099B.js";
import { F1099C }		from "../TaxForms/F1099C.js";
import { F1099DIV }		from "../TaxForms/F1099DIV.js";
import { F1099G }		from "../TaxForms/F1099G.js";
import { F1099INT }		from "../TaxForms/F1099INT.js";
import { F1099K }		from "../TaxForms/F1099K.js";
//import { F1099LTC }	from "../TaxForms/F1099LTC.js";
import { F1099MISC }	from "../TaxForms/F1099MISC.js";
import { F1099NEC }		from "../TaxForms/F1099NEC.js";
import { F1099OID }	from "../TaxForms/F1099OID.js";
import { F1099R }		from "../TaxForms/F1099R.js";
import { F1099S }		from "../TaxForms/F1099S.js";
//import { F1120S }		from "../TaxForms/F1120S.js";
//import { F2441 }		from "../TaxForms/F2441.js";
import { F540 }			from "../TaxForms/F540.js";			// California Income Tax
import { F540CA }		from "../TaxForms/F540CA.js";		// California Adjustments
import { F6251 }		from "../TaxForms/F6251.js";		// AMT worksheet
import { F7206 }		from "../TaxForms/F7206.js";		// Self-employment Health Ins
import { SSA1099 }		from "../TaxForms/SSA1099.js";
import { W2 }			from "../TaxForms/W2.js";

// Worksheets
import { IncTax }		from "../Worksheets/IncTax.js";
import { SalesTax }		from "../Worksheets/SalesTax.js";
import { SSTax }		from "../Worksheets/SSTax.js";
import { Refund }		from "../Worksheets/Refund.js";

// California Worksheets
import { CA_HiIncDeductions }	from "../Worksheets/CA_HiIncDeductions.js";
import { CA_HiIncExemptions }	from "../Worksheets/CA_HiIncExemptions.js";

const CLASS_NAME	= 0;
const INPUT			= 1;
const OUTPUT		= 2;
const SINGLETON		= 3;
const ON_DEMAND		= 4;

const forms_map = {
	//																Create
	// Name					Class			Input	Output	Single	on Demand
	"F1040":				[ F1040,		false,	true,	true,	true	],
	"F1040S1":				[ F1040S1,		false,	true,	true,	true	],
	"F1040S1A":				[ F1040S1A,		false,	true,	true,	true	],
	"F1040S2":				[ F1040S2,		false,	true,	true,	true	],
	"F1040S3":				[ F1040S3,		false,	true,	true,	true	],
	"F1040SA":				[ F1040SA,		false,	true,	true,	true	],
//	"F1040SB":				[ F1040SB,		false,	true,	true,	false	],
	"F1040SC":				[ F1040SC,		true,	true,	false,	false	],
//	"F1040SD":				[ F1040SD,		false,	true,	true,	false	],
//	"F1040SE":				[ F1040SE,		false,	true,	true,	false	],
	"F1040SSE":				[ F1040SSE,		false,	true,	false,	true	],
//	"F1041":				[ F1041,		true,	false,	false,	false	],
//	"F1065B":				[ F1065B,		true,	false,	false,	false	],
//	"F1098":				[ F1098,		true,	false,	false,	false	],
//	"F1098E":				[ F1098E,		true,	false,	false,	false	],
//	"F1098T":				[ F1098T,		true,	false,	false,	false	],
//	"F1099B":				[ F1099B,		true,	false,	false,	false	],
	"F1099C":				[ F1099C,		true,	false,	false,	false	],
	"F1099DIV":				[ F1099DIV,		true,	false,	false,	false	],
	"F1099G":				[ F1099G,		true,	false,	false,	false	],
	"F1099INT":				[ F1099INT,		true,	false,	false,	false	],

	// Name					Class			Input	Output	Single	Create on Demand
	"F1099K":				[ F1099K,		true,	false,	false,	false	],
//	"F1099LTC":				[ F1099LTC,		true,	false,	false,	false	],
	"F1099MISC":			[ F1099MISC,	true,	false,	false,	false	],
	"F1099NEC":				[ F1099NEC,		true,	false,	false,	false	],
	"F1099OID":				[ F1099OID,		true,	false,	false,	false	],
	"F1099R":				[ F1099R,		true,	false,	false,	false	],
	"F1099S":				[ F1099S,		true,	false,	false,	false	],
//	"F1120S":				[ F1120S,		true,	false,	false,	false	],
//	"F2441":				[ F2441,		false,	true,	true,	false	],
	"F540":					[ F540,			false,	true,	true,	true	],
	"F540CA":				[ F540CA,		false,	true,	true,	true	],
	"F6251":				[ F6251,		false,	true,	true,	false	],
	"F7206":				[ F7206,		false,	true,	true,	false	],
	"SSA1099":				[ SSA1099,		true,	false,	false,	false	],
	"W2":					[ W2,			true,	false,	false,	false	],

	// Worksheets
	// Name					Class			Input	Output	Single	Create on Demand
	"IncTax":				[ IncTax,		false,	true,	true,	true	],
	"Refund":				[ Refund,		false,	true,	true,	true	],
	"SalesTax":				[ SalesTax,		false,	true,	true,	true	],
	"Simple":				[ SalesTax,		false,	true,	false,	true	],
	"SSTax":				[ SSTax,		false,	true,	false,	true	],

	// California Worksheets
	"CA_HiIncDeductions":	[ CA_HiIncDeductions,	false,	true,	true,	true	],
	"CA_HiIncExemptions":	[ CA_HiIncDeductions,	false,	true,	true,	true	],
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

export class TaxFormName {
	
	static createForm(formname, uid) {
		// This method allows you to call the static method createForm() by formname.
		switch (formname) {
			case "F1040SC":		return F1040SC.createForm(uid);
			case "F1099C":		return F1099C.createForm(uid);
			case "F1099DIV":	return F1099DIV.createForm(uid);
			case "F1099G":		return F1099G.createForm(uid);
			case "F1099INT":	return F1099INT.createForm(uid);
			case "F1099K":		return F1099K.createForm(uid);
			case "F1099MISC":	return F1099MISC.createForm(uid);
			case "F1099NEC":	return F1099NEC.createForm(uid);
			case "F1099OID":	return F1099OID.createForm(uid);
			case "F1099R":		return F1099R.createForm(uid);
			case "F1099S":		return F1099S.createForm(uid);
			case "SSA1099":		return SSA1099.createForm(uid);
			case "W2":			return W2.createForm(uid);
			default:
				throw new Error(`TaxFormName.createForm(): unplemented form: ${formname}`);
		}
	}

	static createOnDemand(formname) {
		// When getValue() or getTextValue() is called, the default is to return 0 or "" if
		// the form has not been created. However, some forms get input from other forms and
		// need to be created and calculated before the value is returned. This array lists
		// those forms
		if (forms_map[formname]) {
			return forms_map[formname][ON_DEMAND];
		} else {
			return false;
		}
	}

	static getClass(formname) {
		if (forms_map[formname]) {
			return forms_map[formname][CLASS_NAME];
		} else {
			return undefined;
		}
	}

	static getInputHTML(formname, uid) {
		// This method allows you to call the static method getInputHTML() by formname.
		switch (formname) {
			case "F1040SC":		return F1040SC.getInputHTML(uid);
			case "F1099C":		return F1099C.getInputHTML(uid);
			case "F1099DIV":	return F1099DIV.getInputHTML(uid);
			case "F1099G":		return F1099G.getInputHTML(uid);
			case "F1099INT":	return F1099INT.getInputHTML(uid);
			case "F1099K":		return F1099K.getInputHTML(uid);
			case "F1099MISC":	return F1099MISC.getInputHTML(uid);
			case "F1099NEC":	return F1099NEC.getInputHTML(uid);
			case "F1099OID":	return F1099OID.getInputHTML(uid);
			case "F1099R":		return F1099R.getInputHTML(uid);
			case "F1099S":		return F1099S.getInputHTML(uid);
			case "SSA1099":		return SSA1099.getInputHTML(uid);
			case "W2":			return W2.getInputHTML(uid);
			default:
				throw new Error(`TaxFormName.getInputHTML(): unplemented form: ${formname}`);
		}
	}

	static getUserInput(formname, uid) {
		// This method allows you to call the static method getUserInput() by formname.
		switch (formname) {
			case "F1040SC":		return F1040SC.getUserInput(uid);
			case "F1099C":		return F1099C.getUserInput(uid);
			case "F1099DIV":	return F1099DIV.getUserInput(uid);
			case "F1099G":		return F1099G.getUserInput(uid);
			case "F1099INT":	return F1099INT.getUserInput(uid);
			case "F1099K":		return F1099K.getUserInput(uid);
			case "F1099MISC":	return F1099MISC.getUserInput(uid);
			case "F1099NEC":	return F1099NEC.getUserInput(uid);
			case "F1099OID":	return F1099OID.getUserInput(uid);
			case "F1099R":		return F1099R.getUserInput(uid);
			case "F1099S":		return F1099S.getUserInput(uid);
			case "SSA1099":		return SSA1099.getUserInput(uid);
			case "W2":			return W2.getUserInput(uid);
			default:
				throw new Error(`TaxFormName.getUserInput(): unplemented form: ${formname}`);
		}
	}

	static saveUserInput(formname, uid) {
		// This method allows you to call the static method getUserInput() by formname.
		switch (formname) {
			case "F1040SC":		return F1040SC.saveUserInput(uid);
			case "F1099C":		return F1099C.saveUserInput(uid);
			case "F1099DIV":	return F1099DIV.saveUserInput(uid);
			case "F1099G":		return F1099G.saveUserInput(uid);
			case "F1099INT":	return F1099INT.saveUserInput(uid);
			case "F1099K":		return F1099K.saveUserInput(uid);
			case "F1099MISC":	return F1099MISC.saveUserInput(uid);
			case "F1099NEC":	return F1099NEC.saveUserInput(uid);
			case "F1099OID":	return F1099OID.saveUserInput(uid);
			case "F1099R":		return F1099R.saveUserInput(uid);
			case "F1099S":		return F1099S.saveUserInput(uid);
			case "SSA1099":		return SSA1099.saveUserInput(uid);
			case "W2":			return W2.saveUserInput(uid);
			default:
				throw new Error(
					`TaxFormName.saveUserInput(): unplemented form: ${formname}`);
		}
	}

	static isSingleton(formname) {
		if (forms_map[formname]) {
			return forms_map[formname][SINGLETON];
		} else {
			return true;
		}
	}

	static isInputForm(formname) {
		if (forms_map[formname]) {
			return forms_map[formname][INPUT];
		} else {
			return false;
		}
	}

	static isOutputForm(formname) {
		if (forms_map[formname]) {
			return forms_map[formname][OUTPUT];
		} else {
			return false;
		}
	}

	static listAllForms(){
		// Return array with the names of the suported tax forms and worksheets.
		/// The debug module uses this as a list of keywords.
		return Object.keys(forms_map);
	}

	static printOrder() {
		// Used by TaxFormObj.formsInPrintOrder().
		return print_order;
	}
}
