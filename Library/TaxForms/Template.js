
import { Debug }	from "../Classes/Debug.js";
import { TaxForm }	from "../Classes/TaxForm.js";
import { TaxForms }	from "../Classes/TaxForms.js";
import { Line }		from "../Classes/Line.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

const HTML_FORM = `
		<details class="taxform-container" id="template-details">
			<summary class="taxform-title">Taxform Template</summary>
			<div>&nbsp;</div>
			<div class="taxform-container">
				<div class="taxform-lno-desc-lno-value">
					<p class="lineno">01a</p>
					<p class="description">Xxxxxxxxxxxxxxxxxxxxxx</p>
					<p class="lineno">01a</p>
					<p class="value" id="01a">0</p>
				</div>
				<div class="taxform-lno-desc-lno-value-lno-value">
					<p class="lineno">01a</p>
					<p class="description">Xxxxxxxxxxxxxxxxxxxxxx</p>
					<p class="lineno">01a</p>
					<p class="value" id="01a">0</p>
					<p class="notused"></p>
					<p class="notused"></p>
				</div>
				<div class="taxform-lno-desc-lno-value-label-lno-value">
					<p class="lineno">01a</p>
					<p class="description">Xxxxxxxxxxxxxxxxxxxxxx</p>
					<p class="lineno">01a</p>
					<p class="value" id="01a">0</p>
					<p class="label">Xxxxxxxxxxxxxxxxxxxxxx</p>
					<p class="lineno">01b</p>
					<p class="value" id="01b">0</p>
				</div>
			</div>
			<div>&nbsp;</div>
		</details>
`;

export class Template extends TaxForm {
	static getHTML() {
		return [ "template-details", HTML_FORM ];
	}

	constructor(formname) {
		Debug.enter("Template.Constructor()");
		super(formname);

		this.lines["01"]	= new Line("");
		this.lines["02"]	= new Line("");
		this.lines["03"]	= new Line("");
		this.lines["04"]	= new Line("");
		this.lines["05"]	= new Line("");
		this.lines["06"]	= new Line("");
		this.lines["07"]	= new Line("");
		this.lines["08"]	= new Line("");
		this.lines["09"]	= new Line("");
		this.lines["10"]	= new Line("");
		this.lines["11"]	= new Line("");
		this.lines["12"]	= new Line("");
		this.lines["13"]	= new Line("");
		this.lines["14"]	= new Line("");
		this.lines["15"]	= new Line("");
		this.lines["16"]	= new Line("");
		this.lines["17"]	= new Line("");
		this.lines["18"]	= new Line("");
		this.lines["19"]	= new Line("");
		this.lines["20"]	= new Line("");
		this.lines["21"]	= new Line("");
		this.lines["22"]	= new Line("");
		this.lines["23"]	= new Line("");
		this.lines["24"]	= new Line("");
		this.lines["25"]	= new Line("");
		this.lines["26"]	= new Line("");
		this.lines["27"]	= new Line("");
		this.lines["28"]	= new Line("");
		this.lines["29"]	= new Line("");
		this.lines["30"]	= new Line("");
		this.lines["31"]	= new Line("");
		this.lines["32"]	= new Line("");
		this.lines["33"]	= new Line("");
		this.lines["34"]	= new Line("");
		this.lines["35"]	= new Line("");
		this.lines["36"]	= new Line("");
		this.lines["37"]	= new Line("");
		this.lines["38"]	= new Line("");
		this.lines["39"]	= new Line("");
		this.lines["40a"]	= new Line("");
		this.lines["40b"]	= new Line("");
		this.lines["40c"]	= new Line("");
		this.lines["40d"]	= new Line("");
		this.lines["40e"]	= new Line("");
		this.lines["40f"]	= new Line("");
		this.lines["40g"]	= new Line("");
		this.lines["40h"]	= new Line("");
		this.lines["40i"]	= new Line("");
		this.lines["40j"]	= new Line("");
		this.lines["40k"]	= new Line("");
		this.lines["40l"]	= new Line("");
		this.lines["40m"]	= new Line("");
		this.lines["40n"]	= new Line("");
		this.lines["40o"]	= new Line("");
		this.lines["40p"]	= new Line("");
		this.lines["40q"]	= new Line("");
		this.lines["40r"]	= new Line("");
		this.lines["40s"]	= new Line("");
		this.lines["named_return"]	= new Line("Named Return");

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
		this.lines["03"].value	= 0;	//
		this.lines["04"].value	= 0;	//
		this.lines["05"].value	= 0;	//
		this.lines["06"].value	= 0;	//
		this.lines["07"].value	= 0;	//
		this.lines["08"].value	= 0;	//
		this.lines["09"].value	= 0;	//
		this.lines["10"].value	= 0;	//

		this.lines["named_return"].value = this.line(10);
		Debug.exit("Template.calculate()");
	}
}
