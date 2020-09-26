import formatError from "./formatError";
import { randomDescription } from "./constants";
import pubsub from "./pubsub";
import {
	FRIEND_REQUEST_NOTIFICATION_ADDED,
	NOTIFICATION_DELETED,
	NOTIFICATION_ADDED,
	FRIEND_REQUEST_NOTIFICATION_DELETED,
} from "./events";

export const makeGroups = async (models) => {
	try {
		await models.Group.create({
			name: "General",
			description: randomDescription,
		});
		await models.Group.create({
			name: "Random",
			description: randomDescription,
		});
	} catch (err) {
		console.log(
			"Something went wrong while creating general and random groups"
		);
		console.log(formatError(err));
	}
};

export const updateLastPostSeen = async ({ models, userId, id }) => {
	const seen = await models.LastPostSeen.findOne({
		where: { userId, groupId: id },
		raw: true,
	});

	if (seen) {
		await models.LastPostSeen.update(
			{ timestamp: new Date() },
			{ where: { userId, groupId: id } }
		);
	} else {
		await models.LastPostSeen.create({
			timestamp: new Date(),
			userId,
			groupId: id,
		});
	}
};

export const deleteLikeNotification = async ({ models, sender, postId }) => {
	const post = await models.Post.findOne({ where: { id: postId }, raw: true });
	if (post.author === sender) return;
	const notification = await models.Notification.findOne({
		where: { sender, receiver: post.author, objectId: post.id, verb: "liked" },
	});
	await models.Notification.destroy({
		where: { sender, receiver: post.author, objectId: post.id, verb: "liked" },
	});
	pubsub.publish(NOTIFICATION_DELETED, { notificationDeleted: notification });
};

export const createLikeNotification = async ({ models, sender, postId }) => {
	const post = await models.Post.findOne({ where: { id: postId }, raw: true });
	if (post.author === sender) return;
	const notification = await models.Notification.create({
		sender,
		receiver: post.author,
		verb: "liked",
		text: "liked your",
		object: "post",
		objectId: post.id,
		target: "group",
		targetId: post.groupId,
	});
	pubsub.publish(NOTIFICATION_ADDED, { notificationAdded: notification });
};
export const createCommentNotification = async ({ models, sender, postId }) => {
	const post = await models.Post.findOne({ where: { id: postId }, raw: true });
	if (post.author === sender) return;
	const notification = await models.Notification.create({
		sender,
		receiver: post.author,
		verb: "commented",
		text: "commented on your",
		object: "post",
		objectId: post.id,
		target: "group",
		targetId: post.groupId,
	});
	pubsub.publish(NOTIFICATION_ADDED, { notificationAdded: notification });
};

export const createFriendRequestNotification = async ({
	models,
	sender,
	receiver,
	verb,
	text,
}) => {
	try {
		const notification = await models.Notification.create({
			sender,
			receiver,
			verb,
			text,
			object: "friend request",
			objectId: sender,
		});
		pubsub.publish(FRIEND_REQUEST_NOTIFICATION_ADDED, {
			friendRequestNotificationAdded: notification,
		});
	} catch (err) {
		console.log(err);
	}
};
