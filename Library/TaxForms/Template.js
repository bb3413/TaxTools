
import { Debug }		from "../Classes/Debug.js";
import { Line }			from "../Classes/Line.js";
import { TaxForm }		from "../Classes/TaxForm.js";
import { TaxFormObj }	from "../Classes/TaxFormObj.js";
import { TaxTable }		from "../Classes/TaxTable.js";
import { Taxpayer }		from "../Classes/Taxpayer.js";

const HTML_FORM = `
		<details class="taxform-details" id="template-XX-details">
			<summary class="taxform-summary">Template - Template Title</summary>
			<div class="taxform-container">
				<div>&nbsp;</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno">01a</p>
					<p class="description">Xxxxxxxxxxxxxxxxxxxxxx</p>
					<p class="lineno">01a</p>
					<input class="output-field" readonly type="text" id="template-XX-01a" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-value">
					<p class="lineno">02a</p>
					<p class="description">Xxxxxxxxxxxxxxxxxxxxxx</p>
					<p class="lineno">02a</p>
					<input class="output-field" readonly type="text" id="template-XX-02a" size="10" placeholder="0" />
					<p class="notused"></p>
					<p class="notused"></p>
				</div>
				<div class="taxform-lno-desc-lno-value-label-lno-value">
					<p class="lineno">03a</p>
					<p class="description">Xxxxxxxxxxxxxxxxxxxxxx</p>
					<p class="lineno">03a</p>
					<input class="output-field" readonly type="text" id="template-XX-032a" size="10" placeholder="0" />
					<p class="label">Xxxxxxxxxxxxxxxxxxxxxx</p>
					<p class="lineno">03b</p>
					<input class="output-field" readonly type="text" id="template-XX-03b" size="10" placeholder="0" />
				</div>
				<div>&nbsp;</div>
			</div>
		</details>
`;

export class Template extends TaxForm {
	static getInputHTML(uid) {
		if (!uid) {
			throw new Error(`Template.getInputHTML(): UID is undefined.`);
		}

		let html = HTML_FORM.replace(/XX/g, uid)
							.replace(/readonly/g, "")
							.replace(/output-color/g, "")
							.replace(/output-field/g, "input-field");

		return [ `template-${uid}-details`, html ];
	}

	static getUserInput(uid) {
		//
		// Create a new template instance and initialize it with information from the template web page.
		//
		if (!uid) {
			throw new Error(`Template.getUserInput(): UID is undefined.`);
		}

		const element = document.getElementById(`template-${uid}-details`);
		if (!element) {
			throw new Error(`Template.getUserInput(): Element not found: template-${uid}-details`);
		}

		let inputs = {};

		inputs["01"]		= HTML.getUserInput(`template-${uid}-01`, "");
		inputs["02"]		= HTML.getUserInput(`template-${uid}-02`, "");
		inputs["03a"]		= HTML.getUserInput(`template-${uid}-03a`, "");
		inputs["03b"]		= HTML.getUserInput(`template-${uid}-03b`, "");
		
		if (!Objects.isUsed(inputs)) {
			return;
		}

		const template = TaxFormObj.createForm("Template");

		template.lines["01"  ].user_value	= inputs["01"];
		template.lines["02"  ].user_value	= inputs["02"];
		template.lines["03a" ].user_value	= inputs["03a"];
		template.lines["03b" ].user_value	= inputs["03b"];
	}

	constructor(formname) {
		Debug.enter("Template.Constructor()");
		super(formname);

		this.lines["01"]	= new Line("");
		this.lines["02"]	= new Line("");
		this.lines["03a"]	= new Line("");
		this.lines["03b"]	= new Line("");

		Debug.exit("Template.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("Template.calculate()");
		this.calculated = true;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		this.lines["01"].value	= 0;	//
		this.lines["02"].value	= 0;	//
		this.lines["03a"].value	= 0;	//
		this.lines["03b"].value	= 0;	//

		Debug.exit("Template.calculate()");
	}

	getOutputHTML(uid) {
		if (!uid) {
			throw new Error(`${this.formname}.getOutputHTML(): UID is undefined.`);
		}

		return [ `template-${uid}-details`, HTML_FORM.replace(/XX/g, uid) ];
	}
}
