import bcrypt from "bcrypt";
import { LoginWithEmail, LoginWithUsername } from "../auth";
import formatErrors from "../formatError";
import { GROUP_MEMBER_ADDED, TOGGLE_USER_JOINED } from "../events";
import pubsub from "../pubsub";
import { withFilter } from "apollo-server";
import { Op } from "sequelize";

const UserResolvers = {
	Subscription: {
		toggleUserJoined: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(TOGGLE_USER_JOINED),
				async ({ toggleUserJoined }, _, { user: { userId: me }, models }) => {
					let res;
					try {
						res = await models.Message.findOne({
							raw: true,
							where: {
								[Op.or]: [
									{
										[Op.and]: [
											{ sender: me },
											{ receiver: toggleUserJoined.id },
										],
									},
									{
										[Op.and]: [
											{ receiver: me },
											{ sender: toggleUserJoined.id },
										],
									},
								],
							},
						});
					} catch (err) {
						console.log(err);
					}
					if (!res) return false;
					return true;
				}
			),
		},
	},
	Query: {
		getUser: async (_, { userId }, { models }) =>
			await models.User.findOne({ where: { id: userId }, raw: true }),
	},
	User: {
		profile: ({ id }, _, { models }) =>
			models.Profile.findOne({ where: { userId: id }, raw: true }),
	},
	Mutation: {
		//toggleUserOnlineStatus: (_, __, { models, user: { userId } }) => {},
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
				const user = (
					await models.User.create({ ...args, password: hash })
				).get({
					plain: true,
				});
				await models.Profile.create({ userId: user.id });
				//add the registered user to general and random groups
				await models.Member.bulkCreate([
					{ userId: user.id, groupId: 1 },
					{ userId: user.id, groupId: 2 },
				]);
				transaction.commit();
				pubsub.publish(GROUP_MEMBER_ADDED, {
					groupMemberAdded: { ...user, groupId: 1 },
				});
				pubsub.publish(GROUP_MEMBER_ADDED, {
					groupMemberAdded: { ...user, groupId: 2 },
				});
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
		changePassword: async (
			_,
			{ oldPassword, newPassword },
			{ models, user: { userId: id } }
		) => {
			const user = await models.User.findOne({ where: { id }, raw: true });
			let hash;
			//password does not match
			const match = await bcrypt.compare(oldPassword, user.password);
			if (!match) {
				return {
					ok: false,
					error: { path: "Password", message: "Invalid Password" },
				};
			}
			//user entered correct password
			try {
				hash = await bcrypt.hash(newPassword, 5);
				await models.User.update(
					{ password: hash, count: user.count + 1 },
					{ where: { id } }
				);
			} catch (err) {
				return {
					ok: false,
					error: formatErrors(err),
				};
			}
			return { ok: true };
		},
	},
};

export default UserResolvers;
