import bcrypt from "bcrypt";

export const LoginWithEmail = async (email, password, models) => {
	const res = await models.User.findOne({ where: { email }, raw: true });
	//email does not exist
	if (!res) {
		return {
			ok: false,
			error: { path: "Email", message: "No such account exists" },
		};
	}
	//password does not match
	const match = await bcrypt.compare(password, res.password);
	if (!match) {
		return {
			ok: false,
			error: { path: "Password", message: "Invalid Password" },
		};
	}
	// success
	return {
		ok: true,
	};
};

export const LoginWithUsername = async (username, password, models) => {
	const res = await models.User.findOne({ where: { username }, raw: true });
	//username does not exist
	if (!res) {
		return {
			ok: false,
			error: { path: "Username", message: "No such account exists" },
		};
	}
	//password does not match
	const match = await bcrypt.compare(password, res.password);
	if (!match) {
		return {
			ok: false,
			error: { path: "Password", message: "Invalid Password" },
		};
	}
	// success
	return {
		ok: true,
	};
};
