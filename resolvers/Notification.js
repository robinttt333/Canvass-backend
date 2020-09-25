import pubsub from "../pubsub";
import { withFilter } from "apollo-server";
import { NOTIFICATION_ADDED, NOTIFICATION_DELETED } from "../events";

const Notification = {
	Subscription: {
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
	},
	Query: {
		getUnreadNotifications: async (_, __, { models }) => {
			const userId = 1;
			return await models.Notification.findAll({
				where: { receiver: userId, read: false },
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
					where: { receiver: userId, read: false },
				});
			} catch (err) {
				console.log(err);
			}
			return count;
		},
	},
};
export default Notification;
