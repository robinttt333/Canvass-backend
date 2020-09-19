import { gql } from "apollo-server-express";

const PostSchema = gql`
	type Post {
		createdAt: String!
		content: String!
		pinned: Boolean!
		author: User!
		groupId: Int!
		id: Int!
		likes: Int!
		liked: Boolean!
	}

	type CreatePostResponse {
		ok: Boolean!
		error: Error
	}

	type ToggleLikeResponse {
		ok: Boolean!
	}

	extend type Query {
		getPosts(groupId: Int!): [Post!]!
	}

	extend type Mutation {
		createPost(content: String!, groupId: Int!): CreatePostResponse!
		toggleLike(postId: Int!): ToggleLikeResponse!
	}

	type Subscription {
		postAdded(groupId: Int!): Post!
	}
`;

export default PostSchema;
