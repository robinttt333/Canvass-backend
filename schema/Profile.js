import { gql } from "apollo-server-express";

const ProfileSchema = gql`
	type Profile {
		firstName: String
		lastName: String
		dp: String!
		dob: String
		status: String
		sex: Boolean!
		user: User!
		createdAt: String!
	}

	extend type Query {
		getProfile(userId: Int!): Profile!
	}
`;

export default ProfileSchema;
