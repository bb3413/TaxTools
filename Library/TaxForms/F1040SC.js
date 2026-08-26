
import { Debug }		from "../Classes/Debug.js";
import { Line }			from "../Classes/Line.js";
import { TaxForm }		from "../Classes/TaxForm.js";
import { TaxFormObj }	from "../Classes/TaxFormObj.js";
import { TaxTable }		from "../Classes/TaxTable.js";
import { Taxpayer }		from "../Classes/Taxpayer.js";

const HTML_FORM = `
		<details class="taxform-details" id="f1040sc-XX-details">
			<summary class="taxform-summary">Schedule C - Profit and Loss From Business</summary>
			<div class="taxform-container">
				<div>&nbsp;</div>
				<div class="taxform-section-container">
					<p class="section-part">Part I</p>
					<p class="section-title">Income</p>
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">1</p>
					<p class="description noborder"">Gross receipts or sales"</p>
					<p class="lineno">1</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-01" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">2</p>
					<p class="description noborder">Returns and allowances</p>
					<p class="lineno">2</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-02" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">3</p>
					<p class="description noborder">Subtract line 2 from line 1</p>
					<p class="lineno">3</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-03" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">4</p>
					<p class="description noborder">Cost of goods sold (from line 42)</p>
					<p class="lineno">4</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-04" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">5</p>
					<p class="description noborder">Gross profit. Subtract line 4 from line 3</p>
					<p class="lineno">5</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-05" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">6</p>
					<p class="description noborder">Other income, including federal and state gasoline or fuel tax credit or refund</p>
					<p class="lineno">6</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-06" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">7</p>
					<p class="description noborder">Gross income. Add lines 5 and 6</p>
					<p class="lineno">7</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-07" size="10" placeholder="0" />
				</div>

				<div class="taxform-section-container">
					<p class="section-part">Part II</p>
					<p class="section-title">Expenses</p>
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">8</p>
					<p class="description noborder">Advertising</p>
					<p class="lineno">8</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-08" size="10" placeholder="0" />

					<p class="lineno noborder">18</p>
					<p class="description noborder">Office expense</p>
					<p class="lineno">18</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-18" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">9</p>
					<p class="description noborder">Car and truck expenses</p>
					<p class="lineno">9</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-09" size="10" placeholder="0" />

					<p class="lineno noborder">19</p>
					<p class="description noborder">Pension and profit-sharing plans</p>
					<p class="lineno">19</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-19" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">10</p>
					<p class="description noborder">Commissions and fees</p>
					<p class="lineno">10</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-10" size="10" placeholder="0" />

					<p class="lineno noborder">20a</p>
					<p class="description noborder">Rent or lease Vehicles, machinery, and equipment</p>
					<p class="lineno">20a</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-20a" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">11</p>
					<p class="description noborder">Contract labor</p>
					<p class="lineno">11</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-11" size="10" placeholder="0" />

					<p class="lineno noborder">20b</p>
					<p class="description noborder">Rent or lease Other business property</p>
					<p class="lineno">20b</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-20b" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">11</p>
					<p class="description noborder">Car and truck expenses</p>
					<p class="lineno">11</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-11" size="10" placeholder="0" />

					<p class="lineno noborder">21</p>
					<p class="description noborder">Repairs and maintenance</p>
					<p class="lineno">21</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-21" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">12</p>
					<p class="description noborder">Depletion</p>
					<p class="lineno">12</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-12" size="10" placeholder="0" />

					<p class="lineno noborder">22</p>
					<p class="description noborder">Supplies</p>
					<p class="lineno">22</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-22" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">13</p>
					<p class="description noborder">Depreciation and section 179
expense deduction</p>
					<p class="lineno">13</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-13" size="10" placeholder="0" />

					<p class="lineno noborder">23</p>
					<p class="description noborder">Taxes and licenses</p>
					<p class="lineno">23</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-23" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">14</p>
					<p class="description noborder">Employee benefit programs</p>
					<p class="lineno">14</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-14" size="10" placeholder="0" />

					<p class="lineno noborder">24a</p>
					<p class="description noborder">Travel</p>
					<p class="lineno">24a</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-24a" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">15</p>
					<p class="description noborder">Insurance (other than health)</p>
					<p class="lineno">15</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-15" size="10" placeholder="0" />

					<p class="lineno noborder">24b</p>
					<p class="description noborder">Deductible meals</p>
					<p class="lineno">24b</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-24b" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">16a</p>
					<p class="description noborder">Mortgage Interest</p>
					<p class="lineno">16a</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-16a" size="10" placeholder="0" />

					<p class="lineno noborder">25</p>
					<p class="description noborder">Utilities</p>
					<p class="lineno">25</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-25" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">16b</p>
					<p class="description noborder">Other Interest</p>
					<p class="lineno">16b</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-16b" size="10" placeholder="0" />

					<p class="lineno noborder">26</p>
					<p class="description noborder">Wages</p>
					<p class="lineno">26</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-26" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p class="lineno noborder">17</p>
					<p class="description noborder">Legal and professional services</p>
					<p class="lineno">17</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-17" size="10" placeholder="0" />

					<p class="lineno noborder">27a</p>
					<p class="description noborder">Energy efficient commercial bldgs
deduction</p>
					<p class="lineno">27a</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-27a" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value-lno-desc-lno-value">
					<p>&nbsp;</p>
					<p>&nbsp;</p>
					<p>&nbsp;</p>
					<p>&nbsp;</p>

					<p class="lineno noborder">27b</p>
					<p class="description noborder">Other expenses</p>
					<p class="lineno">27b</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-27b" size="10" placeholder="0" />
				</div>

				<hr />
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">28</p>
					<p class="description noborder">Total expenses before expenses for business use of home. Add lines 8 through 27b</p>
					<p class="lineno">28</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-28" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">29</p>
					<p class="description noborder">Tentative profit or (loss). Subtract line 28 from line 7</p>
					<p class="lineno">29</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-29" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">30</p>
					<p class="description noborder">Expenses for business use of your home</p>
					<p class="lineno">30</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-30" size="10" placeholder="0" />
				</div>
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno noborder">31</p>
					<p class="description noborder">Net profit or (loss). Subtract line 30 from line 29</p>
					<p class="lineno">31</p>
					<input class="output-field" readonly type="text" id="f1040sc-XX-31" size="10" placeholder="0" />
				</div>
				<div>&nbsp;</div>
			</div>
			<div>&nbsp;</div>
		</details>
`;

