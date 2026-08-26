
import { Debug }		from "../Classes/Debug.js";
import { HTML }			from "../Classes/HTML.js";
import { Line }			from "../Classes/Line.js";
import { Objects }		from "../Classes/Objects.js";
import { TaxForm }		from "../Classes/TaxForm.js";
import { TaxFormObj }	from "../Classes/TaxFormObj.js";
import { TaxTable }		from "../Classes/TaxTable.js";

const HTML_FORM = `
		<details class="taxform-details" id="f1099int-XX-details">
			<summary class="taxform-summary">1099-INT - Interest Income</summary>
			<div>&nbsp;</div>
			<div class="f1099-taxform-container">
				<div class="f1099-header-row">
					<div class="f1099-header-left">
						<input type="checkbox" disabled /> VOID &nbsp;&nbsp;&nbsp; <input type="checkbox" /> CORRECTED
					</div>
					<div class="f1099-header-center">
						<h2>OMB No. 1545-0112</h2>
						<h1><span id="tax-year">202X</span></h1>
						<div>Form <strong>1099-INT</strong></div>
					</div>
					<div class="f1099-header-right">
						<strong>Interest Income</strong>
					</div>
				</div>

				<div class="f1099-main-grid">
					<div class="f1099-col-left">
						<div class="f1099-box f1099-box-large">
							<span class="f1099-box-label">PAYER&apos;S name, street address, city or town,
								state or province, country, and ZIP or foreign postal code, and telephone no.</span>
							<input class="f1099-box-value" type="text" id="f1099int-XX-payer-name" size="20" />
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">PAYER&apos;S TIN</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-ein"
									placeholder="12-3456789" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">RECIPIENT&apos;S TIN</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-ssn"
									placeholder="xxx-xx-xxxx" />
							</div>
						</div>

						<div class="f1099-box f1099-box-large">
							<span class="f1099-box-label">RECIPIENT&apos;S name, street address, city or town,
								state or province, country, and ZIP code</span>
							<input class="f1099-box-value" type="text" id="f1099int-XX-taxpayer-name" />
						</div>

						<div class="f1099-box" style="border-bottom: none;">
							<span class="f1099-box-label">Account number (see instructions)</span>
							<input class="f1099-box-value" type="text" id="f1099int-XX-account" />
						</div>
					</div>

					<div class="f1099-col-right">
						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">1 Interest income</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-01" placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">2 Early withdrawal penalty</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-02" placeholder="$0.00" />
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">3 Interest on U.S. Savings Bonds</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-03" placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">4 Federal income tax withheld</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-04" placeholder="$0.00" />
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">5 Investment expenses</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-05" placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">8 Tax-exempt interest</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-08" placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">9 Specified private activity bond interest</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-09" placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">10 Market discount</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-10" placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">11 Bond premium</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-11" placeholder="$0.00" />
							</div>
						</div>

						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">15 State tax withheld</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-12" placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">16 State/Payer&apos;s state no.</span>
								<input class="f1099-box-value" type="text" id="f1099int-XX-13" />
							</div>
						</div>
					</div>
				</div>		<!-- Main grid -->
			</div>	<!-- form-container -->
			<div class="f1099-footer-note">Form <strong>1099-INT</strong></div>
			<div>&nbsp;</div>
		</details>
`;

export class F1099INT extends TaxForm {
	static getInputHTML(uid) {
		if (!uid) {
			throw new Error(`f1099int.getInputHTML(): UID is undefined.`);
		}

		const tax_year	= TaxTable.getTaxYear();
		const html		= HTML_FORM.replace(/XX/g, uid)
									.replace(/202X/g, tax_year);

		return [ `f1099int-${uid}-details`, html ];
	}

