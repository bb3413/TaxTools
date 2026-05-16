
/*
 * This file contains generic functions for working with strings.
 */

function strCaseEqual(s1, s2) {
	return s1.toLowerCase() === s2.toLowerCase();
}

function strClean(s) {
	// Remove leading, training, and consecutive whitespace characters.
	return s.trim().replace(/\s+/g, " ");
}

function strDownshift(s) {
	return s.toLowerCase();
}

function strEmpty(s) {
	// Return true if:
	//		Null
	//		Undefined
	//		Empty ("")
	//		Contains only whitespace
	//
	// The "s?" expression stops early and returns undefined.
	
	return !s?.trim();
}

function strEqual(s1, s2) {
	return s1 === s2;
}

function strUpshift(s) {
	return s.toUpperCase();
}