export class F1040SC extends TaxForm {
	static getInputHTML(uid) {
		if (!uid) {
			throw new Error("F1040SC.getInputHTML: UID is undefined.");
		}

		let html = HTML_FORM.replace(/XX/g, uid)
							.replace(/readonly/g, "")
							.replace(/output-color/g, "")
							.replace(/output-field/g, "input-field");

		return [ `f1040sc-${uid}-details`, html ];
	}

	static getUserInput(uid) {
		//
		// Create a new Schedule C and initialize it with information from the Web page.
		//
		if (!uid) {
			throw new Error("F1040SC.getUserInput: UID is undefined.");
		}

		const element = document.getElementById(`f1040sc-${uid}-details`);
		if (!element) {
			throw new Error(`F1040SC.getUserInput: Element not found: f1040sc-${uid}-details`);
		}

		let inputs = {};

		inputs["01"]		= HTML.getUserInput(`f1040sc-${uid}-01`, "");
		inputs["02"]		= HTML.getUserInput(`f1040sc-${uid}-02`, "");
		inputs["03"]		= HTML.getUserInput(`f1040sc-${uid}-03`, "");
		inputs["04"]		= HTML.getUserInput(`f1040sc-${uid}-04`, "");
		inputs["05"]		= HTML.getUserInput(`f1040sc-${uid}-05`, "");
		inputs["06"]		= HTML.getUserInput(`f1040sc-${uid}-06`, "");
		inputs["07"]		= HTML.getUserInput(`f1040sc-${uid}-07`, "");
		inputs["08"]		= HTML.getUserInput(`f1040sc-${uid}-08`, "");
		inputs["09"]		= HTML.getUserInput(`f1040sc-${uid}-09`, "");
		inputs["10"]		= HTML.getUserInput(`f1040sc-${uid}-10`, "");
		inputs["11"]		= HTML.getUserInput(`f1040sc-${uid}-11`, "");
		inputs["12"]		= HTML.getUserInput(`f1040sc-${uid}-12`, "");
		inputs["13"]		= HTML.getUserInput(`f1040sc-${uid}-13`, "");
		inputs["14"]		= HTML.getUserInput(`f1040sc-${uid}-14`, "");
		inputs["15"]		= HTML.getUserInput(`f1040sc-${uid}-15`, "");
		inputs["16a"]		= HTML.getUserInput(`f1040sc-${uid}-16a`, "");
		inputs["16b"]		= HTML.getUserInput(`f1040sc-${uid}-16b`, "");
		inputs["17"]		= HTML.getUserInput(`f1040sc-${uid}-17`, "");
		inputs["18"]		= HTML.getUserInput(`f1040sc-${uid}-18`, "");
		inputs["19"]		= HTML.getUserInput(`f1040sc-${uid}-19`, "");
		inputs["20a"]		= HTML.getUserInput(`f1040sc-${uid}-20a`, "");
		inputs["20b"]		= HTML.getUserInput(`f1040sc-${uid}-20b`, "");
		inputs["21"]		= HTML.getUserInput(`f1040sc-${uid}-21`, "");
		inputs["22"]		= HTML.getUserInput(`f1040sc-${uid}-22`, "");
		inputs["23"]		= HTML.getUserInput(`f1040sc-${uid}-23`, "");
		inputs["24a"]		= HTML.getUserInput(`f1040sc-${uid}-24a`, "");
		inputs["24b"]		= HTML.getUserInput(`f1040sc-${uid}-24b`, "");
		inputs["25"]		= HTML.getUserInput(`f1040sc-${uid}-25`, "");
		inputs["26"]		= HTML.getUserInput(`f1040sc-${uid}-26`, "");
		inputs["27a"]		= HTML.getUserInput(`f1040sc-${uid}-27a`, "");
		inputs["27b"]		= HTML.getUserInput(`f1040sc-${uid}-27b`, "");
		inputs["28"]		= HTML.getUserInput(`f1040sc-${uid}-28`, "");
		inputs["29"]		= HTML.getUserInput(`f1040sc-${uid}-29`, "");
		inputs["30"]		= HTML.getUserInput(`f1040sc-${uid}-30`, "");
		inputs["31"]		= HTML.getUserInput(`f1040sc-${uid}-31`, "");

		if (!Objects.isUsed(inputs)) {
			return;
		}

		const f1040sc = TaxFormObj.createForm("F1040SC");

		f1040sc.lines["01"  ].user_value	= inputs["01"];
		f1040sc.lines["02"  ].user_value	= inputs["02"];
		f1040sc.lines["03"  ].user_value	= inputs["03"];
		f1040sc.lines["04"  ].user_value	= inputs["04"];
		f1040sc.lines["05"  ].user_value	= inputs["05"];
		f1040sc.lines["06"  ].user_value	= inputs["06"];
		f1040sc.lines["07"  ].user_value	= inputs["07"];
		f1040sc.lines["08"  ].user_value	= inputs["08"];
		f1040sc.lines["09"  ].user_value	= inputs["09"];
		f1040sc.lines["10"  ].user_value	= inputs["10"];
		f1040sc.lines["11"  ].user_value	= inputs["11"];
		f1040sc.lines["12"	].user_value	= inputs["12"];
		f1040sc.lines["13"	].user_value	= inputs["13"];
		f1040sc.lines["14"	].user_value	= inputs["14"];
		f1040sc.lines["15"  ].user_value	= inputs["15"];
		f1040sc.lines["16a"  ].user_value	= inputs["16a"];
		f1040sc.lines["16b"  ].user_value	= inputs["16b"];
		f1040sc.lines["17"  ].user_value	= inputs["16"];
		f1040sc.lines["18"  ].user_value	= inputs["18"];
		f1040sc.lines["19"  ].user_value	= inputs["19"];
		f1040sc.lines["20a"  ].user_value	= inputs["20a"];
		f1040sc.lines["20b"  ].user_value	= inputs["20b"];
		f1040sc.lines["21"  ].user_value	= inputs["21"];
		f1040sc.lines["22"  ].user_value	= inputs["22"];
		f1040sc.lines["23"  ].user_value	= inputs["23"];
		f1040sc.lines["24a"  ].user_value	= inputs["24a"];
		f1040sc.lines["24b"  ].user_value	= inputs["24b"];
		f1040sc.lines["25"  ].user_value	= inputs["25"];
		f1040sc.lines["26"  ].user_value	= inputs["26"];
		f1040sc.lines["27a"  ].user_value	= inputs["27a"];
		f1040sc.lines["27b"  ].user_value	= inputs["27b"];
		f1040sc.lines["28"  ].user_value	= inputs["28"];
		f1040sc.lines["29"  ].user_value	= inputs["29"];
		f1040sc.lines["30"  ].user_value	= inputs["30"];
		f1040sc.lines["31"  ].user_value	= inputs["31"];
	}

