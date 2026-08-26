
import { Debug }		from "../Classes/Debug.js";
import { HTML }			from "../Classes/HTML.js";
import { Line }			from "../Classes/Line.js";
import { Objects }		from "../Classes/Objects.js";
import { TaxForm }		from "../Classes/TaxForm.js";
import { TaxFormObj }	from "../Classes/TaxFormObj.js";
import { TaxTable }		from "../Classes/TaxTable.js";

const HTML_FORM = `
		<details class="taxform-details" id="f1099div-XX-details">
			<summary class="taxform-summary">1099-DIV - Dividends and Distributions</summary>
			<div>&nbsp;</div>
			<div class="f1099-taxform-container">
				<div class="f1099-header-row">
					<div class="f1099-header-left">
						<input type="checkbox" disabled /> VOID &nbsp;&nbsp;&nbsp; <input type="checkbox" /> CORRECTED
					</div>
					<div class="f1099-header-center">
						<h2>OMB No. 1545-0110</h2>
						<h1><span id="tax-year">202X</span></h1>
						<div>Form <strong>1099-DIV</strong></div>
					</div>
					<div class="f1099-header-right">
						<strong>Dividends and Distributions</strong>
					</div>
				</div>
			
				<div class="f1099-main-grid">
					<div class="f1099-col-left">
						<div class="f1099-box f1099-box-large">
							<span class="f1099-box-label">PAYER&apos;S name, street address, city or town,
								state or province, country, ZIP or foreign postal code, and telephone no.</span>
							<input class="f1099-box-value" type="text" id="f1099div-XX-payer-name" />
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">PAYER&apos;S TIN</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-ein"
									placeholder="12-3456789" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">RECIPIENT&apos;S TIN</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-ssn"
									placeholder="xxx-xx-xxxx" />
							</div>
						</div>
			
						<div class="f1099-box f1099-box-large">
							<span class="f1099-box-label">RECIPIENT&apos;S name, street address, city or town,
								state or province, country, and ZIP code</span>
							<input class="f1099-box-value" type="text" id="f1099div-XX-taxpayer-name" />
						</div>
			
						<div class="f1099-box">
							<span class="f1099-box-label">Account number (see instructions)</span>
							<input class="f1099-box-value" type="text" id="f1099div-XX-account" />
						</div>
					</div>
			
					<div class="f1099-col-right">
						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">1a Total ordinary dividends</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-01a" placeholder="$0.00" />
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">1b Qualified dividends</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-01b" placeholder="$0.00" />
							</div>
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">2a Total capital gain distr.</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-02a" placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">2b Unrecap. Sec. 1250 gain</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-02b" placeholder="$0.00" />
							</div>
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">3 Nondividend distributions</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-03" placeholder="$0.00" />
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">4 Federal income tax withheld</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-04" placeholder="$0.00" />
							</div>
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">5 Section 199A dividends</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-05" placeholder="$0.00" />
							</div>
							<div class="f1099-box input-color">
								<span class="f1099-box-label">6 Investment expenses</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-06" placeholder="$0.00" />
							</div>
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">7 Foreign tax paid</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-07" placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">8 Foreign country or U.S. possession</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-08" placeholder="$0.00" />
							</div>
						</div>
			
						<div class="f1099-flex-row">
							<div class="f1099-box">
								<span class="f1099-box-label">12 Section 1202 gain</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-12" placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">13 Exempt-interest dividends</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-13" placeholder="$0.00" />
							</div>
						</div>
			
						<div class="f1099-flex-row" style="border-bottom: none;">
							<div class="f1099-box input-color">
								<span class="f1099-box-label">14 State tax withheld</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-14" placeholder="$0.00" />
							</div>
							<div class="f1099-box">
								<span class="f1099-box-label">15 State/Payer&apos;s state no.</span>
								<input class="f1099-box-value" type="text" id="f1099div-XX-15" />
							</div>
						</div>
					</div>
				</div>		<!-- Main grid -->
			</div>		<!-- taxform-container -->
			<div class="f1099-footer-note">Form <strong>1099-DIV</strong></div>
			<div>&nbsp;</div>
		</details>
`;

export class F1099DIV extends TaxForm {
	static getInputHTML(uid) {
		if (!uid) {
			throw new Error(`f1099div.getInputHTML(): UID is undefined.`);
		}

		const tax_year	= TaxTable.getTaxYear();
		const html		= HTML_FORM.replace(/XX/g, uid)
									.replace(/202X/g, tax_year);

		return [ `f1099div-${uid}-details`, html ];
	}

