import { gql } from "apollo-server-express";

const UserSchema = gql`
	type User {
		email: String!
		username: String!
		password: String!
		profile: Profile!
		id: Int!
	}

	type Error {
		path: String!
		message: String!
	}

	type createUserResponse {
		ok: Boolean!
		error: Error
	}

	type getUserResponse {
		user: User
		ok: Boolean!
	}

	type LoginResponse {
		ok: Boolean!
		error: Error
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
		login(usernameOrEmail: String!, password: String!): LoginResponse!
	}
`;

export default UserSchema;
