import pubsub from "../pubsub";
import { Op } from "sequelize";
import { withFilter } from "apollo-server";
import {
	NOTIFICATION_ADDED,
	NOTIFICATION_DELETED,
	FRIEND_REQUEST_NOTIFICATION_ADDED,
} from "../events";

const Notification = {
	Subscription: {
		friendRequestNotificationAdded: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(FRIEND_REQUEST_NOTIFICATION_ADDED),
				async ({ friendRequestNotificationAdded }, _, { user: { userId } }) => {
					console.log(friendRequestNotificationAdded.receiver === userId);
					console.log("jsldfjldsjfldsfdsfsdfsdfsfsffsd");
					return friendRequestNotificationAdded.receiver === userId;
				}
			),
		},
		notificationDeleted: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(NOTIFICATION_DELETED),
				async ({ notificationDeleted }, _, { user: { userId } }) =>
					notificationDeleted.receiver === userId
			),
		},
		notificationAdded: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(NOTIFICATION_ADDED),
				async ({ notificationAdded }, _, { user: { userId } }) =>
					notificationAdded.receiver === userId
			),
		},
	},

	Notification: {
		sender: ({ sender }, _, { models }) =>
			models.User.findOne({ where: { id: sender } }),
		receiver: (_, __, { models, user: { userId } }) =>
			models.User.findOne({ where: { id: userId } }),
		post: ({ object, objectId }, _, { models }) => {
			if (object === "post")
				return models.Post.findOne({ where: { id: objectId } });
			return null;
		},
		comment: ({ object, objectId }, _, { models }) => {
			if (object === "comment")
				return models.Comment.findOne({ where: { id: objectId } });
			return null;
		},
		group: ({ targetId, target }, _, { models }) => {
			if (target === "group")
				return models.Group.findOne({ where: { id: targetId } });
			return null;
		},
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
	},

	Query: {
		getAllNotifications: (_, __, { models, user: { userId } }) =>
			models.Notification.findAll({ where: { receiver: userId } }),
		getUnreadFriendRequestNotifications: async (
			_,
			__,
			{ models, user: { userId } }
		) => {
			return await models.Notification.findAll({
				where: {
					receiver: userId,
					read: false,
					object: "friend request",
				},
			});
		},
		getUnreadNotifications: async (_, __, { models, user: { userId } }) => {
			return await models.Notification.findAll({
				where: {
					receiver: userId,
					read: false,
					object: {
						[Op.ne]: "friend request",
					},
				},
			});
		},

		getUnreadNotificationsCount: async (
			_,
			__,
			{ models, user: { userId } }
		) => {
			let count = 0;
			try {
				count = await models.Notification.count({
					where: {
						receiver: userId,
						read: false,
						object: {
							[Op.ne]: "friend request",
						},
					},
				});
			} catch (err) {
				console.log(err);
			}
			return count;
		},
	},

	Mutation: {
		markFriendRequestNotificationsAsRead: (
			_,
			__,
			{ models, user: { userId } }
		) => {
			try {
				models.Notification.update(
					{ read: true },
					{
						where: {
							receiver: userId,
							read: false,
							object: "friend request",
						},
					}
				);
			} catch (err) {
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},
		markNotificationsAsRead: (_, __, { models, user: { userId } }) => {
			try {
				models.Notification.update(
					{ read: true },
					{
						where: {
							receiver: userId,
							read: false,
							object: {
								[Op.ne]: "friend request",
							},
						},
					}
				);
			} catch (err) {
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},
	},
};
export default Notification;
