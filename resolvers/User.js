import bcrypt from "bcrypt";
import { LoginWithEmail, LoginWithUsername } from "../auth";
import formatErrors from "../formatError";

const UserResolvers = {
	Query: {},
	Mutation: {
		createUser: async (_, args, { models }) => {
			try {
				const hash = await bcrypt.hash(args.password, 5);
				const res = await models.User.create({ ...args, password: hash });
			} catch (err) {
				console.log(err);
				return {
					ok: false,
					error: formatErrors(err),
				};
			}
			return {
				ok: true,
			};
		},

		login: async (_, { usernameOrEmail, password }, { models }) => {
			try {
				// check if user is trying to login with email or username
				let isEmail = false;
				if (usernameOrEmail.includes("@")) isEmail = true;
				if (isEmail) return LoginWithEmail(usernameOrEmail, password, models);
				else return LoginWithUsername(usernameOrEmail, password, models);
			} catch (err) {
				console.log(err);
				return {
					ok: false,
					error: {
						path: "Internal Server Errror",
						message: "Couldn't log you in at the moment...Please try again",
					},
				};
			}
		},
	},
};

export default UserResolvers;
