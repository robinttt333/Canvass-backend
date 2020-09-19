import { gql } from "apollo-server-express";

const GroupSchema = gql`
	type Comment {
		id: Int!
		content: String!
		createdAt: String!
		author: User!
		post: Int!
	}

	type CreateCommentResponse {
		ok: Boolean!
		error: Error
	}
	extend type Query {
		getComments(postId: Int!): [Comment!]!
	}

	extend type Mutation {
		createComment(content: String!, postId: Int!): CreateCommentResponse!
	}
	extend type Subscription {
		commentAdded(postId: Int!): Comment!
	}
`;

export default GroupSchema;
