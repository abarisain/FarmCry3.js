function Error(code, description, request, params) {
	this.error = {
		code: code,
		description: (typeof description == 'undefined' || description == null) ? Error.Descriptions[code] : description,
		request: request,
		params: params
	};
}

Error.Codes = {
	DEBUG_TEST_ERROR: 0,
	NOT_AUTHENTICATED: 1,
	BAD_REQUEST: 2,
	BAD_LOGIN: 3
};

Error.Descriptions = {
	0: "Debug test error",
	1: "Access denied : Not authenticated. Please login first.",
	2: "Bad request. Check if the input parameters match the documentation.",
	3: "This email/password combo does not exist."
};

module.exports = Error;