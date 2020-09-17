const formatErrors = (err) => {
	try {
		const error = err.errors[0];
		if (error && error.path && error.message) {
			return {
				path: error.path,
				message: error.message,
			};
		}
	} catch (err) {
		return {
			path: "Internal Server Error",
			message: "Oops something went wrong",
		};
	}
};
export default formatErrors;
