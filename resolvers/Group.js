import { Op } from "sequelize";
import { updateLastPostSeen } from "../general";
import formatErrors from "../formatError";
import pubsub from "../pubsub";
import { GROUP_MEMBER_ADDED } from "../events";

const ProfileResolvers = {
	Query: {
		getGroup: async (_, { groupId: id }, { sequelize, models }) => {
			const userId = 1;
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
			const timestamp = res.updatedAt;
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
		admin: ({ admin }, _, { models }) =>
			models.User.findOne({ where: { id: admin } }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
		image: ({ image }) => `http://127.0.0.1:4000/files/${image}`,
		members: ({ id }, _, { models }) =>
			models.Member.count({ where: { groupId: id } }),
		me: async ({ id }, _, { models, user: { userId } }) => {
			const res = await models.Member.findOne({
				where: { groupId: id, userId },
			});
			if (res) return true;
			return false;
		},
		tags: async ({ id }, _, { models }) => {
			const res = await models.Tag.findAll({
				include: {
					model: models.Group,
					where: { id },
					through: models.GroupTag,
				},
			});
			console.log(res);
			return res;
		},
	},
	Mutation: {
		joinGroup: async (_, { groupId }, { models, user: { userId } }) => {
			try {
				await models.Member.create({ groupId, userId });
				const user = await models.User.findOne({
					where: { id: userId },
					raw: true,
				});
				pubsub.publish(GROUP_MEMBER_ADDED, {
					groupMemberAdded: { ...user, groupId },
				});
			} catch (err) {
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},
		createGroup: async (
			_,
			{ public: status, ...args },
			{ models, user: { userId }, sequelize }
		) => {
			let transaction, group, tags;
			tags = args.tags.map((tag) => ({ value: tag }));
			try {
				models.Tag.bulkCreate(tags);
				//eslint-disable-next-line
			} catch (err) {}

			try {
				// create group and add admin as a member
				transaction = await sequelize.transaction();
				group = (
					await models.Group.create({
						public: status,
						admin: userId,
						name: args.name,
						description: args.description,
					})
				).get({ plain: true });

				// create non existing tags and also add the corresponding association
				tags.forEach(async ({ value }) => {
					let tag = await models.Tag.findOne({ where: { value }, raw: true });
					if (!tag)
						tag = (await models.Tag.create({ value })).get({ plain: true });
					models.GroupTag.create({ groupId: group.id, tagId: tag.id });
				});

				await models.Member.create({ userId, groupId: group.id });
				transaction.commit();
			} catch (err) {
				transaction.rollback();
				console.log(err);
				return { ok: false, error: formatErrors(err) };
			}
			return { ok: true, id: group.id };
		},
	},
};

export default ProfileResolvers;
