
//
// This module is used when you need to call one of the tax form classes by name.
//

// Tax Forms
import { F1040 }		from "../TaxForms/F1040.js";
import { F1040S1 }		from "../TaxForms/F1040S1.js";
import { F1040S1A }		from "../TaxForms/F1040S1A.js";
import { F1040S2 }		from "../TaxForms/F1040S2.js";
import { F1040S3 }		from "../TaxForms/F1040S3.js";
import { F1040SA }		from "../TaxForms/F1040SA.js";
import { F1040SB }		from "../TaxForms/F1040SB.js";
import { F1040SC }		from "../TaxForms/F1040SC.js";
import { F1040SD }		from "../TaxForms/F1040SD.js";
import { F1040SE }		from "../TaxForms/F1040SE.js";
import { F1040SSE }		from "../TaxForms/F1040SSE.js";	// Self-employment Tax
import { F1041 }		from "../TaxForms/F1041.js";
import { F1065B }		from "../TaxForms/F1065B.js";
import { F1098 }		from "../TaxForms/F1098.js";
import { F1098E }		from "../TaxForms/F1098E.js";
import { F1098T }		from "../TaxForms/F1098T.js";
import { F1099B }		from "../TaxForms/F1099B.js";
import { F1099C }		from "../TaxForms/F1099C.js";
import { F1099DIV }		from "../TaxForms/F1099DIV.js";
import { F1099G }		from "../TaxForms/F1099G.js";
import { F1099INT }		from "../TaxForms/F1099INT.js";
import { F1099K }		from "../TaxForms/F1099K.js";
import { F1099LTC }		from "../TaxForms/F1099LTC.js";
import { F1099MISC }	from "../TaxForms/F1099MISC.js";
import { F1099NEC }		from "../TaxForms/F1099NEC.js";
import { F1099OID }		from "../TaxForms/F1099OID.js";
import { F1099R }		from "../TaxForms/F1099R.js";
import { F1099S }		from "../TaxForms/F1099S.js";
import { F1120S }		from "../TaxForms/F1120S.js";
import { F2441 }		from "../TaxForms/F2441.js";
import { F540 }			from "../TaxForms/F540.js";			// California Income Tax
import { F540CA }		from "../TaxForms/F540CA.js";		// California Adjustments
import { F6251 }		from "../TaxForms/F6251.js";		// AMT worksheet
import { F7206 }		from "../TaxForms/F7206.js";		// Self-employment Health Insurance Deduction
import { W2 }			from "../TaxForms/W2.js";

// Worksheets
import { IncTax }		from "../Worksheets/IncTax.js";
import { SalesTax }		from "../Worksheets/SalesTax.js";
import { SSTax }		from "../Worksheets/SSTax.js";
import { Refund }		from "../Worksheets/Refund.js";

// California Worksheets
import { CA_HiIncDeductions }	from "../Worksheets/CA_HiIncDeductions.js";
import { CA_HiIncExemptions }	from "../Worksheets/CA_HiIncExemptions.js";

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

export class ClassByName {
	static getClass(class_name) {
		return formsClassMap[class_name];
	}

	static listAllForms(){
		// Return array with the names of all suported tax forms and worksheets.
		return Object.keys(formsClassMap);
	}
}
