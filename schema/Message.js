import { gql } from "apollo-server-express";

const MessageSchema = gql`
	type Message {
		id: Int!
		createdAt: String!
		sender: User!
		receiver: User!
		content: String!
		read: Boolean!
	}
	type SendMessageResponse {
		ok: Boolean!
		error: Error
	}

	type ChatMember {
		user: User!
		unreadMessagesCount: Int!
	}

	extend type Query {
		getChat(userId: Int!): [Message!]!
		getChatMembers: [ChatMember!]!
		getUnreadMessagesCount: Int!
	}

	extend type Mutation {
		createMessage(content: String!, receiver: Int!): SendMessageResponse!
	}
	extend type Subscription {
		messageAdded: Message!
		chatMemberAdded: User!
	}
`;

export default MessageSchema;
