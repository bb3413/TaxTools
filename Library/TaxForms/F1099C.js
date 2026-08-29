
import { Debug }		from "../Classes/Debug.js";
import { HTML }			from "../Classes/HTML.js";
import { Line }			from "../Classes/Line.js";
import { Objects }		from "../Classes/Objects.js";
import { TaxForm }		from "../Classes/TaxForm.js";
import { TaxFormObj }	from "../Classes/TaxFormObj.js";
import { TaxTable }		from "../Classes/TaxTable.js";

const HTML_FORM = `
		<details class="taxform-details" id="f1099c-XX-details">
			<summary class="taxform-summary">1099-C - Cancellation of Debt</summary>
			<div>&nbsp;</div>
			<div class="f1099-taxform-container">
				<!-- Header Section -->
				<div class="f1099-header-row">
					<div class="f1099-header-left">
						<label><input type="checkbox" disabled
							id="corrected" /> CORRECTED</label>
					</div>
					<div class="f1099-header-center">
						<div>OMB No. 1545-1424</div>
						<h1><span id="tax-year">202X</span></h1>
						<h2>Form 1099-C</h2>
					</div>
					<div class="f1099-header-right">
						<strong>Cancellation of Debt</strong>
					</div>
				</div>
			
				<!-- Main Content Grid -->
				<div class="f1099-main-grid">
					<!-- Left Column: Payer & Recipient Info Inputs -->
					<div class="f1099-col-left">
						<div class="f1099-box f1099-box-large">
							<span class="f1099-box-label">PAYER&apos;S name, street 
								address, city or town, state or province, country,
								ZIP or foreign postal code, and telephone no.</span>
							<textarea id="f1099c-XX-payer"
								placeholder="Payer Name&#10;Street Address&#10;City, State, ZIP&#10;Phone Number">
							</textarea>
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">PAYER&apos;S TIN</span>
								<input type="text" id="f1099c-XX-ein"
									placeholder="12-3456789" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">TAXPAYER&apos;S TIN</span>
								<input type="text" id="f1099c-XX-ssn"
									placeholder="123-45-6789" />
							</div>
						</div>
			
						<div class="f1099-box f1099-box-large">
							<span class="f1099-box-label">TAXPAYER&apos;S name, street
								address, city or town, state, and ZIP code</span>
							<textarea id="f1099c-XX-taxpayer"
								placeholder="Taxpayer&apos;s Name&#10;Street Address&#10;City, State, ZIP">
							</textarea>
						</div>

						<div class="f1099-box" style="border-bottom: none;">
							<span class="f1099-box-label">Account number (see
								instructions)</span>
							<input type="text" id="f1099c-XX-account"
								placeholder="Optional Account #" />
						</div>
					</div>
			
					<!-- Right Column: Numbered Input Boxes -->
					<div class="f1099-col-right">
						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">1 Date of identifiable
									event</span>
								<input type="text" id="f1099c-XX-01"
									placeholder="MM/DD/YYYY" />
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">2 Amount of debt
									discharged</span>
								<input type="text" id="f1099c-XX-02"
									placeholder="0" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">3 Interest, if included
									in box 2</span>
								<input type="text" id="f1099c-XX-03"
									placeholder="0" />
							</div>
							<div class="f1099-box">
							</div>
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">4 Debt description</span>
								<textarea id="f1099c-XX-04"></textarea>
							</div>
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">5 If checked, the debtor
									was personally liable for repayment of the debt</span>
								<div class="f1099-checkbox-center">
									<input type="checkbox" id="f1099c-XX-05" />
								</div>
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box" style="border-bottom: none;">
								<span class="f1099-box-label">6  Identifiable event code</span>
								<input type="text" id="f1099c-XX-06" />
							</div>
							<div class="f1099-box" style="border-bottom: none;">
								<span class="f1099-box-label">7 Fair market value of
									property</span>
								<input type="text" id="f1099c-XX-07"
									placeholder="0" />
							</div>
						</div>
					</div>
				</div>		<!-- Main grid -->
			</div>		<!-- f1099-taxform-container -->
			<div class="f1099-footer-note">Form <strong>1099-C</strong></div>
			<div>&nbsp;</div>
		</details>
`;

