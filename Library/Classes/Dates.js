
export class Dates {
	static getAge(start_date, end_date) {
		// Determine the number of years between the start date and end date.
		const startday	= Dates.getDateObject(start_date);
		const endday	= Dates.getDateObject(end_date);

		// Make sure the dates are valid.
		if (!startday || !endday)
			return 0;

		const start_year		= startday.getFullYear();
		const end_year			= endday.getFullYear();
		const startday_end_year	= new Date(start_date);
		let age					= end_year - start_year;

		// Has the anniversery of the start day happended this year yet?
		startday_end_year.setFullYear(end_year);
		if (Dates.isBefore(endday, startday_end_year)) {	// Birthday has not occurred this year.
			age -= 1;
		}

		return age;
	}

	static getEndOfYearAge(birthday, year) {
		return Dates.getAge(birthday, new Date("12/31/" + year).toLocaleDateString());
	}

	static getLastYear() {
		return Dates.getThisYear() - 1;
	}

	static getTaxYear() {
		const today		= new Date();
		const tax_day	= new Date("04/15/" + Dates.getThisYear());

		if (today < tax_day) {
			return Dates.getLastYear();
		} else {
			return Dates.getThisYear();
		}
	}

	static getThisYear() {
		return new Date().getFullYear();
	}

	static getToday() {
		// Return today's date formatted as mm/dd/yyyy.
		return new Date().toLocaleDateString();
	}

	static getDateObject(date) {
		// If date is a Date object, return it; otherwise, create a date object.

		const d = date instanceof Date ? date : new Date(date);

		return Number.isNaN(d.getTime()) ? null : d;

	}

	static isBefore(date1, date2) {
		// Convert to milliseconds since 1/1/1970 and compare numerically.
		return Dates.getDateObject(date1).getTime() < Dates.getDateObject(date2).getTime();
	}

	static isValid(date) {
		const d = date instanceof Date ? date : new Date(date);

		return Number.isNaN(d.getTime());

	}
}
