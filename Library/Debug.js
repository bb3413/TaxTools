
// By using a count for each keyword, we can allow the debug keywords to be entered from
// multiple places. If the keyword is specified anywhere, it turns on the debugging
// (count > 0). Conversely, removing the keyword only turns off debugging if the keyword
// isn"t spcified anywhere else.
let debug			= 0;
let dbg_inctax		= 0;
let dbg_setax		= 0;
let dbg_sstax		= 0;

let tracing			= 0;
let	indentation		= 0;

//
// Debug Fields are HTML fields that display additional information when debugging is enabled.
//
function HideDebugFields(name) {
	const debug_fields = document.getElementById(name);
	if (debug_fields) {
		// Only hide if element exists; non-existant element is not an error.
		hideElement(name);
	}
}

function ShowDebugFields(name) {
	const debug_fields = document.getElementById(name);
	if (debug_fields) {
		// Only show if element exists; non-existant element is not an error.
		showElement(name);
	}
}

function TurnOffDebug() {
	dbgEnter("TurnOffDebug");

	debug		= 0;
	dbg_inctax	= 0;
	dbg_setax	= 0;
	dbg_sstax	= 0;
	
	// Tools
	HideDebugFields("DebugFields");				// Tax tool debug fields

	// Libraries
	HideDebugFields("IncTax-DebugFields");		// Federal income tax worksheet
	HideDebugFields("SETax-DebugFields");		// Self-employment tax worksheet
	HideDebugFields("SSTax-DebugFields");		// Taxable Social Secirity worksheet
	
	dbgExit("TurnOffDebug");
}

function TurnOnDebug() {
	dbgEnter("TurnOnDebug");
	
	// Tools - These are all turned on with the "debug" keyword.
	if (debug)		ShowDebugFields("DebugFields");			// Tax tool debug fields
	
	// Libraries - These are all turned on with individual keywords.
	if (dbg_inctax)	ShowDebugFields("IncTax-DebugFields");	// Federal income tax worksheet
	if (dbg_setax)	ShowDebugFields("SETax-DebugFields");	// Self-employment tax worksheet
	if (dbg_sstax)	ShowDebugFields("SSTax-DebugFields");	// Taxable Social Secirity worksheet

	dbgExit("TurnOnDebug");
}

//
// Parse a numeric input string to find debug keywords
//
// This function allow a numeric value entered by the user to contain debugging keywords
// in addition the numeric value. The following keywords are supported.
//
//		Debug		Show debug information for the tool
//		IncTax		Federal income tax worksheet
//		SETax		Self-employment tax worksheet
//		SSTax		Taxable Social Secirity worksheet
//		Trace		Trace function calls on console long.
//
// The keywords are not case-sensitive and they may appear in any order wirthin the input
// string. Commas and dollar signs will be removed (because the input is usually a dollar
// amount). Examples of input strings allowed by this function are:
//
//		500						Function returns 500; hides the debug information
//		500, debug				Function returns 500; shows the debug information
//		$500,000 Debug, IncTax	Function returns 500000; shows debug information for
//								the tool and the income tax calculation.
//
function getDebugKeywords(input_string) {

	if (input_string.match(/\bDebug\b/i)) {
		input_string	= input_string.replace(/\bDebug\b/ig, "");
		debug			+= 1;
	}
	
	if (input_string.match(/\bIncTax\b/i)) {
		input_string	= input_string.replace(/\bIncTax\b/ig, "");
		dbg_inctax		+= 1;
	}
	
	if (input_string.match(/SSTax/i)) {
		input_string	= input_string.replace(/\bSSTax\b/ig, "");
		dbg_sstax		+= 1;
	}
	
	if (input_string.match(/SETax/i)) {
		input_string	= input_string.replace(/\bSETax\b/ig, "");
		dbg_setax		+= 1;
	}

	if (input_string.match(/Trace/i)) {
		input_string	= input_string.replace(/\bTrace\b/ig, "");
		tracing			+= 1;
	}

	input_string = input_string.replace(/,\s*,/g, ",")			// Replace double commas with one comma
								.replace(/\s*/, " ")			// Replace whitespae with a single space
								.trim()							// Remove leading and trailing whitespace
								.replace(/^,\s*|\s*,$/g, "");	// Remove leading and trailing commas

	return input_string;
}

//
// This function is used for copying the value of a variable to a HTML debugging entry.
//
function putDebugOutput(basename, value, label1 = null, label2 = null) {
	
	// Do not call alert() if element is missing; debug code is included and may be present when
	// not executed from a server.

	let element = document.getElementById(basename + "-value");
	if (element) {
		element.textContent = FormatNum(value);
	}

	if (label1) {
		element = document.getElementById(basename + "-label1");
		if (element) {
			element.textContent = FormatNum(label1);
		}
	}
	
	if (label2) {
		element = document.getElementById(basename + "-label2");
		if (element) {
			element.textContent = FormatNum(label2);
		}
	}
}

//
// Debug tracing functions.
//
// For files that want to use these functions, but may not alway have this file included,
// put the following lines at the top of the file. It check whether the functions are defined
// and, if not, defines them to be a dummy function that does nothing.
//
//		globalThis.dbgEnter ??= () => {};
//		globalThis.dbgExit  ??= () => {};
//		globalThis.dbgLog   ??= () => {};
//
function dbgEnter(name) {
	if (tracing) {
		const spaces = " ".repeat(indentation * 2);
		indentation += 1;
		console.log(spaces + "> " + name);
	}
}

function dbgExit(name) {
	if (tracing) {
		indentation = Math.max(0, indentation - 1);
		const spaces = " ".repeat(indentation * 2);
		console.log(spaces + "< " + name);
	}
}

function dbgLog(message) {
	const spaces = " ".repeat(indentation * 2);
	console.log(spaces + message);
}

