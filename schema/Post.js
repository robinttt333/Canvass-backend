import { gql } from "apollo-server-express";

const PostSchema = gql`
	type Post {
		createdAt: String!
		content: String!
		pinned: Boolean!
		author: User!
		groupId: Int!
		id: Int!
	}

	type CreatePostResponse {
		ok: Boolean!
		error: Error
		post: Post
	}

	extend type Query {
		getPosts(groupId: Int!): [Post!]!
	}

	extend type Mutation {
		createPost(content: String!, groupId: Int!): CreatePostResponse!
	}
`;

export default PostSchema;
