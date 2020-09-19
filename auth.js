import { verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { SECRET, SECRET2 } from "./constants";
import { models } from "./models";
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
	const { accessToken, refreshToken } = getNewTokens(user);
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
	const { accessToken, refreshToken } = getNewTokens(user);
	res.cookie("access-token", accessToken);
	res.cookie("refresh-token", refreshToken);

	return {
		ok: true,
	};
};

export const getNewTokens = ({ id, username, count }) => {
	const accessToken = sign({ userId: id, username, count }, SECRET, {
		expiresIn: "15min",
	});
	const refreshToken = sign(
		{ userId: id, username, count },
		//change secret for refresh token
		SECRET2,
		{
			expiresIn: "2d",
		}
	);
	return { accessToken, refreshToken };
};

export const validateAccessToken = (accessToken) => {
	// note: verify will throw error if token has expired or signature has changed
	// 	malicious users can manipulate data in token but since they do not have the
	// 	secret used so the signature will also change and they cannot generate the
	// 	correct signature without the secret
	if (!accessToken) return null;
	//check if access token is valid
	try {
		const user = verify(accessToken, SECRET);
		return user;
		//eslint-disable-next-line
	} catch (err) {
		return null;
	}
};

export const validateRefreshToken = (refreshToken) => {
	if (!refreshToken) return null;
	try {
		const user = verify(refreshToken, SECRET2);
		// access token has expired but refresh token is valid ie not expired and also not tempered
		return user;
	} catch (err) {
		return null;
	}
};

export const checkGroupMemberShip = async (userId, groupId) => {
	let res;
	try {
		res = await models.Member.findOne({
			where: { userId, groupId },
			raw: true,
		});
	} catch (err) {
		console.log(err);
		return false;
	}
	if (!res) return false;
	return true;
};
