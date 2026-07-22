
export class Str {
	static caseEqual(s1, s2) {
		return s1.toLowerCase() === s2.toLowerCase();
	}

	static clean(s) {
		// Remove leading, training, and consecutive whitespace characters.
		return s.trim().replace(/\s+/g, " ");
	}

	static downshift(s) {
		return s.toLowerCase();
	}

	static empty(s) {
		// Return true if:
		//		Null
		//		Undefined
		//		Empty ("")
		//		Contains only whitespace
		//
		// The "s?" expression stops early and returns undefined.

		return !s?.trim();
	}

	static equal(s1, s2) {
		return s1 === s2;
	}

	static upshift(s) {
		return s.toUpperCase();
	}

	static wrap(str, maxLength = 80) {
		//
		// Wrap string into multiple lines by breaking on word boundaries.
		//
		if (!str) {
			return "";
		}

		// Match words and the spaces following them
		const words = str.match(/\S+\s*/g) || [];
		const chunks = [];
		let currentChunk = "";

		for (const word of words) {
			// If a single word is somehow longer than the maxLength, we have to force-break it
			if (word.trim().length > maxLength) {
				if (currentChunk) chunks.push(currentChunk.trim());

				let remaining = word;
				while (remaining.length > maxLength) {
					chunks.push(remaining.slice(0, maxLength));
					remaining = remaining.slice(maxLength);
				}
				currentChunk = remaining;
				continue;
			}

			// Check if adding the next word exceeds the limit
			if ((currentChunk + word).trim().length > maxLength) {
				chunks.push(currentChunk.trim());
				currentChunk = word; // Start a new chunk with the current word
			} else {
				currentChunk += word;
			}
		}

		// Push the final remaining chunk if it exists
		if (currentChunk) {
			chunks.push(currentChunk.trim());
		}

		return chunks.join("\n");
	}

	static wrapLines(str, maxLength = 80) {
		//
		// Wrap string with mulitple lines (i.e., embedded newlines) into multiple lines by
		// breaking on word boundaries.
		//
		let lines = str.split("\n");
		for (let i = 0; i < lines.length; i++) {
			lines[i] = Str.wrap(lines[i], maxLength);
		}
		return lines.join("\n");
	}

	//
	// Variable name formatters
	//
	static upshiftFirst(str) {
		return str[0].toUpperCase() + str.slice(1);
	}

	static toEnglishCase(name) {
		// Convert snake case (abc_def_ghi) to English (Abc def ghi).
		name = name.replace(/_/g, " ").trim();
		name = Str.upshiftFirst(name);

		return name;
	}

	static toSnakeCase(name) {
		// Convert camel case (abcDefGhi) to snake case (abc_def_ghi).
		return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
	}

	static toCamelCase(name) {
		// Convert snake case (abc_def_ghi) to camel case (abcDefGhi).
		let newname = "";
		let words = name.split("_");
		for (const word of words) {
			if (newname === "") {
				newname = word;
			} else {
				newname += Str.upshiftFirst(word);
			}
		}
		return newname;
	}
}
