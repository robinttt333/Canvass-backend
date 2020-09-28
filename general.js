import formatError from "./formatError";
import { randomDescription } from "./constants";
import pubsub from "./pubsub";
import {
	FRIEND_REQUEST_NOTIFICATION_ADDED,
	NOTIFICATION_DELETED,
	NOTIFICATION_ADDED,
	GROUP_INVITE_NOTIFICATION_ADDED,
} from "./events";

export const makeGroups = async (models) => {
	try {
		const group = await models.Group.findOne({ where: { name: "General" } });
		if (group) return;
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

export const createGroupInviteNotification = async ({
	models,
	members_: members,
}) => {
	try {
		const members_ = members.map(({ sender, receiver, groupId }) => ({
			sender,
			receiver,
			targetId: groupId,
			verb: "sent",
			text: "sent you an",
			object: "invitation",
			target: "group",
		}));
		const notifications = await models.Notification.bulkCreate(members_, {
			returning: true,
		});
		notifications.map((notification) => {
			pubsub.publish(GROUP_INVITE_NOTIFICATION_ADDED, {
				groupInviteNotificationAdded: notification,
			});
		});
	} catch (err) {
		console.log(err);
	}
};

export const createGroupInviteAcceptedNotification = async ({
	models,
	sender,
	receiver,
	groupId,
}) => {
	try {
		const notification = await models.Notification.create({
			sender,
			receiver,
			targetId: groupId,
			verb: "accepted",
			text: "accepted your",
			object: "invitation",
			target: "group",
		});
		pubsub.publish(GROUP_INVITE_NOTIFICATION_ADDED, {
			groupInviteNotificationAdded: notification,
		});
	} catch (err) {
		console.log(err);
	}
};
