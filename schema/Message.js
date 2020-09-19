import { gql } from "apollo-server-express";

const MessageSchema = gql`
	type Message {
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
		getChat(userId: Int!): Group!
		getChatMembers: [User!]!
	}

	extend type Mutation {
		createMessage(userId: Int!, content: String!): SendMessageResponse!
	}
`;

export default MessageSchema;
