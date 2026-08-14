
import { HTML }				from "../Library/Classes/HTML.js";
import { TaxFormWeb }		from "../Library/Classes/TaxFormWeb.js";
	
import { W2 }				from "../Library/TaxForms/W2.js";
import { F1040 }			from "../Library/TaxForms/F1040.js";
import { Template }			from "../Library/TaxForms/Template.js";

function addForm(form_name) {
	let form_id	= "";
	let html	= "";
	switch (form_name) {
		case "W-2":
			[ form_id, html ] = W2.getInputHTML(1);
			TaxFormWeb.addInputForm(form_id, html);
			break;
		
		case "1040":
			let f1040 = TaxFormObj.createForm("F1040");
			[ form_id, html ] = f1040.getOutputHTML();
			TaxFormWeb.addOutputForm(form_id, html);
			break;
				
		case "Template":
			[ form_id, html ] = Template.getInputHTML();
			TaxFormWeb.addOutputForm(form_id, html);
			break;
	}
}

function changeHandler(event) {
}

document.addEventListener("DOMContentLoaded", () => {
	HTML.addListener("tool-container", "change", changeHandler);
	addForm("W-2");
	addForm("1040");
	addForm("Template");
	HTML.closeAllDetails();
});
