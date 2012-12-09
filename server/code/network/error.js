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

Error.getAuthError = function () {
	return new Error(Error.Codes.NOT_AUTHENTICATED, "Access denied : Not authenticated. Please login first.");
};

module.exports = Error;