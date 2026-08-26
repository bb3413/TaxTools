
import { Debug }		from "../Classes/Debug.js";
import { HTML }			from "../Classes/HTML.js";
import { Line }			from "../Classes/Line.js";
import { Objects }		from "../Classes/Objects.js";
import { TaxForm }		from "../Classes/TaxForm.js";
import { TaxFormObj }	from "../Classes/TaxFormObj.js";
import { TaxTable }		from "../Classes/TaxTable.js";

const HTML_FORM = `
		<details class="taxform-details" id="f1099r-XX-details">
			<summary class="taxform-summary">1099-R - Distributions from Pensions, Annuities,
				Retirement Plans, etc.</summary>
			<div>&nbsp;</div>
			<div class="f1099-taxform-container">
				<div class="f1099-header-row">
					<div class="f1099-header-left">
						<input type="checkbox" disabled /> CORRECTED (if checked)
					</div>
					<div class="f1099-header-center">
						<h2>OMB No. 1545-0119</h2>
						<h1><span id="tax-year">202X</span></h1>
						<div>Form <strong>1099-R</strong></div>
					</div>
					<div class="f1099-header-right">
						<strong>Distributions From Pensions, Annuities, Retirement or Profit-Sharing
							Plans, IRAs, Insurance Contracts, etc.</strong>
					</div>
				</div>

				<div class="f1099-main-grid">
					<div class="f1099-col-left">
						<div class="f1099-box f1099-box-large">
							<span class="f1099-box-label">PAYER&apos;S name, street address, city or town,
								state or province, country, and ZIP or foreign postal code</span>
							<input class="f1099-box-value" type="text" id="f1099r-XX-name" />
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">PAYER&apos;S TIN</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-ein"
									placeholder="12-3456789" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">RECIPIENT&apos;S TIN</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-ssn"
									placeholder="xxx-xx-xxxx" />
							</div>
						</div>

						<div class="f1099-box f1099-box-large">
							<span class="f1099-box-label">RECIPIENT&apos;S name, street address, city or
								town, state, and ZIP code</span>
							<input class="f1099-box-value" type="text" id="f1099r-XX-address" />
						</div>

						<div class="f1099-box" style="border-bottom: none;">
							<span class="f1099-box-label">Account number (see instructions)</span>
							<input class="f1099-box-value" type="text" id="f1099r-XX-account" />
						</div>
					</div>

					<div class="f1099-col-right">
						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">1 Gross distribution</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-01"
									placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">2a Taxable amount</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-02a"
									placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">2b Taxable amount not determined</span>
								<div class="f1099-box-value"><input type="checkbox" id="f1099r-XX-02b" /></div>
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">Total distribution</span>
								<div class="f1099-box-value"><input type="checkbox"/></div>
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">3 Capital gain (included in box 2a)</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-3"
									placeholder="$0.00" />
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">4 Federal income tax withheld</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-04"
									placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">5 Employee contrib./Designated Roth</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-05"
									placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">6 Net unrealized appreciation</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-06"
									placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">7a Distribution code(s)</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-07a" />
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">7b IRA/SEP/SIMPLE</span>
								<div class="f1099-box-value"><input type="checkbox" id="f1099r-XX-07b" /></div>
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label"></span>
								<div class="f1099-box-value"></div>
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">9b Total employee contributions</span>
								<div class="f1099-box-value"></div>
								<input class="f1099-box-value" type="text" id="f1099r-XX-09b"
									placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">14 State tax withheld</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-14"
									placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">15 State/Payer&apos;s state no.</span>
								<input class="f1099-box-value" type="text" id="f1099r-XX-15" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="f1099-footer-note">Form <strong>1099-R</strong></div>
			<div>&nbsp;</div>
		</details>
`;

export class F1099R extends TaxForm {
	static getInputHTML(uid) {
		if (!uid) {
			throw new Error(`F1099R.getInputHTML(): UID is undefined.`);
		}

		const tax_year	= TaxTable.getTaxYear();
		const html		= HTML_FORM.replace(/XX/g, uid)
									.replace(/202X/g, tax_year);

		return [ `f1099r-${uid}-details`, html ];
	}