	constructor(formname) {
		Debug.enter("F1040SC.Constructor()");
		super(formname);

		// Income
		this.lines["01"]	= new Line("Gross Receipts or Sales");
		this.lines["02"]	= new Line("Returns and Allowances");
		this.lines["03"]	= new Line("Line 1 - Line 2");
		this.lines["04"]	= new Line("Cost of Goods Sold");
		this.lines["05"]	= new Line("Gross Profit");
		this.lines["06"]	= new Line("Other Income");
		this.lines["07"]	= new Line("Gross Income");

		// Expenses
		this.lines["08"]	= new Line("Advertising");
		this.lines["09"]	= new Line("Car and Truck Expense");
		this.lines["10"]	= new Line("Commission and Fees");
		this.lines["11"]	= new Line("Contract Labor");
		this.lines["12"]	= new Line("Depletion");
		this.lines["13"]	= new Line("Depreciation");
		this.lines["14"]	= new Line("Employee Benefit Programs");
		this.lines["15"]	= new Line("Insurance");
		this.lines["16a"]	= new Line("Mortgage Interest");
		this.lines["16b"]	= new Line("Other Interest");
		this.lines["17"]	= new Line("Professional Services");
		this.lines["18"]	= new Line("Office Expenses");
		this.lines["19"]	= new Line("Pension Plan");
		this.lines["20a"]	= new Line("Rent Machinery");
		this.lines["20b"]	= new Line("Rent Other");
		this.lines["21"]	= new Line("Repairs and Maintenance");
		this.lines["22"]	= new Line("Supplies");
		this.lines["23"]	= new Line("Taxes and Licenses");
		this.lines["24a"]	= new Line("Travel");
		this.lines["24b"]	= new Line("Travel Meals");
		this.lines["25"]	= new Line("Utilities");
		this.lines["26"]	= new Line("Wages");
		this.lines["27a"]	= new Line("Energy Efficiency Deduction");
		this.lines["27b"]	= new Line("Other Expense");

		this.lines["28"]	= new Line("Total Expenses");
		this.lines["29"]	= new Line("Tentative profit");
		this.lines["30"]	= new Line("Business Use of Home Expense");
		this.lines["31"]	= new Line("Net Profit");

		Debug.exit("F1040SC.Constructor()");
	}

