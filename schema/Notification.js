import { gql } from "apollo-server-express";

const NotificationSchema = gql`
	type Notification {
		id: Int!
		createdAt: String!
		sender: User!
		receiver: User!
		read: Boolean!
		verb: String!
		text: String!
		object: String!
		target: String
		post: Post
		comment: Comment
		group: Group
		objectId: Int!
		targetId: Int!
	}
	type MarkNotificationsAsReadResponse {
		ok: Boolean!
	}
	extend type Mutation {
		markNotificationsAsRead: MarkNotificationsAsReadResponse!
		markFriendRequestNotificationsAsRead: MarkNotificationsAsReadResponse!
	}
	extend type Query {
		getUnreadNotificationsCount: Int!
		getUnreadNotifications: [Notification!]!
		getUnreadFriendRequestNotifications: [Notification!]!
		getAllNotifications: [Notification!]!
	}
	extend type Subscription {
		notificationAdded: Notification!
		notificationDeleted: Notification!
		friendRequestNotificationAdded: Notification!
		friendRequestNotificationDeleted: Notification!
	}
`;

export default NotificationSchema;
