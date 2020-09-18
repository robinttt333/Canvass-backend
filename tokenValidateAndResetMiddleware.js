import {
	validateAccessToken,
	validateRefreshToken,
	getNewTokens,
} from "./auth";
import { models } from "./models";

const tokenValidateAndResetMiddleware = (app) => {
	app.use(async (req, res, next) => {
		let tokenUser,
			user = null;
		let accessToken = req.cookies && req.cookies["access-token"];
		const refreshToken = req.cookies && req.cookies["refresh-token"];

		tokenUser = validateAccessToken(accessToken);
		if (tokenUser) {
			user = await models.User.findOne({
				where: { id: tokenUser.userId },
				raw: true,
			});
			//now check if count value has changed
			if (!user || user.count != tokenUser.count) return next();
			req.user = tokenUser;
			return next();
		}

		// user token is not valid , so check if refresh token is valid
		tokenUser = validateRefreshToken(refreshToken);
		if (!tokenUser) return next();

		// access token has expired but refresh token is valid ie not expired and also not tempered
		// so generate new tokens
		//now check if count value has changed
		if (!user)
			user = await models.User.findOne({
				where: { id: tokenUser.userId },
				raw: true,
			});
		if (!user || user.count != tokenUser.count) return next();
		const {
			accessToken: accessTokenNew,
			refreshToken: refreshTokenNew,
		} = getNewTokens(user);
		res.cookie("access-token", accessTokenNew);
		res.cookie("refresh-token", refreshTokenNew);
		req.user = { username: user.username, userId: user.id };
		return next();
	});
};
export default tokenValidateAndResetMiddleware;
