import { gql } from "apollo-server-express";

const LastPostSeenSchema = gql`
	type UpdateLastPostSeenResponse {
		ok: Boolean!
	}
	extend type Mutation {
		updateLastPostSeen(groupId: Int!): UpdateLastPostSeenResponse!
	}
`;
export default LastPostSeenSchema;
