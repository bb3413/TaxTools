
/*
 * This file contains generic functions for working with dates.
 */
 
function Age(start_date, end_date) {
	// Determine the number of years between the start date and end date.
	const startday	= getDateObject(start_date);
	const endday	= getDateObject(end_date);

	// Make sure the dates are valid.
	if (!startday || !endday)
		return 0;

	const start_year		= startday.getFullYear();
	const end_year			= endday.getFullYear();
	const startday_end_year	= new Date(start_date);
	let age					= end_year - start_year;

	// Has the anniversery of the start day happended this year yet?
	startday_end_year.setFullYear(end_year);
	if (isBefore(endday, startday_end_year)) {	// Birthday has not occurred this year.
		age -= 1;
	}

	return age;
}

function getLastYear() {
	return getThisYear() - 1;
}

function getTaxYear() {
	const today		= new Date();
	const tax_day	= new Date("04/15/" + getThisYear());
	
	if (today < tax_day) {
		return getLastYear();
	} else {
		return getThisYear();
	}
}

function getThisYear() {
	return new Date().getFullYear();
}

function getToday() {
	// Return today's date formatted as mm/dd/yyyy.
	return new Date().toLocaleDateString();
}

function getDateObject(date) {
	// If date is a Date object, return it; otherwise, create a date object.
	
	const d = date instanceof Date ? date : new Date(date);
	
	return Number.isNaN(d.getTime()) ? null : d;

}

function isBefore(date1, date2) {
	// Convert to milliseconds since 1/1/1970 and compare numerically.
	return getDateObject(date1).getTime() < getDateObject(date2).getTime();
}

function isValidDate(date) {
	const d = date instanceof Date ? date : new Date(date);
	
	return Number.isNaN(d.getTime());

}





