import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const SECRET = "12gghjut%^&%gjhJHJ";
export const LoginWithEmail = async (email, password, res, models) => {
	const user = await models.User.findOne({ where: { email }, raw: true });
	//email does not exist
	if (!user) {
		return {
			ok: false,
			error: { path: "Email", message: "No such account exists" },
		};
	}
	//password does not match
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		return {
			ok: false,
			error: { path: "Password", message: "Invalid Password" },
		};
	}
	// success
	const { accessToken, refreshToken } = getTokens(user);
	res.cookie("access-token", accessToken);
	res.cookie("refresh-token", refreshToken);
	return {
		ok: true,
	};
};

export const LoginWithUsername = async (username, password, res, models) => {
	const user = await models.User.findOne({ where: { username }, raw: true });
	//username does not exist
	if (!user) {
		return {
			ok: false,
			error: { path: "Username", message: "No such account exists" },
		};
	}
	//password does not match
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		return {
			ok: false,
			error: { path: "Password", message: "Invalid Password" },
		};
	}
	// success
	const { accessToken, refreshToken } = getTokens(user);
	res.cookie("access-token", accessToken);
	res.cookie("refresh-token", refreshToken);

	return {
		ok: true,
	};
};

export const getTokens = ({ id, username, count }) => {
	const accessToken = sign({ userId: id, username, count }, SECRET, {
		expiresIn: "20min",
	});
	const refreshToken = sign({ userId: id, username, count }, SECRET, {
		expiresIn: "2d",
	});
	return { accessToken, refreshToken };
};
