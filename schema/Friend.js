import { gql } from "apollo-server-express";
// note userId is the sender of the request to friendId
// this is the reason why in the mutations acceptFriendRequest and cancelFriendRequest
// we specify userId because we are the receiver ie friendId and thus require userId of
// the other person

const FriendSchema = gql`
	type SendFriendRequestResponse {
		ok: Boolean!
	}

	enum FriendshipStatus {
		PENDING
		ACCEPT
		CONFIRMED
		NONE
	}

	type GetFriendshipResponse {
		ok: Boolean!
		status: FriendshipStatus!
	}

	type CancelFriendRequestResponse {
		ok: Boolean
	}

	type AcceptFriendRequestResponse {
		ok: Boolean
	}

	extend type Query {
		getFriendshipStatus(friendId: Int!): GetFriendshipResponse!
	}

	extend type Mutation {
		sendFriendRequest(friendId: Int!): SendFriendRequestResponse!
		acceptFriendRequest(userId: Int!): AcceptFriendRequestResponse!
		cancelFriendRequest(userId: Int!): CancelFriendRequestResponse!
	}
`;

export default FriendSchema;
