import { gql } from "apollo-server-express";
//me is used to check if I am a group member
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
		me: Boolean!
		tags: [Tag!]!
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
	type JoinGroupResponse {
		ok: Boolean!
	}
	extend type Mutation {
		createGroup(
			name: String!
			description: String!
			public: Boolean!
			tags: [String!]!
		): CreateGroupResponse!
		joinGroup(groupId: Int!): JoinGroupResponse!
	}

	extend type Query {
		getGroup(groupId: Int!): Group!
		getUserGroups: [UserGroup!]!
	}
`;

export default GroupSchema;
