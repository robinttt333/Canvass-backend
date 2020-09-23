import { Op } from "sequelize";
import formatErrors from "../formatError";
import pubsub from "../pubsub";
import { MESSAGE_ADDED } from "../events";
import { withFilter } from "apollo-server";
import { CHAT_MEMBER_ADDED } from "../events";

const Message = {
	Subscription: {
		messageAdded: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(MESSAGE_ADDED),
				async ({ messageAdded }, _, { user: { userId }, models }) => {
					// check if current user is a member of group
					let res;
					if (
						messageAdded.sender === userId ||
						messageAdded.receiver === userId
					)
						return true;
					return false;
				}
			),
		},

		chatMemberAdded: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(CHAT_MEMBER_ADDED),
				async ({ chatMemberAdded }, _, { user: { userId }, models }) => {
					// check if current user is actually the receiver of the message
					if (chatMemberAdded.receiver === userId) return true;
					return false;
				}
			),
		},
	},
	Mutation: {
		createMessage: async (_, args, { models, user: { userId } }) => {
			try {
				const message = await models.Message.create({
					...args,
					sender: userId,
				});
				pubsub.publish(MESSAGE_ADDED, { messageAdded: message });
				const user = await models.User.findOne({
					where: { id: userId },
					raw: true,
				});
				pubsub.publish(CHAT_MEMBER_ADDED, {
					chatMemberAdded: { ...user, receiver: args.receiver },
				});
			} catch (err) {
				console.log(err);
				return { ok: false, error: formatErrors(err) };
			}
			// also check if this is the firs message of their conversation
			const messageCount = await models.Message.count({
				raw: true,
				where: {
					[Op.or]: [
						{ [Op.and]: [{ sender: userId }, { receiver: args.receiver }] },
						{ [Op.and]: [{ receiver: userId }, { sender: args.receiver }] },
					],
				},
			});
			if (messageCount === 1) {
				const user = await models.User.findOne({
					where: { id: userId },
					raw: true,
				});
				pubsub.publish(CHAT_MEMBER_ADDED, {
					chatMemberAdded: { ...user, receiver: args.receiver },
				});
			}
			return { ok: true };
		},
	},
	ChatMember: {
		user: (parent) => parent,
		unreadMessagesCount: async ({ id }, __, { models, user: { userId } }) => {
			let res;
			try {
				res = await models.Message.count({
					where: { receiver: userId, sender: id, read: false },
				});
			} catch (err) {
				console.log(err);
			}
			return res;
		},
	},
	Query: {
		getUnreadMessagesCount: async (_, __, { models, user: { userId } }) =>
			await models.Message.count({ where: { receiver: userId, read: false } }),
		getChatMembers: async (_, __, { sequelize, user: { userId } }) => {
			//We join Message and User using the fact that whether
			//current user is either the sender and receiver
			//Thus we get all conversations in which he/she is involved
			//Note the distinct in the beginning of the query
			const res = await sequelize.query(
				`
		Select distinct Users.id,Users.username
			from "Users" as Users, "Messages" as Messages
			where(
					(Users.id = Messages.sender and Messages.receiver = :userId)
					or
					(Users.id = Messages.receiver and Messages.sender = :userId)
				) `,
				{
					replacements: { userId },
				}
			);
			return res[0];
		},
		getChat: async (
			_,
			{ userId },
			{ sequelize, models, user: { userId: me } }
		) => {
			await sequelize.query(
				`Update "Messages" set read=true where
					sender=:userId and receiver=:me`,
				{
					replacements: { me, userId },
				}
			);
			//This is equivalent to select * from messages where
			//sender=user and receiver=me or sender=me and receiver=user
			const res = await models.Message.findAll({
				raw: true,
				where: {
					[Op.or]: [
						{ [Op.and]: [{ sender: me }, { receiver: userId }] },
						{ [Op.and]: [{ receiver: me }, { sender: userId }] },
					],
				},
			});
			return res;
		},
	},
	Message: {
		sender: ({ sender }, _, { models }) =>
			models.User.findOne({ where: { id: sender } }),
		receiver: ({ receiver }, _, { models }) =>
			models.User.findOne({ where: { id: receiver } }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
	},
};
export default Message;
