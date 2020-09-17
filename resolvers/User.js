import bcrypt from "bcrypt";
import { LoginWithEmail, LoginWithUsername } from "../auth";
import formatErrors from "../formatError";

const UserResolvers = {
	Query: {},
	User: {
		profile: ({ id }, _, { models }) =>
			models.Profile.findOne({ where: { userId: id }, raw: true }),
	},
	Mutation: {
		createUser: async (_, args, { models, sequelize }) => {
			let hash, transaction;
			try {
				hash = await bcrypt.hash(args.password, 5);
			} catch (err) {
				return {
					ok: false,
					error: formatErrors(err),
				};
			}
			try {
				transaction = await sequelize.transaction();
				const user = await models.User.create({ ...args, password: hash });
				models.Profile.create({ userId: user.id });
				//add the registered user to general and random groups
				models.Member.bulkCreate([
					{ userId: user.id, groupId: 1 },
					{ userId: user.id, groupId: 2 },
				]);
				transaction.commit();
			} catch (err) {
				transaction.rollback();
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

		login: async (_, { usernameOrEmail, password }, { res, models }) => {
			try {
				// check if user is trying to login with email or username
				let isEmail = false;
				if (usernameOrEmail.includes("@")) isEmail = true;
				if (isEmail)
					return LoginWithEmail(usernameOrEmail, password, res, models);
				else return LoginWithUsername(usernameOrEmail, password, res, models);
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
