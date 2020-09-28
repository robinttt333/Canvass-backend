import { gql } from "apollo-server-express";

const GroupInviteSchema = gql`
	type GroupInvite {
		id: Int!
		sender: User!
		receiver: User!
		group: Group!
		createdAt: String!
	}
	extend type Query {
		getGroupInvites: [GroupInvite!]!
		getGroupInvite(groupId: Int!): GroupInvite
	}
	type Response {
		ok: Boolean
	}
	extend type Mutation {
		inviteGroupMembers(
			groupId: Int!
			members: [Int!]!
		): AddGroupMembersResponse!
		cancelGroupInvite(sender: Int!, groupId: Int!): Response!
		acceptGroupInvite(sender: Int!, groupId: Int!): Response!
	}
`;

export default GroupInviteSchema;
