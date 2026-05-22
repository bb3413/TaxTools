
function addListener(elementID, event, handler) {
	const element = document.getElementById(elementID);
	if (!element) {
		alert("addListener: Element not found: " + elementID);
	} else {
		element.addEventListener(event, handler);
	}
}

function getCSSGlobalVariable(variableName) {
	//
	// if you define a global variable in CSS, for example:
	//		:root {
	//			--background-color:			#AAAAAA;	// Gray
	//		}
	// 
	// Then, if you pass "--background-color" to this function, it will
	// look up the variable and return "#AAAAAA".
	//
	
	// Read the CSS variable from the root (or from a specific element)
	const rootStyles	= getComputedStyle(document.documentElement);
	const value			= rootStyles.getPropertyValue(variableName).trim();
	
	return value;
}

function changeBackgroundColor(elementID, color) {
	document.getElementById(elementID).style.background = color;
}

function changeTextColor(elementID, color) {
	document.getElementById(elementID).style.color = color;
}

function getUserInput(elementID, type = "number") {
	
	let value = getElementValue(elementID);
	
	if (typeof value === "boolean") {
		return value;
	}
	
	// Maybe some tools do not include the debug code.
	if (typeof getDebugKeywords === "function") {
		// Extract debug keywords and return what is left.
		value = getDebugKeywords(value);
	}
	
	if (strCaseEqual(type, "text")) {
		return value;
	}

	// Process dollar sign, commas, and mathmatical expressions.
	return toInteger(value);
}

function putUserOutput(elementID, value, type = "number") {
	
	if (strCaseEqual(type, "dollars")) {
		// Add commas and prepend with dollar sign.
		putElementValue(elementID, "$" + FormatNum(value));
			
	} else if (strCaseEqual(type, "number")) {
		// Add commas.
		putElementValue(elementID, FormatNum(value));

	} else {	// tpye === "text"
		// Put the value as is.
		putElementValue(elementID, value);
	}
}

//
// Elements designed for user input, <inout>, <select> (drop down lists), and
//	<textarea>, have their content in the "value" attribute. Check boxes and radio
// buttons have "true" or "false" in the "checked" attribute.
//
// Other elements use "textContent" and "innerText". The "textContent" attribute
// returns the content of the element. The "innerText" attribute is not used often;
// it returns the content as it is displayed. If the elemenet is hidden, it won"t
// return the content. 
//

function getElementValue(elementID) {
	const element = document.getElementById(elementID);
	if (!element) {
		alert("getElementValue: Element not found: " + elementID);
	} else {
		if (element.type === "checkbox" || element.type === "radio") {
			return element.checked; 
		}

		if (element.tagName === "SELECT" && element.multiple) {
			// If multiple selections are possible, value only gets the first one. 
			// This functions returns them all.
			return Array.from(element.selectedOptions).map(opt => opt.value);
		}

		if ("value" in element) {
			// Get input, textarea, and selects elements.
			return element.value;
		}

		// Get other elements (div, span, p).
		return element.textContent;
	}
}

function putElementValue(elementID, value) {
	const element = document.getElementById(elementID);
	if (!element) {
		alert("putElementValue: Element not found: " + elementID);
	} else {
		if (element.type === "checkbox" || element.type === "radio") {
			element.checked = Boolean(value);
			return;
		}
			
		if (element.tagName === "SELECT" && element.multiple && Array.isArray(value)) {
			// Restore selection where multiple selections are possible.
			Array.from(element.options).forEach(opt => {
				opt.selected = value.includes(opt.value);
			});
			return;
		}
		
		if ("value" in element) {
			// Restore input, textarea, and selects elements.
			element.value = value;
			return;
		}

		// Restore other elements (e.g., div, span, p).
		element.textContent = value;
		return;
	}
}
