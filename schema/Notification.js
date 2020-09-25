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
		target: String!
		post: Post
		comment: Comment
		group: Group
		objectId: Int!
		targetId: Int!
	}

	extend type Query {
		getUnreadNotificationsCount: Int!
		getUnreadNotifications: [Notification!]!
	}
	extend type Subscription {
		notificationAdded: Notification!
		notificationDeleted: Notification!
	}
`;

export default NotificationSchema;
