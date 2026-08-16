
import { HTML }			from "../Library/Classes/HTML.js";
import { TaxFormName }	from "../Library/Classes/TaxFormName.js";
import { TaxFormObj }	from "../Library/Classes/TaxFormObj.js";
import { TaxFormWeb }	from "../Library/Classes/TaxFormWeb.js";
	
import { W2 }			from "../Library/TaxForms/W2.js";
import { F1040 }		from "../Library/TaxForms/F1040.js";
import { Template }		from "../Library/TaxForms/Template.js";

function addForm(form_name) {
	let form_id;
	let html;
	let uid;	// Unique ID

	const output_form_area = document.getElementById("insert-output-forms-here");

	try {
		switch (form_name) {
			case "W2":
				TaxFormName.createInputPage(form_name);
				break;
		
			case "F1040":
				let f1040	= TaxFormObj.createForm("F1040");
				uid			= TaxFormName.getUID(form_name);
				html		= f1040.getOutputHTML(uid);
				output_form_area.insertAdjacentHTML("beforeend", html);
				break;
		
			case "F1040SC":
				// Display as input form.
				TaxFormName.createInputPage(form_name);

				// Display as output form.
				let f1040sc	= TaxFormObj.createForm("F1040SC");
				uid			= TaxFormName.getUID(form_name);
				html		= f1040sc.getOutputHTML(uid);
				output_form_area.insertAdjacentHTML("beforeend", html);
				break;
				
			case "Template":
				TaxFormName.createInputPage(form_name);
				break;
		}
	} catch (err) {
		HTML.putElementValue("error-message-output", err);
		document.getElementById("error-message-output").scrollIntoView({behavior: 'smooth', block: 'start'});
	}
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