export class F1099C extends TaxForm {
	static getInputHTML(uid) {
		if (!uid) {
			throw new Error(`F1099C.getInputHTML(): UID is undefined.`);
		}

		const tax_year	= TaxTable.getTaxYear();
		const html		= HTML_FORM.replace(/XX/g, uid)
									.replace(/202X/g, tax_year);

		return [ `f1099c-${uid}-details`, html ];
	}

	static getUserInput(uid) {
		//
		// Create a new F1099C form and initialize it with information from the Web page.
		//
		if (!uid) {
			throw new Error(`F1099C.getUserInput(): UID is undefined.`);
		}

		const element = document.getElementById(`f1099c-${uid}-details`);
		if (!element) {
			throw new Error(`F1099C.getUserInput(): Element not found: f1099c-${uid}-details`);
		}

		let inputs = {};

		inputs["payer"]		= HTML.getUserInput(`f1099c-${uid}-payer`,		"text");
		inputs["ein"]		= HTML.getUserInput(`f1099c-${uid}-ein`,		"text");
		inputs["ssn"]		= HTML.getUserInput(`f1099c-${uid}-ssn`,		"text");
		inputs["taxpayer"]	= HTML.getUserInput(`f1099c-${uid}-taxpayer`,	"text");
		inputs["account"]	= HTML.getUserInput(`f1099c-${uid}-account`,	"text");
		inputs["01"]		= HTML.getUserInput(`f1099c-${uid}-01`,			"text");
		inputs["02"]		= HTML.getUserInput(`f1099c-${uid}-02`,			"");
		inputs["03"]		= HTML.getUserInput(`f1099c-${uid}-03`,			"");
		inputs["04"]		= HTML.getUserInput(`f1099c-${uid}-04`,			"text");
		inputs["05"]		= HTML.getUserInput(`f1099c-${uid}-05`,			"");
		inputs["06"]		= HTML.getUserInput(`f1099c-${uid}-06`,			"text");
		inputs["07"]		= HTML.getUserInput(`f1099c-${uid}-07`,			"");

		if (!Objects.isUsed(inputs)) {
			return;
		}

		const f1099c = TaxFormObj.createForm("F1099C");

		f1099c.lines["payer"	].user_value	= inputs["payer"];
		f1099c.lines["ein"		].user_value	= inputs["ein"];
		f1099c.lines["ssn"		].user_value	= inputs["ssn"];
		f1099c.lines["taxpayer"	].user_value	= inputs["taxpayer"];
		f1099c.lines["account"	].user_value	= inputs["account"];
		f1099c.lines["01"		].user_value	= inputs["01"];
		f1099c.lines["02"		].user_value	= inputs["02"];
		f1099c.lines["03"		].user_value	= inputs["03"];
		f1099c.lines["04"		].user_value	= inputs["04"];
		f1099c.lines["05"		].user_value	= inputs["05"];
		f1099c.lines["06"		].user_value	= inputs["06"];
		f1099c.lines["07"		].user_value	= inputs["07"];
	}

	constructor(formname) {
		Debug.enter("F1099C.Constructor()");
		super(formname);
		this.title = `1099-C - Cancellation of Debt`;
		this.isSingleton = false;

		this.lines["payer"]		= new Line("Payer's information");
		this.lines["ein"]		= new Line("Payer EIN");
		this.lines["ssn"]		= new Line("Taxpayr's SSN");
		this.lines["taxpayer"]	= new Line("Taxpayer's address");
		this.lines["account"]	= new Line("Account number");
		this.lines["01"]		= new Line("Date of identifiable event");
		this.lines["02"]		= new Line("Amount of debt discharged");
		this.lines["03"]		= new Line("Interest, if included in box 2");
		this.lines["04"]		= new Line("Debt description");
		this.lines["05"]		= new Line("Debtor was personally liable for debt");
		this.lines["06"]		= new Line("Identifiable event code");
		this.lines["07"]		= new Line("Fair market value of property");

		Debug.exit("F1099C.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("F1099C.calculate()");

		this.calculated = true;

		Debug.exit("F1099C.calculate()");
	}
}