	static getUserInput(uid) {
		//
		// Create a new f1099div form and initialize it with information from the Web page.
		//
		if (!uid) {
			throw new Error(`f1099div.getUserInput(): UID is undefined.`);
		}

		const element = document.getElementById(`f1099div-${uid}-details`);
		if (!element) {
			throw new Error(`f1099div.getUserInput(): Element not found: f1099div-${uid}-details`);
		}

		let inputs = {};

		inputs["payer_name"		]	= HTML.getUserInput(`f1099div-${uid}-payer-name`,		"text");
		inputs["ein"			]	= HTML.getUserInput(`f1099div-${uid}-ein`,				"text");
		inputs["ssn"			]	= HTML.getUserInput(`f1099div-${uid}-ssn`,				"text");
		inputs["taxpayer_name"	]	= HTML.getUserInput(`f1099div-${uid}-taxpayer-name`,	"text");
		inputs["account"		]	= HTML.getUserInput(`f1099div-${uid}-account`,			"text");
		inputs["01a"			]	= HTML.getUserInput(`f1099div-${uid}-01a`,				"");
		inputs["01b"			]	= HTML.getUserInput(`f1099div-${uid}-01b`,				"");
		inputs["02a"			]	= HTML.getUserInput(`f1099div-${uid}-02a`,				"");
		inputs["02b"			]	= HTML.getUserInput(`f1099div-${uid}-02b`,				"");
		inputs["03"				]	= HTML.getUserInput(`f1099div-${uid}-03`,				"");
		inputs["04"				]	= HTML.getUserInput(`f1099div-${uid}-04`,				"");
		inputs["05"				]	= HTML.getUserInput(`f1099div-${uid}-05`,				"");
		inputs["06"				]	= HTML.getUserInput(`f1099div-${uid}-06`,				"");
		inputs["07"				]	= HTML.getUserInput(`f1099div-${uid}-07`,				"");
		inputs["08"				]	= HTML.getUserInput(`f1099div-${uid}-08`,				"");
		inputs["12"				]	= HTML.getUserInput(`f1099div-${uid}-12`,				"");
		inputs["13"				]	= HTML.getUserInput(`f1099div-${uid}-13`,				"");
		inputs["14"				]	= HTML.getUserInput(`f1099div-${uid}-14`,				"");
		inputs["15"				]	= HTML.getUserInput(`f1099div-${uid}-15`,				"text");

		if (!Objects.isUsed(inputs)) {
			return;
		}

		const f1099div = TaxFormObj.createForm("f1099div");

		f1099div.lines["payer_name"		].user_value	= inputs["payer-name"];
		f1099div.lines["ein"			].user_value	= inputs["ein"];
		f1099div.lines["ssn"			].user_value	= inputs["ssn"];
		f1099div.lines["taxpayer_name"  ].user_value	= inputs["taxpayer-name"];
		f1099div.lines["account"  		].user_value	= inputs["account"];
		f1099div.lines["01a"			].user_value	= inputs["01a"];
		f1099div.lines["01b"			].user_value	= inputs["01b"];
		f1099div.lines["02a"			].user_value	= inputs["02a"];
		f1099div.lines["02b"			].user_value	= inputs["02b"];
		f1099div.lines["03"				].user_value	= inputs["03"];
		f1099div.lines["04"				].user_value	= inputs["04"];
		f1099div.lines["05"				].user_value	= inputs["05"];
		f1099div.lines["06"				].user_value	= inputs["06"];
		f1099div.lines["07"				].user_value	= inputs["07"];
		f1099div.lines["08"				].user_value	= inputs["08"];
		f1099div.lines["12"				].user_value	= inputs["12"];
		f1099div.lines["13"				].user_value	= inputs["13"];
		f1099div.lines["14"				].user_value	= inputs["14"];
		f1099div.lines["15"				].user_value	= inputs["15"];
	}

	constructor(formname) {
		Debug.enter("f1099div.Constructor()");
		super(formname);
		this.title = `1099-DIV - Dividends and Distributions`;
		this.isSingleton = false;

		this.lines["payer_name"]	= new Line("Taxpayer's name");
		this.lines["ein"]			= new Line("Payee EIN");
		this.lines["ssn"]			= new Line("Taxpayr's SSN");
		this.lines["taxpayer_name"]	= new Line("Taxpayer's name");
		this.lines["account"]		= new Line("Account number");
		this.lines["01a"]			= new Line("Total ordinary dividends");
		this.lines["01b"]			= new Line("Qualified dividends");
		this.lines["02a"]			= new Line("Total capital gain distr.");
		this.lines["02b"]			= new Line("Unrecap. Sec. 1250 gain");
		this.lines["03"]			= new Line("Nondividend distributions");
		this.lines["04"]			= new Line("Federal income tax withheld");
		this.lines["05"]			= new Line("Section 199A dividends");
		this.lines["06"]			= new Line("Investment expenses");
		this.lines["07"]			= new Line("Foreign tax paid");
		this.lines["08"]			= new Line("Foreign country or U.S. possession");
		this.lines["12"]			= new Line("Section 1202 gain");
		this.lines["13"]			= new Line("Exempt-interest dividends");
		this.lines["14"]			= new Line("State tax withheld");
		this.lines["13"]			= new Line("State/Payer's state no.");

		Debug.exit("f1099div.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("f1099div.calculate()");

		this.calculated = true;

		Debug.exit("f1099div.calculate()");
	}
}
