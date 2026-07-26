
import { Dates }	from "../Classes/Dates.js";
import { Str }		from "../Classes/Str.js";

let taxpayer = undefined;		// Global variable.

export class Taxpayer {
	static getTaxpayer() {
		return taxpayer;
	}

	static reset() {
		taxpayer = undefined;
	}

	constructor() {
		taxpayer = this;

		this._tax_year					= Dates.getTaxYear();
		this._filing_status				= "Single";

		this._taxpayers_name			= "";
		this._taxpayers_birthday		= "";
		this._taxpayers_age				= 0;
		this._is_taxpayer_blind			= false;
		this._is_taxpayer_citizen		= true;
		this._taxpayer_has_ssn			= true;		// Not an ITIN

		this._spouses_birthday			= "";
		this._spouses_age				= 0;
		this._is_spouse_blind			= false;
		this._is_spouse_citizen			= true;
		this._spouse_has_ssn			= true;		// Not an ITIN

		this._lived_with_spouse			= true;		// Needed when filing MFS
		this._number_of_dependents		= 0;

		this._can_be_dependent			= false;	// Someone can clain taxpayer or spouse as a dependent
		this._rents_home				= false;	// For CA renter's credit
	}

	// Getter methods
	get tax_year( ){					return this._tax_year};
	get filing_status() {				return this._filing_status};

	get taxpayers_name() {				return this._taxpayers_name};
	get taxpayers_birthday() {			return this._taxpayers_birthday};
	get taxpayers_age() {				return this._taxpayers_age};
	get is_taxpayer_blind() {			return this._is_taxpayer_blind};
	get is_taxpayer_citizen() {			return this._is_taxpayer_citizen};
	get taxpayer_has_ssn() {			return this._taxpayer_has_ssn};

	get spouses_birthday() {			return this._spouses_birthday};
	get spouses_age() {					return this._spouses_age};
	get is_spouse_blind() {				return this._is_spouse_blind};
	get is_spouse_citizen() {			return this._is_spouse_citizen};
	get spouse_has_ssn() {				return this._spouse_has_ssn};

	get lived_with_spouse() {			return this._lived_with_spouse};
	get number_of_dependents() {		return this._number_of_dependents};

	// Setter methods
	set tax_year(year) {				this._tax_year					= year ?? this._tax_year; }
	set filing_status(fs) {				this._filing_status				= fs   ?? this._filing_status; }

	set taxpayers_name(name) {			this._taxpayers_name			= name ?? this._taxpayers_name; }
	set is_taxpayer_blind(bool) {		this._is_taxpayer_blind			= bool ?? this._is_taxpayer_blind; }
	set is_taxpayer_citizen(bool) {		this._is_taxpayer_citizen		= bool ?? this._is_taxpayer_citizen; }
	set taxpayer_has_ssn(bool) {		this._taxpayer_has_ssn			= bool ?? this._taxpayer_has_ssn; }

	set is_spouse_blind(bool) {			this._is_spouse_blind			= bool ?? this._is_spouse_blind; }
	set is_spouse_citizen(bool) {		this._is_spouse_citizen			= bool ?? this._is_spouse_citizen; }
	set spouse_has_ssn(bool) {			this._spouse_has_ssn			= bool ?? this._spouse_has_ssn; }

	set lived_with_spouse(bool) {		this._lived_with_spouse			= bool ?? this._lived_with_spouse; }
	set number_of_dependents(num){		this._number_of_dependents		= num  ?? this._number_of_dependents; }

	set taxpayers_birthday(birthday) {
		if (birthday === null || birthday === undefined) { return; }
		this._taxpayers_birthday		= birthday;
		this._taxpayers_age				= Math.max(0, Dates.getEndOfYearAge(birthday, this._tax_year));
	}

	set taxpayers_age(age) {
		if (age === null || age === undefined) { return; }
		if (age !== 0) {
			this._taxpayers_birthday	= "";
			this._taxpayers_age			= age;
		}
	}

	set spouses_birthday(birthday) {
		if (birthday === null || birthday === undefined) { return; }
		this._spouses_birthday			= birthday;
		this._spouses_age				= Math.max(0, Dates.getEndOfYearAge(birthday, this._tax_year));
	}

	set spouses_age(age) {
		if (age === null || age === undefined) { return; }
		if (age !== 0) {
			this._spouses_birthday		= "";
			this._spouses_age			= age;
		}
	}

	toString() {
		let str		= [];
		let title	= [];

		title.push(`Taxpayer`);

		const fields = Object.keys(this);
		for (const field of fields) {
			let value = this[field];
			if (!Str.caseEqual(this.filing_status, "MFJ") && field.match(/spouse/i)) {
				continue;
			}
			if (value) {	// Skip empty lines.
				let s = "	" + Str.snakeCaseToEnglish(field);
				s = s.padEnd(65, " ") + value;
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
