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

	type LoginResponse {
		ok: Boolean!
		error: Error
	}

	type UpdatePasswordResponse {
		ok: Boolean!
		error: Error
	}

	type Query {
		allUsers: [User!]!
		getUser(userId: Int!): User!
	}

	type Mutation {
		createUser(
			email: String!
			username: String!
			password: String!
		): createUserResponse!
		login(usernameOrEmail: String!, password: String!): LoginResponse!
		changePassword(
			oldPassword: String!
			newPassword: String!
		): UpdatePasswordResponse!
	}

	extend type Subscription {
		toggleUserJoined: User!
	}
`;

export default UserSchema;
