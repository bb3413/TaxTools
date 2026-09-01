
export class Objects {
	static isUsed(obj) {
		for (const value of Object.values(obj)) {
			if (value) {
				return true;
			}
		}

		return false;
	}

	static removeUnused(obj) {
		let newobj = {}

		for (const key of Object.keys(obj)) {
			if (obj[key]) {
				newobj[key] = obj[key];
			}
		}

		return newobj;
	}
}