	static getUserInput(uid) {
		//
		// Create a new f1099int form and initialize it with information from the Web page.
		//
		if (!uid) {
			throw new Error(`f1099int.getUserInput(): UID is undefined.`);
		}

		const element = document.getElementById(`f1099int-${uid}-details`);
		if (!element) {
			throw new Error(`f1099int.getUserInput(): Element not found: f1099int-${uid}-details`);
		}

		let inputs = {};

		inputs["payer_name"		]	= HTML.getUserInput(`f1099int-${uid}-payer-name`,		"text");
		inputs["ein"			]	= HTML.getUserInput(`f1099int-${uid}-ein`,				"text");
		inputs["ssn"			]	= HTML.getUserInput(`f1099int-${uid}-ssn`,				"text");
		inputs["taxpayer_name"	]	= HTML.getUserInput(`f1099int-${uid}-taxpayer-name`,	"text");
		inputs["account"		]	= HTML.getUserInput(`f1099int-${uid}-account`,			"text");
		inputs["01"				]	= HTML.getUserInput(`f1099int-${uid}-01`,				"");
		inputs["02"				]	= HTML.getUserInput(`f1099int-${uid}-02`,				"");
		inputs["03"				]	= HTML.getUserInput(`f1099int-${uid}-03`,				"");
		inputs["04"				]	= HTML.getUserInput(`f1099int-${uid}-04`,				"");
		inputs["05"				]	= HTML.getUserInput(`f1099int-${uid}-05`,				"");
		inputs["08"				]	= HTML.getUserInput(`f1099int-${uid}-08`,				"");
		inputs["09"				]	= HTML.getUserInput(`f1099int-${uid}-09`,				"");
		inputs["10"				]	= HTML.getUserInput(`f1099int-${uid}-10`,				"");
		inputs["11"				]	= HTML.getUserInput(`f1099int-${uid}-11`,				"");
		inputs["12"				]	= HTML.getUserInput(`f1099int-${uid}-12`,				"");
		inputs["13"				]	= HTML.getUserInput(`f1099int-${uid}-13`,				"text");

		if (!Objects.isUsed(inputs)) {
			return;
		}

		const f1099int = TaxFormObj.createForm("f1099int");

		f1099int.lines["payer_name"		].user_value	= inputs["payer-name"];
		f1099int.lines["ein"			].user_value	= inputs["ein"];
		f1099int.lines["ssn"			].user_value	= inputs["ssn"];
		f1099int.lines["taxpayer_name"  ].user_value	= inputs["taxpayer-name"];
		f1099int.lines["account"  		].user_value	= inputs["account"];
		f1099int.lines["01"				].user_value	= inputs["01"];
		f1099int.lines["02"				].user_value	= inputs["02"];
		f1099int.lines["03"				].user_value	= inputs["03"];
		f1099int.lines["04"				].user_value	= inputs["04"];
		f1099int.lines["05"				].user_value	= inputs["05"];
		f1099int.lines["08"				].user_value	= inputs["08"];
		f1099int.lines["09"				].user_value	= inputs["09"];
		f1099int.lines["10"				].user_value	= inputs["10"];
		f1099int.lines["11"				].user_value	= inputs["11"];
		f1099int.lines["12"				].user_value	= inputs["12"];
		f1099int.lines["13"				].user_value	= inputs["13"];
	}

	constructor(formname) {
		Debug.enter("f1099int.Constructor()");
		super(formname);
		this.title = `1099-INT - Interest Income`;
		this.isSingleton = false;

		this.lines["payer_name"]	= new Line("Taxpayer's name");
		this.lines["ein"]			= new Line("Payee EIN");
		this.lines["ssn"]			= new Line("Taxpayr's SSN");
		this.lines["taxpayer_name"]	= new Line("Taxpayer's name");
		this.lines["account"]		= new Line("Account number");
		this.lines["01"]			= new Line("Interest income");
		this.lines["02"]			= new Line("Early Withdrawal Penalty");
		this.lines["03"]			= new Line("Interest on U.S. Savings Bonds");
		this.lines["04"]			= new Line("Federal income tax withheld");
		this.lines["05"]			= new Line("Investment expenses");
		this.lines["08"]			= new Line("Tax-exempt interest");
		this.lines["09"]			= new Line("Specified private activity bond interest");
		this.lines["10"]			= new Line("Market discount");
		this.lines["11"]			= new Line("Bond premium");
		this.lines["12"]			= new Line("State tax withheld");
		this.lines["13"]			= new Line("State/Payer's state no.");

		Debug.exit("f1099int.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("f1099int.calculate()");

		this.calculated = true;

		Debug.exit("f1099int.calculate()");
	}
}
