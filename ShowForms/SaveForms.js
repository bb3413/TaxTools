
import { File }			from "../Library/Classes/File.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { TaxFormName }	from "../Library/Classes/TaxFormName.js";
import { TaxFormObj }	from "../Library/Classes/TaxFormObj.js";

const header = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="stylesheet" href=
		"https://www.bruceblinn.com/6-OtherStuff/Taxes/TaxToolsDev/Library/CSS/TaxTools.css" />
	<link rel="stylesheet" href=
		"https://www.bruceblinn.com/6-OtherStuff/Taxes/TaxToolsDev/Library/CSS/TaxForms.css" />
	<link rel="stylesheet" href=
		"https://www.bruceblinn.com/6-OtherStuff/Taxes/TaxToolsDev/Library/CSS/F1099.css" />
	<title>Save Tax Forms</title>
</head>

<body>
	<div class="tool-container" id="ToolContainer">
	<!---------------------------------------------------------------------------->
`;

const trailer = `
	<!---------------------------------------------------------------------------->
	</div>
</body>
</html>
`;

async function saveHandler(event) {
	try {
		for (const formname of TaxFormName.listAllForms()) {
			let html;
			let form_id;
			let page;

			try {
				// See if there is an input version of the form.
				[ form_id, html ] = TaxFormName.getInputHTML(formname, "XX");
				page = header + html.replace(/<details /g, "<details open ") + trailer;
				await File.saveToFile(page, `${formname}.html`, false);
			} catch {
				// Ignore the error.
			}

			// Find or create an object for the form.
			let form = TaxFormObj.getForm(formname) || TaxFormObj.createForm(formname);
			if (typeof form.getOutputHTML === "function") {
				// This is the output version of the form.
				[ form_id, html ] = form.getOutputHTML("XX");
				page = header + html.replace(/<details /g, "<details open ") + trailer;
				await File.saveToFile(page, `${formname}.html`, false);
			} else {
				// There is no output version; create one dynamically.
				// html = form.toHTML("XX");
				// page = header + html.replace(/<details /g, "<details open ") + trailer;
				// await File.saveToFile(page, `${formname}.html`, false);
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
	document.getElementById("save-button").addEventListener("click", saveHandler);
});
