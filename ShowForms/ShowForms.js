
import { HTML }			from "../Library/Classes/HTML.js";
import { TaxFormName }	from "../Library/Classes/TaxFormName.js";
import { TaxFormObj }	from "../Library/Classes/TaxFormObj.js";
import { TaxFormWeb }	from "../Library/Classes/TaxFormWeb.js";
	
import { W2 }			from "../Library/TaxForms/W2.js";
import { F1040 }		from "../Library/TaxForms/F1040.js";
import { Template }		from "../Library/TaxForms/Template.js";

function addForm(formname) {
	try {
		if (formname === "") {
			return;
		}

		// Add input forms.
		addInputForm(formname);

		// Add output forms.
		switch (formname) {
			case "W2":	break;
			default:
				addOutputForm(formname);
		}

	} catch (err) {
		HTML.putElementValue("error-message-output", err);
		document.getElementById("error-message-output").scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

function addInputForm(formname) {
	let form_id;
	let html;
	let uid;	// Unique ID

	uid = TaxFormWeb.getUID(formname);
	[ form_id, html ] = TaxFormName.getInputHTML(formname, uid);
	TaxFormWeb.addInputForm(form_id, html);
}

function addOutputForm(formname) {
	let form_id;
	let html;
	let uid;	// Unique ID
	let form;

	uid		= TaxFormWeb.getUID(formname);
	form	= TaxFormObj.createForm(formname);
	[ form_id, html ] = form.getOutputHTML(uid);
	TaxFormWeb.addOutputForm(form_id, html);
}

function changeHandler(event) {
}

document.addEventListener("DOMContentLoaded", () => {
	// HTML.addListener("tool-container", "change", changeHandler);
	addForm("W2");
	addForm("F1040");
	addForm("F1040SC");
	addForm("Template");
	HTML.closeAllDetails();
});
