import { GROUP_MEMBER_ADDED } from "../events";
import pubsub from "../pubsub";
import { withFilter } from "apollo-server";

const Member = {
	Subscription: {
		groupMemberAdded: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(GROUP_MEMBER_ADDED),
				async (
					{ groupMemberAdded },
					{ groupId },
					{ user: { userId }, models }
				) => {
					// check if current user is a member of group
					let res;
					try {
						res = await models.Member.findOne({
							where: { userId, groupId: groupMemberAdded.groupId },
							raw: true,
						});
					} catch (err) {
						console.log(err);
						return false;
					}
					if (!res) return false;
					if (groupMemberAdded.groupId !== groupId) return false;
					return true;
				}
			),
		},
	},
	Query: {
		getGroupMembers: async (_, { groupId }, { models }) => {
			let res;
			try {
				res = await models.Group.findAll({
					attributes: [
						"Users.username",
						"Users.email",
						"Users.id",
						"Users.Member.createdAt",
					],
					raw: true,
					where: { id: groupId },
					include: [
						{
							model: models.User,
							through: {
								model: models.Member,
								attributes: [],
							},
						},
					],
				});
			} catch (err) {
				console.log(err);
			}
			return res;
		},
	},
	Member: {
		user: (parent) => {
			return parent;
		},
		memberSince: ({ createdAt }) => new Date(createdAt).toISOString(),
	},
};
export default Member;
