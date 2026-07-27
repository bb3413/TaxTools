
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

		this._tax_year							= Dates.getTaxYear();
		this._filing_status						= "Single";

		this._taxpayers_name					= "";
		this._street_address					= "";		// Needed for sales tax deduction calculation
		this._city								= "";		// Needed for sales tax deduction calculation
		this._zip								= "";		// Needed for sales tax deduction calculation

		// Taxpayer
		this._taxpayers_birthday				= "";
		this._taxpayers_age						= 0;
		this._is_taxpayer_blind					= false;
		this._is_taxpayer_citizen				= true;
		this._taxpayer_has_ssn					= true;		// Not an ITIN
		this._lived_with_spouse					= true;		// Needed when filing MFS
		this._can_be_dependent					= false;	// Someone can clain taxpayer or spouse as a dependent
		this._rents_home						= false;	// For CA renter's credit
		this._taxpayer_educator_expenses		= 0;
		this._taxpayer_ltc_premiums				= 0;

		// Spouse
		this._spouses_birthday					= "";
		this._spouses_age						= 0;
		this._is_spouse_blind					= false;
		this._is_spouse_citizen					= true;
		this._spouse_has_ssn					= true;		// Not an ITIN
		this._spouse_educator_expenses			= 0;
		this._spouse_ltc_premiums				= 0;

		// Taxpayer and spouse
		this._number_of_dependents				= 0;
		this._alimony_paid						= 0;
		this._alimony_received					= 0;
		this._divorce_date						= 0;
		this._federal_estimated_payments		= 0;
		this._state_estimated_payments			= 0;
		this._medical_insurance_premiums		= 0;
		this._medicare_repremiums				= 0;
		this._other_medical_expenses			= 0;
		this._medical_miles						= 0;
		this._property_tax						= 0;
		this._personal_property_tax				= 0;
		this._extra_sales_tax					= 0;
		this._cash_gift_to_charity				= 0;
		this._noncash_gift_to_charity			= 0;
		this._tax_preparation_fees				= 0;
		this._investment_expenses				= 0;
		this._unreimbursed_employee_expenses	= 0;
	}

	// Getter methods
	get tax_year(){						return this._tax_year};
	get filing_status() {				return this._filing_status};

	get taxpayers_name() {				return this._taxpayers_name};
	get street_address() {				return this._street_address};
	get city() {						return this._city};
	get zip() {							return this._zip};

	get taxpayers_birthday() {			return this._taxpayers_birthday};
	get taxpayers_age() {				return this._taxpayers_age};
	get is_taxpayer_blind() {			return this._is_taxpayer_blind};
	get is_taxpayer_citizen() {			return this._is_taxpayer_citizen};
	get taxpayer_has_ssn() {			return this._taxpayer_has_ssn};
	get lived_with_spouse() {			return this._lived_with_spouse};
	get number_of_dependents() {		return this._number_of_dependents};
	get rents_home() {					return this._rents_home};
	get taxpayer_educator_expenses() {	return this._taxpayer_educator_expenses};
	get taxpayer_ltc_premiums() {		return this._taxpayer_ltc_premiums};

	get spouses_birthday() {			return this._spouses_birthday};
	get spouses_age() {					return this._spouses_age};
	get is_spouse_blind() {				return this._is_spouse_blind};
	get is_spouse_citizen() {			return this._is_spouse_citizen};
	get spouse_has_ssn() {				return this._spouse_has_ssn};
	get spouse_educator_expenses() {	return this._spouse_educator_expenses};
	get spouse_ltc_premiums() {			return this._spouse_ltc_premiums};

	get number_of_dependents() {		return this._number_of_dependents};
	get alimony_paid() {				return this._alimony_paid};
	get alimony_received() {			return this._alimony_received};
	get divorce_date() {				return this._divorce_date};
	get federal_estimated_payments() {	return this._federal_estimated_payments};
	get state_estimated_payments() {	return this._state_estimated_payments};
	get medical_insurance_premiums() {	return this._medical_insurance_premiums};
	get medicare_repremiums() {			return this._medicare_repremiums};
	get other_medical_expenses() {		return this._other_medical_expenses};
	get medical_miles() {				return this._medical_miles};
	get property_tax() {				return this._property_tax};
	get personal_property_tax() {		return this._personal_property_tax};
	get extra_sales_tax() {				return this._extra_sales_tax};
	get cash_gift_to_charity() {		return this._cash_gift_to_charity};
	get noncash_gift_to_charity() {		return this._noncash_gift_to_charity};
	get tax_preparation_fees() {		return this._tax_preparation_fees};
	get investment_expenses	() {		return this._investment_expenses};
	get unreimbursed_employee_expenses() {	return this._unreimbursed_employee_expenses};

	// Setter methods
	set tax_year(year) {				this._tax_year					= year ?? this._tax_year; }
	set filing_status(fs) {				this._filing_status				= fs   ?? this._filing_status; }

	set taxpayers_name(name) {			this._taxpayers_name			= name ?? this._taxpayers_name; }
	set street_address(str) {			this._street_address			= str  ?? this._street_address; }
	set city(str) {						this._city						= str  ?? this._city; }
	set zip(str) {						this._zip						= str  ?? this._zip; }

	set is_taxpayer_blind(bool) {		this._is_taxpayer_blind			= bool ?? this._is_taxpayer_blind; }
	set is_taxpayer_citizen(bool) {		this._is_taxpayer_citizen		= bool ?? this._is_taxpayer_citizen; }
	set taxpayer_has_ssn(bool) {		this._taxpayer_has_ssn			= bool ?? this._taxpayer_has_ssn; }
	set lived_with_spouse(bool) {		this._lived_with_spouse			= bool ?? this._lived_with_spouse; }
	set number_of_dependents(num){		this._number_of_dependents		= num  ?? this._number_of_dependents; }
	set rents_home(bool) {				this._rents_home				= bool ?? this._rents_home; }
	set taxpayer_educator_expenses(val){this._taxpayer_educator_expenses= val ?? this._taxpayer_educator_expenses; }
	set taxpayer_ltc_premiums(val) {	this._taxpayer_ltc_premiums		= val ?? this._taxpayer_ltc_premiums; }

	set is_spouse_blind(bool) {			this._is_spouse_blind			= bool ?? this._is_spouse_blind; }
	set is_spouse_citizen(bool) {		this._is_spouse_citizen			= bool ?? this._is_spouse_citizen; }
	set spouse_has_ssn(bool) {			this._spouse_has_ssn			= bool ?? this._spouse_has_ssn; }
	set spouse_educator_expenses(val) {	this._spouse_educator_expenses	= val ?? this._spouse_educator_expenses; }
	set spouse_ltc_premiums(val) {		this._spouse_ltc_premiums		= val ?? this._spouse_ltc_premiums; }

	set number_of_dependents(val) {			this._number_of_dependents		= val ?? this._number_of_dependents; }
	set alimony_paid(val) {					this._alimony_paid				= val ?? this._alimony_paid; }
	set alimony_received(val) {				this._alimony_received			= val ?? this._alimony_received; }
	set divorce_date(val) {					this._divorce_date				= val ?? this._divorce_date; }
	set federal_estimated_payments(val) {	this._federal_estimated_payments= val ?? this._federal_estimated_payments; }
	set state_estimated_payments(val) {		this._state_estimated_payments	= val ?? this._state_estimated_payments; }
	set medical_insurance_premiums(val) {	this._medical_insurance_premiums= val ?? this._medical_insurance_premiums; }
	set medicare_repremiums	(val) {			this._medicare_repremiums		= val ?? this._medicare_repremiums; }
	set other_medical_expenses(val) {		this._other_medical_expenses	= val ?? this._other_medical_expenses; }
	set medical_miles(val) {				this._medical_miles				= val ?? this._medical_miles; }
	set property_tax(val) {					this._property_tax				= val ?? this._property_tax; }
	set personal_property_tax(val) {		this._personal_property_tax		= val ?? this._personal_property_tax; }
	set extra_sales_tax(val) {				this._extra_sales_tax			= val ?? this._extra_sales_tax; }
	set cash_gift_to_charity(val) {			this._cash_gift_to_charity		= val ?? this._cash_gift_to_charity; }
	set noncash_gift_to_charity(val) {		this._noncash_gift_to_charity	= val ?? this._noncash_gift_to_charity; }
	set tax_preparation_fees(val) {			this._tax_preparation_fees		= val ?? this._tax_preparation_fees; }
	set investment_expenses(val) {			this._investment_expenses		= val ?? this._investment_expenses; }
	set unreimbursed_employee_expenses(val){this._unreimbursed_employee_expenses= val ?? this._unreimbursed_employee_expenses; }

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

	toPrint() {
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