	calculate() {
		if (this.calculated) {
			throw new Error(`${this.formname} already calculated.`);
		}

		Debug.enter("F1040SC.calculate()");
		this.calculated = true;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		// Income
		this.lines["01"].value	= 0;										// Gross Receipts or Sales
		this.lines["02"].value	= 0;										// Returns and Allowances
		this.lines["03"].value	= this.subtract("01", "02");
		this.lines["04"].value	= 0;										// Cost of Goods Sold
		this.lines["05"].value	= this.subtract("03", "04");				// Gross Profit
		this.lines["06"].value	= 0;										// Other Income
		this.lines["07"].value	= this.add("05", "06");						// Gross Income

		// Expenses
		this.lines["08"].value	= 0;										// Advertising
		this.lines["09"].value	= 0;										// Car and Truck Expense
		this.lines["10"].value	= 0;										// Commission and Fees
		this.lines["11"].value	= 0;										// Contract Labor
		this.lines["12"].value	= 0;										// Depletion
		this.lines["13"].value	= 0;										// Depreciation
		this.lines["14"].value	= 0;										// Employee Benefit Programs
		this.lines["15"].value	= 0;										// Insurance
		this.lines["16a"].value	= 0;										// Mortgage Interest
		this.lines["16b"].value	= 0;										// Other Interest
		this.lines["17"].value	= 0;										// Professional Services
		this.lines["18"].value	= 0;										// Office Expenses
		this.lines["19"].value	= 0;										// Pension Plan
		this.lines["20a"].value	= 0;										// Rent Machinery
		this.lines["20b"].value	= 0;										// Rent Other
		this.lines["21"].value	= 0;										// Repairs and Maintenance
		this.lines["22"].value	= 0;										// Supplies
		this.lines["23"].value	= 0;										// Taxes and Licenses
		this.lines["24a"].value	= 0;										// Travel
		this.lines["24b"].value	= 0;										// Travel Meals
		this.lines["25"].value	= 0;										// Utilities
		this.lines["26"].value	= 0;										// Wages
		this.lines["27a"].value	= 0;										// Energy Efficiency Deduction
		this.lines["27b"].value	= 0;										// Other Expense

		this.lines["28"].value	= this.add("08","09","10","11","12","13",	// Total Expenses
										   "14","15","16a","16b","17","18","19","20a","20b","21",
										   "22","23","24a","24b","25","26","27a","27b");
		this.lines["29"].value	= this.subtract("07", "28");				// Tentative profit
		this.lines["30"].value	= 0;										// Business Use of Home Expense
		this.lines["31"].value	= this.subtract("29", "30");				// Net Profit

		Debug.exit("F1040SC.calculate()");
	}

	getOutputHTML(uid) {
		if (!uid) {
			throw new Error(`${this.formname}.getOutputHTML(): UID is undefined.`);
		}

		return [ `f1040sc-${uid}-details`, HTML_FORM.replace(/XX/g, uid) ];
	}
}
