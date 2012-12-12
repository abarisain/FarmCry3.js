function Error(code, description) {
	this.error = {
		code: code,
		description: (typeof description == 'undefined') ? Error.Descriptions[code] : description
	};
}

Error.Codes = {
	DEBUG_TEST_ERROR: 0,
	NOT_AUTHENTICATED: 1,
	BAD_REQUEST: 2
};

Error.Descriptions = {
	0: "Debug test error",
	1: "Access denied : Not authenticated. Please login first.",
	2: "Bad request. Check if the input parameters match the documentation."
};

Error.BadRequest = function (request, params) {
	var tmpError = new Error(Error.Codes.BAD_REQUEST);
	tmpError.error.description += " Request : " + request + " Parameters : " + params;
	return tmpError;
};

module.exports = Error;