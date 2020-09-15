import { gql } from "apollo-server";

const UserSchema = gql`
	type User {
		email: String!
		username: String!
		password: String!
	}

	type createUserResponse {
		ok: Boolean!
	}

	type getUserResponse {
		user: User
		ok: Boolean!
	}

	type Query {
		allUsers: [User!]!
		getUser(username: String, email: String): getUserResponse!
	}

	type Mutation {
		createUser(
			email: String!
			username: String!
			password: String!
		): createUserResponse!
	}
`;

export default UserSchema;