	static getUserInput(uid) {
		//
		// Create a new F1099R form and initialize it with information from the Web page.
		//
		if (!uid) {
			throw new Error(`F1099R.getUserInput(): UID is undefined.`);
		}

		const element = document.getElementById(`f1099r-${uid}-details`);
		if (!element) {
			throw new Error(`F1099R.getUserInput(): Element not found: f1099r-${uid}-details`);
		}

		let inputs = {};

		inputs["name"]		= HTML.getUserInput(`f1099r-${uid}-name`,		"text");
		inputs["ein"]		= HTML.getUserInput(`f1099r-${uid}-ein`,		"text");
		inputs["ssn"]		= HTML.getUserInput(`f1099r-${uid}-ssn`,		"text");
		inputs["address"]	= HTML.getUserInput(`f1099r-${uid}-address`,	"text");
		inputs["account"]	= HTML.getUserInput(`f1099r-${uid}-account`,	"text");
		inputs["01"]		= HTML.getUserInput(`f1099r-${uid}-01`,			"");
		inputs["02a"]		= HTML.getUserInput(`f1099r-${uid}-02a`,		"");
		inputs["02b"]		= HTML.getUserInput(`f1099r-${uid}-02b`,		"");
		inputs["03"]		= HTML.getUserInput(`f1099r-${uid}-03`,			"");
		inputs["04"]		= HTML.getUserInput(`f1099r-${uid}-04`,			"");
		inputs["05"]		= HTML.getUserInput(`f1099r-${uid}-05`,			"");
		inputs["06"]		= HTML.getUserInput(`f1099r-${uid}-06`,			"");
		inputs["07a"]		= HTML.getUserInput(`f1099r-${uid}-07a`,		"text");
		inputs["07b"]		= HTML.getUserInput(`f1099r-${uid}-07b`,		"");
		inputs["09b"]		= HTML.getUserInput(`f1099r-${uid}-09b`,		"");
		inputs["14"]		= HTML.getUserInput(`f1099r-${uid}-14`,			"");
		inputs["15"]		= HTML.getUserInput(`f1099r-${uid}-15`,			"text");

		if (!Objects.isUsed(inputs)) {
			return;
		}

		const f1099r = TaxFormObj.createForm("F1099R");

		f1099r.lines["name"		].user_value	= inputs["name"];
		f1099r.lines["ein"		].user_value	= inputs["ein"];
		f1099r.lines["ssn"		].user_value	= inputs["ssn"];
		f1099r.lines["address"  ].user_value	= inputs["address"];
		f1099r.lines["account"  ].user_value	= inputs["account"];
		f1099r.lines["01"  ].user_value	= inputs["01"];
		f1099r.lines["02a" ].user_value	= inputs["02a"];
		f1099r.lines["02b" ].user_value	= inputs["02b"];
		f1099r.lines["03"  ].user_value	= inputs["03"];
		f1099r.lines["04"  ].user_value	= inputs["04"];
		f1099r.lines["05"  ].user_value	= inputs["05"];
		f1099r.lines["06"  ].user_value	= inputs["06"];
		f1099r.lines["07a" ].user_value	= inputs["07a"];
		f1099r.lines["07b" ].user_value	= inputs["07b"];
		f1099r.lines["09b" ].user_value	= inputs["09b"];
		f1099r.lines["14"  ].user_value	= inputs["14"];
		f1099r.lines["15"  ].user_value	= inputs["15"];
	}

	constructor(formname) {
		Debug.enter("F1099R.Constructor()");
		super(formname);

		this.isSingleton = false;

		this.lines["name"]		= new Line("Taxpayer's name");
		this.lines["ein"]		= new Line("Payee EIN");
		this.lines["ssn"]		= new Line("Taxpayr's SSN");
		this.lines["address"]	= new Line("Taxpayer's address");
		this.lines["account"]	= new Line("Account number");
		this.lines["01"]	= new Line("Gross distribution");
		this.lines["02a"]	= new Line("Taxable amount");
		this.lines["02b"]	= new Line("Taxable amount not determined");
		this.lines["03"]	= new Line("Capital gain (included in box 2a)");
		this.lines["04"]	= new Line("Federal income tax withheld");
		this.lines["05"]	= new Line("Employee contrib./Designated Roth");
		this.lines["06"]	= new Line("Net unrealized appreciation");
		this.lines["07a"]	= new Line("Distribution code(s)");
		this.lines["07b"]	= new Line("IRA/SEP/SIMPLE");
		this.lines["09b"]	= new Line("Total employee contributions");
		this.lines["14"]	= new Line("State tax withheld");
		this.lines["14"]	= new Line("State/Payer's state no.");

		Debug.exit("F1099R.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("F1099R.calculate()");

		this.calculated = true;

		Debug.exit("F1099R.calculate()");
	}
}
