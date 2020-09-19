import { gql } from "apollo-server-express";

const MemberSchema = gql`
	type Member {
		user: User!
		memberSince: String!
	}
	extend type Query {
		getGroupMembers(groupId: Int!): [Member!]!
	}
`;
export default MemberSchema;
