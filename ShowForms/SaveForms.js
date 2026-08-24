
import { File }			from "../Library/Classes/File.js";
import { HTML }			from "../Library/Classes/HTML.js";
import { TaxFormName }	from "../Library/Classes/TaxFormName.js";
import { TaxFormObj }	from "../Library/Classes/TaxFormObj.js";
import { TaxFormWeb }	from "../Library/Classes/TaxFormWeb.js";

const header = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel="stylesheet" href="https://www.bruceblinn.com/6-OtherStuff/Taxes/TaxToolsDev/Library/CSS/TaxTools.css" />
	<link rel="stylesheet" href="https://www.bruceblinn.com/6-OtherStuff/Taxes/TaxToolsDev/Library/CSS/TaxForms.css" />
	<title>Tax Form Template</title>
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

function saveHandler(event) {
	try {
		for (const formname of TaxFormName.listAllForms()) {
			let html;
			let form_id;

			let form = TaxFormObj.getForm(formname) || TaxFormObj.createForm(formname);
			if (typeof form.getOutputHTML === "function") {
				[ form_id, html ] = form.getOutputHTML("XX");
			} else {
				html = form.toHTML("XX");
			}

			let page = header + html.replace(/^/gm, "\t\t") + trailer;
			File.saveToFile(page, `${formname}.html`, false);
		}
	} catch (error) {
		HTML.putElementValue("error-message-output", error);
		console.log("Stack trace:", error.stack);
		document.getElementById("error-message-output").scrollIntoView({behavior: 'smooth', block: 'start'});
	}
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("save-button").addEventListener("click", saveHandler);
});
