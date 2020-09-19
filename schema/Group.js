import { gql } from "apollo-server-express";

const GroupSchema = gql`
	type Group {
		name: String!
		createdAt: String!
		image: String!
		public: Boolean!
		description: String!
		members: Int!
		admin: Int
	}

	extend type Query {
		getGroup(groupId: Int!): Group!
	}
`;

export default GroupSchema;
