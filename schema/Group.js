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
		admin: Int
	}
	type UserGroup {
		group: Group
		unseenPosts: Int!
	}

	extend type Query {
		getGroup(groupId: Int!): Group!
		getUserGroups: [UserGroup!]!
	}
`;

export default GroupSchema;
