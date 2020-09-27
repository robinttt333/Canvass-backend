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
		getGroupMembers: async (_, { groupId }, { sequelize }) => {
			let res;
			try {
				res = await sequelize.query(
					`
					select "Users"."username", "Users"."email", "Users"."id","Members"."createdAt" from
					"Users", "Members" where "Users"."id" = "Members"."userId" and
					"Members"."groupId" = :groupId;
				`,
					{ replacements: { groupId } }
				);
			} catch (err) {
				console.log(err);
			}
			return res[0];
		},
	},
	Member: {
		user: (parent) => {
			return parent;
		},
		memberSince: ({ createdAt }) => new Date(createdAt).toISOString(),
	},
	Mutation: {
		addGroupMembers: async (_, { members, groupId }, { models }) => {
			try {
				const membersWithGroupId = members.map((userId) => ({
					userId,
					groupId,
				}));
				await models.Member.bulkCreate(membersWithGroupId);
			} catch (err) {
				console.log(err);
				return { ok: false };
			}

			return { ok: true };
		},
	},
};
export default Member;
