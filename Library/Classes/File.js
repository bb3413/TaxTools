
export class File {
	static saveToFile(data, filename, json = true) {
		// This function will convert the data to a JSON string (if json is true) and
		// save it to the file in the user's Download folder.

		// The "blob" is something like a file that you will be able to reference with a URL.
		// The URL is a tempory URL pointing to the blob. Create an anchor HTML element that
		// reference the URL. Add the anchor to the HTML document. Fake a click on the
		// anchor, which will start the download, then remove the anchor and URL.
		let dataString;
		if (json)  {
			dataString = JSON.stringify(data, null, 2);
		} else {
			dataString = data;
		}
		const blob			= new Blob([dataString], {type: "text/plain"});
		const url			= URL.createObjectURL(blob);
		const a				= document.createElement("a");
		a.href				= url;
		a.download			= filename;

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	static restoreFromFile(filename, restoreDataHandler) {
		// This function will read the file. When the data becomes available, it will be
		// parsed so it is in its original format, then the restore data handler function
		// will be called with the data to restore the data to its original location.

		const reader = new FileReader();

		// Define a handler to process the file once it is read.
		reader.onload = function(event) {
			// Reading the file is asynchronous. When this event fires, the data is ready.
			try {
				// The file content is stored in e.target.result as a string.
				const data = JSON.parse(event.target.result);
				restoreDataHandler(data);
				return;
			} catch (error) {
				throw new Error("Error parsing file.");
				console.error(error);
			}
		}

		// Define a handler in case the file cannot be read.
		reader.onerror = function() {
			throw new Error("Error reading file.");
		}
		// Start reading the file.
		reader.readAsText(filename);
	}
}
