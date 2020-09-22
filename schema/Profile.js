import { gql } from "apollo-server-express";

const ProfileSchema = gql`
	type Profile {
		id: Int!
		firstName: String
		lastName: String
		dp: String!
		dob: String
		status: String
		gender: Boolean!
		user: User!
		createdAt: String!
		lastSeen: String
	}

	type UpdateProfileResponse {
		ok: Boolean!
		error: Error
	}
	type UpdateImageResponsej {
		ok: Boolean!
		error: Error
	}

	extend type Query {
		getProfile(userId: Int!): Profile!
	}

	extend type Mutation {
		updateProfile(
			userId: Int!
			firstName: String!
			lastName: String!
			status: String!
			dob: String!
			gender: Boolean!
		): UpdateProfileResponse!
		updateImage(file: Upload!): UpdateImageResponsej!
	}
`;

export default ProfileSchema;
