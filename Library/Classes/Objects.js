
export class Objects {
	static isUsed(obj) {
		for (const value of Object.values(obj)) {
			if (value) {
				return true;
			}
		}
		return false;
	}
}
