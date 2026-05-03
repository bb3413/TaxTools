
let start			= "";
let end				= "";
let age				= 0;

function CalculateEndDate(start, age) {
	const start_date	= new Date(start);
	const end_date		= new Date(start);
	const start_year	= start_date.getFullYear();
	
	end_date.setYear(start_year + age);
	end = end_date.toLocaleDateString();
	putUserOutput("End", end);
}

function CalculateStartDate(end, age) {
	const end_date		= new Date(end);
	const start_date	= new Date(end);
	const end_year		= end_date.getFullYear();
	
	start_date.setYear(end_year - age);
	start = start_date.toLocaleDateString();
	putUserOutput("Start", start);
}

function StartHandler(event) {
	start = getUserInput("Start", "text");
	if (!getDateObject(start)) {
		if (start)
			alert("Invalid date: " + start);
		// start = "";
		// putUserOutput("Start", "");
		
		return 0;
	}
	
	if (end) {
		age = Age(start, end);
		putUserOutput("Age", age);
	} else if (age) {
		CalculateEndDate(start, age);
	}
}

function EndHandler(event) {
	end = getUserInput("End", "text");
	if (!getDateObject(end)) {
		if (end)
			alert("Invalid date: " + end);
		// end = "";
		// putUserOutput("End", "");
		return 0;
	}
	
	if (start) {
		age = Age(start, end);
		putUserOutput("Age", age);
	} else if (age) {
		CalculateStartDate(end, age);
	}
}

function AgeHandler(event) {
	age = getUserInput("Age", "text");
	if (age == "")
		return 0;
		
	age = toInteger(age);
	
	if (start) {
		CalculateEndDate(start, age);
	} else if (end) {
		CalculateStartDate(end, age);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	addListener("Start",	"change",	StartHandler);
	addListener("End",		"change",	EndHandler);
	addListener("Age",		"change",	AgeHandler);
	
	end = new Date().toLocaleDateString();	// Today
	putUserOutput("End", end);
});
