
import { Dates }	from "../Classes/Dates.js";
import { HTML }		from "../Classes/HTML.js";
import { Str }		from "../Classes/Str.js";

let taxpayer = undefined;		// Global variable.

function getUserInput(element_id, default_value) {
	// In some tools the element may not exist and HTML.getUserInput fails in strict
	// mode if element does not eixt. This function ignores that error.
	if (document.getElementById(element_id)) {
		return HTML.getUserInput(element_id, default_value);
	} else {
		return default_value;
	}
}

function printFilingStatus(filing_status) { 
	switch (filing_status) {
		case "SINGLE":	return "Single";
		case "HOH":		return "HoH";
		case "MFJ":		return "MFJ";
		case "QSS":		return "QSS";
		case "MFS":		return "MFS";
	}
}

function printLine(output, label, value) {
	output.push(label.padEnd(20, " ") + value);
}

export class Taxpayer {
	//
	// ---------------- Static Methods ----------------
	//
	static getTaxpayer() {
		return taxpayer;
	}

	static initializeTaxpayer() {
		//
		// Create a new taxpayer and initialize it with information from the Web page.
		//
		let inputs = {};

		const taxpayer = new Taxpayer();

		taxpayer.tax_year						= getUserInput("tax-year");
		taxpayer.filing_status					= getUserInput("filing-status",		"text").toUpperCase();

		taxpayer.taxpayers_name					= getUserInput("taxpayers-name",	"text");
		taxpayer.street_address					= getUserInput("street-address",	"text");
		taxpayer.city							= getUserInput("city",				"text");
		taxpayer.zip_code						= getUserInput("zip-code",			"text");

		// Taxpayer
		taxpayer.taxpayers_birthday				= getUserInput("taxpayers-birthday", "text");
		taxpayer.is_taxpayer_blind				= getUserInput("is-taxpayer-blind", "");
		taxpayer.is_taxpayer_citizen			= getUserInput("is-taxpayer-citizen", "");
		taxpayer.taxpayer_has_ssn				= getUserInput("taxpayer-has-ssn", "");
		taxpayer.lived_with_spouse				= getUserInput("lived-with-spouse", "");
		taxpayer.can_be_dependent				= getUserInput("can-be-dependent", "");
		taxpayer.rents_home						= getUserInput("rents-home", "");
		taxpayer.taxpayer_educator_expenses		= getUserInput("tp-taxpayer-educator-expenses", "");
		taxpayer.taxpayer_ltc_premiums			= getUserInput("tp-taxpayer-ltc-premiums", "");

		// Spouse
		taxpayer.spouses_birthday				= getUserInput("spouses-birthday", "text");
		taxpayer.is_spouse_blind				= getUserInput("is-spouse-blind", "");
		taxpayer.is_spouse_citizen				= getUserInput("is-spouse-citizen", "");
		taxpayer.spouse_has_ssn					= getUserInput("spouse-has-ssn", "");
		taxpayer.spouse_educator_expenses		= getUserInput("tp-spouse-educator-expenses", "");
		taxpayer.spouse_ltc_premiums			= getUserInput("tp-spouse-ltc-premiums", "");

		// Taxpayer and spouse
		taxpayer.number_of_dependents			= getUserInput("tp-number-of-dependents", "");
		taxpayer.alimony_paid					= getUserInput("tp-alimony-paid", "");
		taxpayer.alimony_received				= getUserInput("tp-alimony-received", "");
		taxpayer.divorce_date					= getUserInput("tp-divorce-date", "text");
		taxpayer.federal_estimated_payments		= getUserInput("tp-federal-estimated-payments", "");
		taxpayer.state_estimated_payments		= getUserInput("tp-state-estimated-payments", "");
		taxpayer.medical_insurance_premiums		= getUserInput("tp-medical-insurance-premiums", "");
		taxpayer.medicare_repremiums			= getUserInput("tp-medicare-premiums", "");
		taxpayer.other_medical_expenses			= getUserInput("tp-other-medical-expenses", "");
		taxpayer.medical_miles					= getUserInput("tp-medical-miles", "");
		taxpayer.property_tax					= getUserInput("tp-property-tax", "");
		taxpayer.personal_property_tax			= getUserInput("tp-personal-property-tax", "");
		taxpayer.extra_sales_tax				= getUserInput("tp-extra-sales-tax", "");
		taxpayer.cash_gift_to_charity			= getUserInput("tp-cash-gift-to-charity", "");
		taxpayer.noncash_gift_to_charity		= getUserInput("tp-noncash-gift-to-charity", "");
		taxpayer.tax_preparation_fees			= getUserInput("tp-tax-preparation-fees", "");
		taxpayer.investment_expenses			= getUserInput("tp-investment-expenses", "");
		taxpayer.unreimbursed_employee_expenses	= getUserInput("tp-unreimbursed-employee-expenses", "");

		return taxpayer;
	}

	static reset() {
		taxpayer = undefined;
	}

