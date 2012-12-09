function Error(code, description) {
	this.error = {
		code: code,
		description: description
	};
}

Error.Codes = {
	DEBUG_TEST_ERROR: 0,
	NOT_AUTHENTICATED: 1
};

module.exports = Error;