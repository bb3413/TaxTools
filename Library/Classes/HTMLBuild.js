
//
// This module can be used to build a chunk of HTML code and insert
// it into the current web page (DOM).
//

/* Example

	const doc = new HTMLBuild();
	doc.startElement("div");
	doc.addElement("p", "", "This is the first dynamically added line.");
	doc.addElement("p", "", "This is the second dynamically added line.");
	doc.stopElement("div");
	doc.putAfter("TaxReturnContainer");

	// Remove the document.
	const htmldoc = HTMLBuild.getDoc();
	if (htmldoc) {
		htmldoc.remove();
	}
*/

let instance = undefined;
						
export class HTMLBuild {
	constructor() {
		instance = this;

		this._htmldoc	= [];
		this._id		= "";
	}

	//
	// Getter methods
	//
	get htmldoc(){	return this._htmldoc };
	get id(){		return this._id };

	//
	// Setter methods
	//
	set htmldoc(doc) {
		if (typeof doc === "string") {
			this._htmldoc = [ doc ];
		} else if (Array.isArray(doc)) {
			// Careful; this is only a reference to the doc, so it can still be
			// modified outside the object.
			this._htmldoc = doc;
		} else {
			throw new Error("HTMLBuild.set htmldoc(): Invalid parameter.");
		}
	}

	set id(str) {
		this._id = str;
	}

	//
	// Static methods
	//
	static getDoc() {
		return instance;
	}

	static reset() {
		if (instance) {
			instance.remove();
		}
		instance = undefined;
	}

	//
	// Methods
	//
	addElement(element, css_class, str) {
		let css_str = "";
		if (css_class) {
			css_str = `class="${css_class}"`
		}
		const line = `<${element} ${css_str}>${str}</${element}>`;
		this.htmldoc.push(line);
	}

	putAfter(element_id) {
		if (this.id) {
			throw new Error(`HTMLBuild.putAfter(): Document already put.`);
		}
		this.id = "HTMLBuildID-" + Math.floor(Math.random() * 1000);
		const start	= `<div id=${this.id}>\n`;
		const stop	= "</div>\n";
		const where	= "afterend";		// beforebegin, afterbegin, beforeend, afterend
		const whole_doc = start + this.htmldoc.join("\n"); + stop;

		const element = document.getElementById(element_id);
		element.insertAdjacentHTML(where, whole_doc);
		this.added = true;
	}

	remove() {
		if (!this.id) {
			return;	// Already removed.
		}
		const element = document.getElementById(this.id);
		if (element) {
			element.remove();
			this.id = "";
		} else {
			throw new Error(`HTMLBuild.remove(): Cannot find element to remove(${this.id})`);
		}
	}

	stopElement(element, str) {
		const line = `${str}</${element}>`;
		this.htmldoc.push(line);
	}

	startElement(element, css_class="", str="") {
		let css_str = "";
		if (css_class) {
			css_str = `class="${css_class}"`
		}
		const line = `<${element} ${css_str}>${str}`;
		this.htmldoc.push(line);
	}
}