	//
	// ---------------- Constructor ----------------
	//
	constructor() {
		taxpayer = this;

		this._tax_year							= Dates.getTaxYear();
		this._filing_status						= "Single";

		this._taxpayers_name					= "";
		this._street_address					= "";		// Needed for sales tax deduction calculation
		this._city								= "";		// Needed for sales tax deduction calculation
		this._zip_code							= "";		// Needed for sales tax deduction calculation

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

	//
	// ---------------- Getter Methods ----------------
	//
	get tax_year(){						return this._tax_year};
	get filing_status() {				return this._filing_status};

	get taxpayers_name() {				return this._taxpayers_name};
	get street_address() {				return this._street_address};
	get city() {						return this._city};
	get zip_code() {					return this._zip_code};

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

	//
	// ---------------- Setter Methods ----------------
	//
	set tax_year(year) {					this._tax_year						= year }
	set filing_status(fs) {					this._filing_status					= fs }

	set taxpayers_name(name) {				this._taxpayers_name				= name }
	set street_address(str) {				this._street_address				= str }
	set city(str) {							this._city							= str }
	set zip_code(str) {						this._zip_code						= str }

	set is_taxpayer_blind(bool) {			this._is_taxpayer_blind				= bool }
	set is_taxpayer_citizen(bool) {			this._is_taxpayer_citizen			= bool }
	set taxpayer_has_ssn(bool) {			this._taxpayer_has_ssn				= bool }
	set lived_with_spouse(bool) {			this._lived_with_spouse				= bool }
	set number_of_dependents(num){			this._number_of_dependents			= num }
	set rents_home(bool) {					this._rents_home					= bool }
	set taxpayer_educator_expenses(val) {	this._taxpayer_educator_expenses	= val }
	set taxpayer_ltc_premiums(val) {		this._taxpayer_ltc_premiums			= val }

	set is_spouse_blind(bool) {				this._is_spouse_blind				= bool }
	set is_spouse_citizen(bool) {			this._is_spouse_citizen				= bool }
	set spouse_has_ssn(bool) {				this._spouse_has_ssn				= bool }
	set spouse_educator_expenses(val) {		this._spouse_educator_expenses		= val }
	set spouse_ltc_premiums(val) {			this._spouse_ltc_premiums			= val }

	set number_of_dependents(val) {			this._number_of_dependents			= val }
	set alimony_paid(val) {					this._alimony_paid					= val }
	set alimony_received(val) {				this._alimony_received				= val }
	set divorce_date(val) {					this._divorce_date					= val }
	set federal_estimated_payments(val) {	this._federal_estimated_payments	= val }
	set state_estimated_payments(val) {		this._state_estimated_payments		= val }
	set medical_insurance_premiums(val) {	this._medical_insurance_premiums	= val }
	set medicare_repremiums	(val) {			this._medicare_repremiums			= val }
	set other_medical_expenses(val) {		this._other_medical_expenses		= val }
	set medical_miles(val) {				this._medical_miles					= val }
	set property_tax(val) {					this._property_tax					= val }
	set personal_property_tax(val) {		this._personal_property_tax			= val }
	set extra_sales_tax(val) {				this._extra_sales_tax				= val }
	set cash_gift_to_charity(val) {			this._cash_gift_to_charity			= val }
	set noncash_gift_to_charity(val) {		this._noncash_gift_to_charity		= val }
	set tax_preparation_fees(val) {			this._tax_preparation_fees			= val }
	set investment_expenses(val) {			this._investment_expenses			= val }
	set unreimbursed_employee_expenses(val) { this._unreimbursed_employee_expenses = val }

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

	//
	// ---------------- Utility Methods ----------------
	//
	putTaxpayerInformation() {
		//
		// Put the taxpayer information on the output form 1040.
		//
		HTML.putUserOutput("f1040-1-filing-status", printFilingStatus(this.filing_status), "text");
		HTML.putUserOutput("f1040-1-taxpayers-name", this.taxpayers_name, "text");
		HTML.putUserOutput("f1040-1-street-address", this.street_address, "text");
		if (this.city) {
			HTML.putUserOutput("f1040-1-city-state-zip", `${this.city}, CA ${this.zip_code}`, "text");
		} else {
			HTML.putUserOutput("f1040-1-city-state-zip","", "text");
		}

		if (this.taxpayers_birthday) {
			HTML.putUserOutput("f1040-1-taxpayers-birthday",
				`${this.taxpayers_birthday} (Age ${this.taxpayers_age})`, "text");
		} else {
			HTML.putUserOutput("f1040-1-taxpayers-birthday", "", "text");
		}
		if (this.spouses_birthday) {
			HTML.putUserOutput("f1040-1-spouses-birthday",
				`${this.spouses_birthday} (Age ${this.spouses_age})`, "text");
		} else {
			HTML.putUserOutput("f1040-1-spouses-birthday", "", "text");
		}
		HTML.putUserOutput("f1040-1-taxpayer-is-blind",	this.is_taxpayer_blind ? "X" : "", "text");
		HTML.putUserOutput("f1040-1-spouse-is-blind", this.is_spouse_blind ? "X" : "", "text");
	}

	toPrint() {
		let lines = [];

		printLine(lines, "Tax Year",			this.tax_year);
		printLine(lines, "Filing Status",		this.filing_status);
		lines.push("");
		
		printLine(lines, "Taxpayer's Name",		this.taxpayers_name);
		printLine(lines, "Street Address",		this.street_address);
		printLine(lines, "City, State, Zip",	`${this.city}, CA ${this.zip_code}`);
		printLine(lines, "Taxpayer's Birthday",	`${this.taxpayers_birthday}, Age: ${this.taxpayers_age}`);
		printLine(lines, "Taxpayer Is Blind",	this.is_taxpayer_blind);

		if (this.filing_status === "MFJ") {
			printLine(lines, "Spouse's Birthday",	`${this.spouses_birthday}, Age: ${this.spouses_age}`);
			printLine(lines, "Spouse Is Blind",	this.is_spouse_blind);
		}
		lines.push("");
		return lines.join("\n");
	}

	toString() {
		let str		= [];
		let title	= [];

		title.push(`Taxpayer`);

		const fields = Object.keys(this);
		for (const field of fields) {
			let value = this[field];
			if ((this.filing_status !== "MFJ") && field.match(/spouse/i)) {
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
