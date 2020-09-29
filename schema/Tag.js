import { gql } from "apollo-server-express";

const TagSchema = gql`
	type Tag {
		id: Int!
		value: String!
	}
	extend type Query {
		getAllTags: [Tag!]!
	}
`;
export default TagSchema;
