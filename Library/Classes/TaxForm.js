
//
// This is a template for all tax forms and worksheets.
//
import { Debug }		from "../Classes/Debug.js";
import { HTMLBuild }	from "../Classes/HTMLBuild.js";

export class TaxForm {
	constructor(formname) {
		this.name			= formname;		// Same as class name.
		this.lines			= {};
		this.calculated		= false;		// True => need to call calculate().
		this.isSingleton	= true;			// Only one form of this type allowed.
	}

	add(...indexlist) {
		let sum = 0;

		for (let index of indexlist) {
			sum += this.lines[index].value
		}

		return sum;
	}

	isUsed() {
		for (const line of Object.keys(this.lines)) {
			if (line.value) {
				return true;
			}
		}
		return false;
	}

	line(lineno) {
		return this.lines[lineno].value;
	}

	min(...indexlist) {
		let values = [];

		for (let index of indexlist) {
			values.push(this.lines[index].value);
		}

		return Math.min(...values);
	}

	max(...indexlist) {
		let values = [];

		for (let index of indexlist) {
			values.push(this.lines[index].value);
		}

		return Math.max(...values);
	}

	round(index) {
		return Math.round(this.lines[index].value);
	}

	subtract(lineno1, lineno2) {
		return this.lines[lineno1].value - this.lines[lineno2].value;
	}

	toConsole() {
		console.log(this.toString());
	}

	toHTML() {
		const doc = new HTMLBuild();
		doc.startElement("details", "taxform-details");		// Start of details
			doc.addElement("summary", "taxform-title", this.formname);
			doc.startElement("div", "taxform-container");	// Start of taxform-contianer
				doc.addElement("div", "", "&nbsp;");		// Blank line
				for (const lineno of Object.keys(this.lines).sort()) {
					let line = this.lines[lineno];
					doc.startElement("div", "taxform-lno-desc-value");	// Start of line
						doc.addElement("p", "lineno",		lineno);
						doc.addElement("p", "description",	line.label);
						doc.addElement("p", "value",		line.value);
					doc.stopElement("div");					// End of line
				}
				doc.addElement("div", "", "&nbsp;");		// Blank line
			doc.stopElement("div");							// End of taxform-contianer
		doc.stopElement("div");								// End of details
		
		return doc.toString();
	}

	toPrint() {
		return this.toString();
	}

	toString() {
		let str		= [];
		let title	= [];

		title.push(`Form: ${this.name}`);

		const linenos = Object.keys(this.lines).sort();
		for (const lineno of linenos) {
			let line = this.lines[lineno];
			if (line.value || Debug.verbose()) {	// Skip empty lines.
				let s = `	line[${lineno}]`;
				s = s.padEnd(18, " ") + line.label;
				s = s.padEnd(65, " ") + line.value;
				str.push(s);
			}
		}

		if (str.length > 0) {
			str = title.concat(str);
			str.push("");
			str.push("");
			return str.join("\n");
		} else {
			return "";
		}
	}
}
