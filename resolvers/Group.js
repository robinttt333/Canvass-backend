import { Op } from "sequelize";
import { updateLastPostSeen } from "../general";

const ProfileResolvers = {
	Query: {
		getGroup: async (
			_,
			{ groupId: id },
			{ sequelize, user: { userId }, models }
		) => {
			const group = await models.Group.findOne({ where: { id }, raw: true });
			updateLastPostSeen({ userId, sequelize, models, id });
			return group;
		},
		getUserGroups: async (_, __, { sequelize, user: { userId } }) => {
			let res;
			try {
				//find all the group names of which current user is a part of
				res = await sequelize.query(
					`
					Select * from "Groups","Members" where
					"Groups"."id" = "Members"."groupId"
					and
					"Members"."userId" = :userId
				`,
					{ replacements: { userId } }
				);
				//res = await models.Group.findAll({
				//raw: true,
				//include: {
				//model: models.User,
				//required: true,
				//where: { id },
				//through: models.Member,
				//},
				//});
			} catch (err) {
				console.log(err);
			}
			return res[0];
		},
	},
	UserGroup: {
		group: (parent) => parent,
		unseenPosts: async ({ id: groupId }, _, { models, user: { userId } }) => {
			const res = await models.LastPostSeen.findOne({
				where: { userId, groupId },
				raw: true,
			});
			// user has not seen any posts of this group
			if (!res)
				return await models.Post.count({ where: { groupId }, raw: true });
			const timestamp = res.timestamp;
			// find all posts greater than the last timestamp ie which were created
			// after the last time the user visited this group
			const count = await models.Post.findAll({
				where: {
					createdAt: {
						[Op.gt]: timestamp,
					},
					groupId,
				},
				raw: true,
			});
			return count.length;
		},
	},
	Group: {
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
		image: ({ image }) => `http://127.0.0.1:4000/files/${image}`,
		members: ({ id }, _, { models }) =>
			models.Member.count({ where: { groupId: id } }),
	},
};

export default ProfileResolvers;
