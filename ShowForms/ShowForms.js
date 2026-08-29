
import { HTML }			from "../Library/Classes/HTML.js";
import { TaxFormName }	from "../Library/Classes/TaxFormName.js";
import { TaxFormObj }	from "../Library/Classes/TaxFormObj.js";
import { TaxFormWeb }	from "../Library/Classes/TaxFormWeb.js";
import { Template }		from "../Library/TaxForms/Template.js";

function addInputForm(formname) {
	let uid = TaxFormWeb.getUID(formname);
	let [ taxform_id, html ] = TaxFormName.getInputHTML(formname, uid);
	TaxFormWeb.addInputForm(taxform_id, html);
}

function addOutputForm(formname) {
	let taxform_id;
	let taxform_html;

	let uid		= TaxFormWeb.getUID(formname);
	let form	= TaxFormObj.createForm(formname);

	if (typeof form.getOutputHTML === "function") {
		[ taxform_id, taxform_html ] = form.getOutputHTML(uid);
	} else {
		uid				= "XX";
		taxform_id		= `${formname}-${uid}-details`;
		taxform_html	= form.toHTML(uid);

	}

	TaxFormWeb.addOutputForm(taxform_id, taxform_html);
}

function showHandler(event) {
	try {
		let [ taxform_id, taxform_html ] = Template.getInputHTML("XX");
		let element = document.getElementById("input-forms-container");
		element.insertAdjacentHTML("beforebegin", taxform_html);

		let taxform = new Template("Template");
		[ taxform_id, taxform_html ] = taxform.getOutputHTML("XX");
		element = document.getElementById("output-forms-container");
		element.insertAdjacentHTML("beforebegin", taxform_html);

		for (const formname of TaxFormName.listAllForms()) {
			console.log(`Showing ${formname}`);
			if (TaxFormName.isInputForm(formname)) {
				addInputForm(formname);
			}

			if (TaxFormName.isOutputForm(formname)) {
				addOutputForm(formname);
			}
		}
	} catch (error) {
		HTML.putElementValue("error-message-output", error);
   		console.log("Stack trace:", error.stack);
		document.getElementById("error-message-output")
			.scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	showHandler();
});
