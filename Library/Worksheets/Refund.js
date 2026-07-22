
//
// Compute the taxable portion of the state income tax refund.
//
// IRS Publication: 1040 Instructions, see the section for Schedule 1, Additional
// Income, Line 1 on page 88. Instructions say to use the State and Local Income
// Tax Refund Worksheet on page 90, which is implemented in this worksheet.
//
import { Debug }	from "../Classes/Debug.js";
import { Form }		from "../Classes/Form.js";
import { Forms }	from "../Classes/Forms.js";
import { Line }		from "../Classes/Line.js";
import { Str }		from "../Classes/Str.js";
import { TaxTable }	from "../Classes/TaxTable.js";
import { Taxpayer }	from "../Classes/Taxpayer.js";

export class Refund extends Form {
	constructor(formname) {
		Debug.enter("Refund.Constructor()");
		super(formname);

		Forms.addForm(formname, this);

		// Inputs
		this.lines["sched_a_5d"]		= new Line("Previous Tax Year, State and Local Taxes");
		this.lines["sched_a_5e"]		= new Line("Previous Tax Year, Amount Limited by SALT Cap");
		this.lines["itemized_deductions"] = new Line("Previous Tax Year, Itemized Deductions");
		this.lines["refund"]			= new Line("State Tax Refund");

		// Worksheet Lines
		this.lines["01"]	= new Line("Refund");
		this.lines["02"]	= new Line("");
		this.lines["03"]	= new Line("");
		this.lines["04"]	= new Line("Itemized Deductions");
		this.lines["05"]	= new Line("");
		this.lines["06"]	= new Line("");
		this.lines["07"]	= new Line("");
		this.lines["08"]	= new Line("");
		this.lines["09"]	= new Line("Taxable mount");

		// Outputs
		this.lines["taxable_amount"]	= new Line("Taxable Amount");
		this.lines["explanation"]		= new Line("Explanation");

		Debug.exit("Refund.Constructor()");
	}

	calculate() {
		if (!this.modified) {
			throw new Error(`${formname} already calculated.`);
		}

		Debug.enter("Refund.calculate()");
		this.modified = false;
		const tt = TaxTable.getTaxTable();
		const tp = Taxpayer.getTaxpayer();

		// Inputs
		this.lines["sched_a_5d"].value			= 0;	// Previous Tax Year, State and Local Taxes
		this.lines["sched_a_5e"].value			= 0;	// Previous Tax Year, Amount Limited by SALT Cap
		this.lines["itemized_deductions"].value	= 0;	// Previous Tax Year, Itemized Deductions
		this.lines["refund"].value				= Math.min(	// State Tax Refund
													Forms.getValue("F1099G", "02"),
													this.line("sched_a_5d"));
		// Outputs
		this.lines["taxable_amount"].value		= 0;
		this.lines["explanation"].value			= 0;

		// When filing MFS, if one spouse itemizes then the other spouse is required to itemize as well. Since
		// it is only necessary to determine if a tax refund is taxable if the taxpayer itemized, we can assume
		// that if the filing status is MFS, the taxpayer is required to itemize.
		let spouse_itemized = true;

		this.lines["01"].value = this.line("refund");				// Income tax refund from 1099-G
		if (this.line("sched_a_5d") > this.line("sched_a_5e")) {	// Total taxes > Taxes limited by SALT cap
			// SALT taxes were limited by SALT cap.
			this.lines["02"].value = this.subtract("sched_a_5d", "sched_a_5e");	// Amount of taxes limited by SALT cap

			if (this.line("01") > this.line("02")) {
				this.lines["03"].value	= this.subtract("01", "02");	// Amount of refund not covered by excess SALT.
				this.lines["explanation"].value	= "Part of refund is less than the amount of the state and " +
						"local taxes that are over the SALT cap. The remainder of the refund is taxable.";
			} else {
				this.lines["explanation"].value	= "All of refund is less than the amount of state and " +
						" local taxes that are over the SALT cap. The refund is not taxable.";
				return;
			}
		} else {
			// SALT taxes were not limited by SALT cap.
			this.lines["03"].value	= this.line("01");
			this.lines["explanation"].value	= "The state and local taxes are not limited by the SALT " +
						"cap. The refund is taxable.";
		}

		this.lines["04"].value = this.line("itemized_deductions");
		if (Str.caseEqual(tp.filing_status, "MFS") && spouse_itemized) {
			this.lines["08"].value = this.line("04");
		} else {
			this.lines["05"].value	= 0;	// Get base standard deduction
			this.lines["06"].value	= 0;	// Get extra standard deduction
			this.lines["07"].value	= tt.getStandardDeduction(tp.filing_status,
											tp.taxpayers_age, tp.spouses_age,
											tp.is_taxpayer_blind, tp.is_spouse_blind);
			if (this.line("07") < this.line("04")) {
				this.lines["08"].value	= this.subtract("04", "07");	// Itemized deductions - standard deduction
			} else {
				this.lines["explanation"].value	= "Itemized deductions were less than the standard " +
						"deduction. The taxpayer could have used the standard deduction.";
				return;
			}
		}

		if (this.line("08") < this.line("03")) {	// Itemized deductions - standard deduction < taxable part of refund?
			this.lines["09"].value = this.line("08");
			this.lines["explanation"].value	= "Taxable part of refund was greater than the difference " +
						"between itemized and standard deductions, so taxable amount is limited to " +
						"that difference.";
		} else {
			this.lines["09"].value = this.line("03");
			// Line =_3 explanation was set above.
		}

		this.lines["taxable_amount"].value = this.line("09")
		Debug.exit("Refund.calculate()");
		return;
	}
}
