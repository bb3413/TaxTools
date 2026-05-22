
let tax_year				= 0;
let ira_total				= 0;
let taxpayers_birthday		= "";
let taxpayers_age			= 0;
let rmd						= 0;

const RMD_Table_III = [	// Uniform Lifetime Table
	//			Distribution
	// 	Age		Period
	[	72,		27.4,	],
	[	73,		26.5,	],
	[	74,		25.5,	],
	[	75,		24.6,	],
	[	76,		23.7,	],
	[	77,		22.9,	],
	[	78,		22.0,	],
	[	79,		21.1,	],
	[	80,		20.2,	],
	[	81,		19.4,	],
	[	82,		18.5,	],
	[	83,		17.7,	],
	[	84,		16.8,	],
	[	85,		11.6,	],
	[	86,		15.2,	],
	[	87,		14.4,	],
	[	88,		13.7,	],
	[	89,		12.9,	],
	[	90,		12.2,	],
	[	91,		11.5,	],
	[	92,		10.8,	],
	[	93,		10.1,	],
	[	94,		9.5,	],
	[	95,		8.9,	],
	[	96,		8.4,	],
	[	97,		7.8,	],
	[	98,		7.3,	],
	[	99,		6.8,	],
	[	100,	6.4,	],
	[	101,	6.0,	],
	[	102,	5.6,	],
	[	103,	5.2,	],
	[	104,	4.9,	],
	[	105,	4.6,	],
	[	106,	4.3,	],
	[	107,	4.1,	],
	[	108,	3.9,	],
	[	109,	3.7,	],
	[	110,	3.5,	],
	[	111,	3.4,	],
	[	112,	3.3,	],
	[	113,	3.1,	],
	[	114,	3.0,	],
	[	115,	2.9,	],
	[	116,	2.9,	],
	[	117,	2.7,	],
	[	118,	2.5,	],
	[	119,	2.3,	],
	[	120,	2.0,	],
];

function CalculateRMD() {
	let end_of_year				= "";
	let period					= 0;

	if (tax_year === 0) {
		tax_year = getTaxYear();
		putUserOutput("TaxYear", tax_year, "text");
	}
	
	if (taxpayers_birthday !== "") {
		end_of_year				= new Date("12/31/" + tax_year).toLocaleDateString();
		taxpayers_age			= Age(taxpayers_birthday, end_of_year);
	}

	if (taxpayers_age < 73) {
		rmd = 0;
	} else {
		if (taxpayers_age > 120) {
			period = 2;
		} else {
			for (let row = 0; row < RMD_Table_III.length; row++) {
				if (taxpayers_age === RMD_Table_III[row][0]) {
					period = RMD_Table_III[row][1];
					break;
				}
			}
		}
		
		rmd = Math.round(ira_total / period);
	}
}

function PutOutput() {
	putUserOutput("TaxpayersAge",	taxpayers_age);
	putUserOutput("RMD",			rmd);
}

function GetInput() {
	tax_year				= getUserInput("TaxYear");
	ira_total				= getUserInput("IRATotal");
	taxpayers_birthday		= getUserInput("TaxpayersBirthday",	"text");
	taxpayers_age			= getUserInput("TaxpayersAge");
	
	rmd						= 0;
}

function ChangedAge(event) {
	const age = getUserInput("TaxpayersAge");
	if (age !== 0)
		putUserOutput("TaxpayersBirthday", "");
		
	ChangeHandler(event);
}

function ChangeHandler(event) {
	// This is the function that is called if any input field is changed.
	TurnOffDebug();
	GetInput();
	CalculateRMD();
	PutOutput();
	TurnOnDebug();
}

document.addEventListener("DOMContentLoaded", () => {
	// Wait for the DOM to be fully loaded before trying to access any elements.
	
	addListener("TaxYear",				"change", ChangeHandler);
	addListener("IRATotal",				"change", ChangeHandler);
	addListener("TaxpayersBirthday",	"change", ChangeHandler);
	addListener("TaxpayersAge",			"change", ChangedAge);

	ChangeHandler();
});
