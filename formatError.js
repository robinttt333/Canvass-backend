const formatErrors = (err) => {
	const error = err.errors[0];
	if (error.path && error.message) {
		return {
			path: error.path,
			message: error.message,
		};
	}

	return {
		path: "Internal Server Error",
		message: "Couldn't register you right now...Please try again later",
	};
};
export default formatErrors;
