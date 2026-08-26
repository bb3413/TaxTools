
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
			<div class="ssa-outside-header">Form SSA-1099 - Social Security Benefit Statement</div>
			<div class="f1099-taxform-container">
				<div class="f1099-header-row">
					<div class="ssa-header-left">
						<h1><span id="tax-year">202X</span></h1>
					</div>
					<div class="ssa-header-right">
						<ul>
							<li>Part of your Social Security benefits shown in box 5 may be taxable income.</li>
							<li>See the reverse for more infrmation.</li>
						</ul>
					</div>
				</div>

				<div class="ssa-row-1">
					<div class="f1099-box ssa-border-right">
						<span class="f1099-box-label">Box 1. Name</span>
						<input class="f1099-box-value" type="text" id="ssa-XX-01" />
					</div>
					<div class="f1099-box">
						<span class="f1099-box-label">Box 2. Beneficiary&apos;s Social Security Number</span>
						<input class="f1099-box-value" type="text" id="ssa-XX-02" />
					</div>
				</div>

				<div class="ssa-row-2">
					<div class="f1099-box ssa-border-right">
						<span class="f1099-box-label">Box 3. Benefits Paid in 202X</span>
						<input class="f1099-box-value" type="text" id="ssa-XX-03" />
					</div>
					<div class="f1099-box ssa-border-right">
						<span class="f1099-box-label">Box 4. Benefits Repaid to SSA in 202X</span>
						<input class="f1099-box-value" type="text" id="ssa-XX-04" />
					</div>
					<div class="f1099-box input-color">
						<span class="f1099-box-label">Box 5. Net Benefits for 202X (Box 3 minus Box 4)</span>
						<input class="f1099-box-value" type="text" id="ssa-XX-05" />
					</div>
				</div>

				<div class="f1099-main-grid">
					<div class="f1099-col-left">
						<div class="f1099-box f1099-box-large input-color">
							<h2 class="ssa-subheading">Description of Amount in Box 3</h2>
							<div class="ssa-label-group">
								<label for="f1099r-XX-03a">Medicare Part B:</label>
								<input type="text" id="f1099r-XX-03a" name="f1099r-XX-03a" placeholder="$0.00" />
							</div>
							<div class="ssa-label-group">
								<label for="f1099r-XX-03b">Medicare Part D:</label>
								<input type="text" id="f1099r-XX-03b" name="f1099r-XX-03b" placeholder="$0.00" />
							</div>
						</div>
					</div>

					<div class="f1099-col-right">
						<div class="f1099-box f1099-box-large">
							<h2 class="ssa-subheading">Description of Amount in Box 4</h2>
						</div>
						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">Box 6. Voluntary Federal Income Tax Withheld</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-06" placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">Box 7. Address</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-07" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">Box 8. Claim Number</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-08" />
							</div>
						</div>
					</div>		<!-- f1099-col-right -->
				</div>		<!-- f1099-main-grid -->
			</div>		<!-- f1099-taxform-container -->
			<div class="f1099-footer-note">Form <strong>SSA-1099</strong></div>
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

		inputs["01"]		= HTML.getUserInput(`ssa1099-${uid}-01`, "");
		inputs["02"]		= HTML.getUserInput(`ssa1099-${uid}-02`, "");
		inputs["03a"]		= HTML.getUserInput(`ssa1099-${uid}-03a`, "");
		inputs["03b"]		= HTML.getUserInput(`ssa1099-${uid}-03b`, "");
		inputs["04"]		= HTML.getUserInput(`ssa1099-${uid}-04`, "");
		inputs["05"]		= HTML.getUserInput(`ssa1099-${uid}-05`, "");
		inputs["06"]		= HTML.getUserInput(`ssa1099-${uid}-06`, "");

		if (!Objects.isUsed(inputs)) {
			return;
		}

		const ssa1099 = TaxFormObj.createForm("SSA1099");

		ssa1099.lines["01"  ].user_value	= inputs["01"];
		ssa1099.lines["02"  ].user_value	= inputs["02"];
		ssa1099.lines["03a" ].user_value	= inputs["03a"];
		ssa1099.lines["03b" ].user_value	= inputs["03b"];
		ssa1099.lines["04"  ].user_value	= inputs["04"];
		ssa1099.lines["05"  ].user_value	= inputs["05"];
		ssa1099.lines["06"  ].user_value	= inputs["06"];
	}

	constructor(formname) {
		Debug.enter("SSA1099.Constructor()");
		super(formname);
		this.title = `SSA-1099 - Social Security Benefit Statement`;
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
