import { gql } from "apollo-server-express";
// lastPostSeen is used to track the last post
const GroupSchema = gql`
	type Group {
		id: Int!
		name: String!
		createdAt: String!
		image: String!
		public: Boolean!
		description: String!
		members: Int!
		admin: User
	}
	type UserGroup {
		group: Group
		unseenPosts: Int!
	}
	type CreateGroupResponse {
		ok: Boolean!
		id: Int
		error: Error
	}

	extend type Mutation {
		createGroup(
			name: String!
			description: String!
			public: Boolean!
		): CreateGroupResponse!
	}

	extend type Query {
		getGroup(groupId: Int!): Group!
		getUserGroups: [UserGroup!]!
	}
`;

export default GroupSchema;
