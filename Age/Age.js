
let start			= "";
let end				= "";
let age				= 0;
let input_color		= "";
let output_color	= "";

function calculateAge(start, end) {
	age = Age(start, end);
	putUserOutput("Age", age);
		
	changeBackgroundColor("Start",	input_color);
	changeBackgroundColor("End",	input_color);
	changeBackgroundColor("Age",	output_color);
}

function calculateEndDate(start, age) {
	const start_date	= new Date(start);
	const end_date		= new Date(start);
	const start_year	= start_date.getFullYear();
	
	end_date.setYear(start_year + age);
	end = end_date.toLocaleDateString();
	putUserOutput("End", end);

	changeBackgroundColor("Start",	input_color);
	changeBackgroundColor("End",	output_color);
	changeBackgroundColor("Age",	input_color);
}

function calculateStartDate(end, age) {
	const end_date		= new Date(end);
	const start_date	= new Date(end);
	const end_year		= end_date.getFullYear();
	
	start_date.setYear(end_year - age);
	start = start_date.toLocaleDateString();
	putUserOutput("Start", start);
	
	changeBackgroundColor("Start",	output_color);
	changeBackgroundColor("End",	input_color);
	changeBackgroundColor("Age",	input_color);
}

function startHandler(event) {
	start = getUserInput("Start", "text");
	if (!getDateObject(start)) {
		if (start) {
			alert("Invalid date: " + start);
		}
		return;
	}
	
	if (end) {
		calculateAge(start, end);
	} else if (age) {
		calculateEndDate(start, age);
	}
}

function endHandler(event) {
	end = getUserInput("End", "text");
	if (!getDateObject(end)) {
		if (end) {
			alert("Invalid date: " + end);
		}
		return;
	}
	
	if (start) {
		calculateAge(start, end);
	} else if (age) {
		calculateStartDate(end, age);
	}
}

function ageHandler(event) {
	age = getUserInput("Age", "text");
	if (age === "")
		return;
		
	age = toInteger(age);
	
	if (start) {
		calculateEndDate(start, age);
	} else if (end) {
		calculateStartDate(end, age);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.

	addListener("Start",	"change",	startHandler);
	addListener("End",		"change",	endHandler);
	addListener("Age",		"change",	ageHandler);

	output_color	= getCSSGlobalVariable("--output-color");
	input_color		= getCSSGlobalVariable("--input-color");
	
	end = new Date().toLocaleDateString();	// Today's date
	putUserOutput("End", end);
});
