import { gql } from "apollo-server-express";

const MessageSchema = gql`
	type Message {
		id: Int!
		createdAt: String!
		sender: User!
		receiver: User!
		content: String!
	}
	type SendMessageResponse {
		ok: Boolean!
		error: Error
	}

	extend type Query {
		getChat(userId: Int!): [Message!]!
		getChatMembers: [User!]!
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
