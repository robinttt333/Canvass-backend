import { gql } from "apollo-server-express";

const MemberSchema = gql`
	type Member {
		user: User!
		memberSince: String!
	}
	extend type Query {
		getGroupMembers(groupId: Int!): [Member!]!
	}
	extend type Subscription {
		groupMemberAdded(groupId: Int!): Member!
	}
	type AddGroupMembersResponse {
		ok: Boolean!
	}
	extend type Mutation {
		addGroupMembers(groupId: Int!, members: [Int!]!): AddGroupMembersResponse!
	}
`;

export default MemberSchema;
