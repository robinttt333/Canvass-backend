import { createGroupInviteNotification } from "../general";
import { createGroupInviteAcceptedNotification } from "../general";

const GroupInvite = {
	Mutation: {
		acceptGroupInvite: async (
			_,
			args,
			{ sequelize, models, user: { userId } }
		) => {
			let transaction;
			try {
				transaction = await sequelize.transaction();
				await models.GroupInvite.destroy({
					where: { ...args, receiver: userId },
				});
				models.Member.create({
					where: { userId: args.receiver, groupId: args.groupId },
				});
				// roles of sender and receiver have now changed
				createGroupInviteAcceptedNotification({
					models,
					sender: userId,
					receiver: args.sender,
					groupId: args.groupId,
				});
				transaction.commit();
			} catch (err) {
				transaction.rollback();
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},
		cancelGroupInvite: async (_, args, { models, user: { userId } }) => {
			try {
				await models.GroupInvite.destroy({
					where: { ...args, receiver: userId },
				});
			} catch (err) {
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},
		inviteGroupMembers: async (
			_,
			{ members, groupId },
			{ models, user: { userId: me } }
		) => {
			try {
				const members_ = members.map((userId) => ({
					receiver: userId,
					sender: me,
					groupId,
				}));
				await models.GroupInvite.bulkCreate(members_);
				createGroupInviteNotification({ models, members_ });
			} catch (err) {
				console.log(err);
				return { ok: false };
			}

			return { ok: true };
		},
	},
	Query: {
		getGroupInvites: (_, __, { models, user: { userId } }) =>
			models.GroupInvite.findAll({ where: { receiver: userId } }),
	},
	GroupInvite: {
		sender: ({ sender }, _, { models }) =>
			models.User.findOne({ where: { id: sender } }),
		receiver: ({ receiver }, _, { models }) =>
			models.User.findOne({ where: { id: receiver } }),
		group: ({ groupId }, _, { models }) =>
			models.Group.findOne({ where: { id: groupId } }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
	},
};
export default GroupInvite;
