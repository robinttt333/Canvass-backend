import { gql } from "apollo-server-express";

const MemberSchema = gql`
	type Member {
		user: User!
		memberSince: String!
	}
	extend type Query {
		getGroupMembers(groupId: Int!): [Member!]!
		getNonGroupMembers(username: String!, groupId: Int!): [User!]!
		getNonGroupAndUninvitedMembers(username: String!, groupId: Int!): [User!]!
	}
	extend type Subscription {
		groupMemberAdded(groupId: Int!): Member!
	}
	type AddGroupMembersResponse {
		ok: Boolean!
	}
`;

export default MemberSchema;
