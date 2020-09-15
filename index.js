import { models, sequelize } from "./models";
import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import resolvers from "./resolvers";

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: () => ({ models, sequelize }),
});
const PORT = 4000;
sequelize.sync().then(() => {
	server.listen({ port: PORT }).then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`);
	});
});
