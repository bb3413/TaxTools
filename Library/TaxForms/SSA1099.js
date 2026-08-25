
import { Debug }		from "../Classes/Debug.js";
import { HTML }			from "../Classes/HTML.js";
import { Line }			from "../Classes/Line.js";
import { Objects }		from "../Classes/Objects.js";
import { TaxForm }		from "../Classes/TaxForm.js";
import { TaxFormObj }	from "../Classes/TaxFormObj.js";

const HTML_FORM = `
		<details class="taxform-details" id="ssa1099-XX-details">
			<summary class="taxform-summary">SSA-1099 - Social Security Benefit Statement</summary>
			<div>&nbsp;</div>
			<div class="ssa1099-container">
				<div class="ssa1099-box span-four">
					<p class="ssa1099-box-description">Box 1 &nbsp;&nbsp; Name</p>
					<p></p>
				</div>
				<div class="ssa1099-box span-two">
					<p class="ssa1099-box-description">Box 2 &nbsp;&nbsp; Social Security Number</p>
					<p></p>
				</div>

				<div class="ssa1099-box span-two">
					<p class="ssa1099-box-description">Box 3 &nbsp;&nbsp; Benefts Paid</p>
					<p></p>
				</div>
				<div class="ssa1099-box span-two">
					<p class="ssa1099-box-description">Box 4 &nbsp;&nbsp; Benefits Repaid to SSA</p>
					<p></p>
				</div>
				<div class="ssa1099-box span-two input-color">
					<p class="ssa1099-box-description">Box 5 &nbsp;&nbsp; Net Benefits</p>
					<input class="ssa1099-box-value right input-color" type="text" id="ssa1099-XX-05" size="10" placeholder="0" />
				</div>

				<div class="ssa1099-box span-three input-color">
					<p class="ssa1099-box-description">Medicare Part B</p>
					<input class="ssa1099-box-value right input-color" type="text" id="ssa1099-XX-03a" size="10" placeholder="0" />
				</div>
				<div class="ssa1099-box span-three input-color">
					<p class="ssa1099-box-description">Box 6 &nbsp;&nbsp; Federal Income Tax Withheld</p>
					<input class="ssa1099-box-value right input-color" type="text" id="ssa1099-XX-06" size="10" placeholder="0" />
				</div>

				<div class="ssa1099-box span-three input-color">
					<p class="ssa1099-box-description">Medicare Part D</p>
					<input class="ssa1099-box-value right input-color" type="text" id="ssa1099-XX-03b" size="10" placeholder="0" />
				</div>
				<div class="ssa1099-box span-three">
					<p></p>
					<p></p>
				</div>
			</div>
			<div>&nbsp;</div>
		</details>
`;

export class SSA1099 extends TaxForm {
	static getInputHTML(uid) {
		if (!uid) {
			throw new Error(`SSA1099.getInputHTML(): UID is undefined.`);
		}

		return [ `ssa1099-${uid}-details`, HTML_FORM.replace(/XX/g, uid) ];
	}

	static getUserInput(uid) {
		//
		// Create a new SSA1099 form and initialize it with information from the Web page.
		//
		if (!uid) {
			throw new Error(`SSA1099.getUserInput(): UID is undefined.`);
		}

		const element = document.getElementById(`ssa1099-${uid}-details`);
		if (!element) {
			throw new Error(`SSA1099.getUserInput(): Element not found: ssa1099-${uid}-details`);
		}

		let inputs = {};

		inputs["03a"]		= HTML.getUserInput(`ssa1099-${uid}-03a`, "");
		inputs["03b"]		= HTML.getUserInput(`ssa1099-${uid}-03b`, "");
		inputs["05"]		= HTML.getUserInput(`ssa1099-${uid}-05`, "");
		inputs["06"]		= HTML.getUserInput(`ssa1099-${uid}-06`, "");
		
		if (!Objects.isUsed(inputs)) {
			return;
		}

		const ssa1099 = TaxFormObj.createForm("SSA1099");

		ssa1099.lines["03a" ].user_value	= inputs["03a"];
		ssa1099.lines["03b" ].user_value	= inputs["03b"];
		ssa1099.lines["05"  ].user_value	= inputs["05"];
		ssa1099.lines["06"  ].user_value	= inputs["06"];
	}

	constructor(formname) {
		Debug.enter("SSA1099.Constructor()");
		super(formname);

		this.isSingleton = false;

		this.lines["01"]	= new Line("Name");
		this.lines["02"]	= new Line("Social Security Number");
		this.lines["03a"]	= new Line("Medicare Part B");
		this.lines["03b"]	= new Line("Medicare Part D");
		this.lines["04"]	= new Line("Benefits Repaid");
		this.lines["05"]	= new Line("Net Benefits");
		this.lines["06"]	= new Line("Federal Income Tax Withheld");

		Debug.exit("SSA1099.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("SSA1099.calculate()");

		this.calculated = true;

		Debug.exit("SSA1099.calculate()");
	}
}
