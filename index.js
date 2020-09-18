import { models, sequelize } from "./models";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import { makeGroups } from "./general";
import tokenValidateAndResetMiddleware from "./tokenValidateAndResetMiddleware";
import { validateAccessToken, validateRefreshToken } from "./auth";
import {
	GRAPHQL_PORT,
	GRAPHQL_PATH,
	STATIC_PATH,
	CLIENT_ORIGIN,
	STATIC_DIR_PATH,
} from "./constants";

const app = express();
// express Middleware
app.use(cookieParser());
app.use(STATIC_PATH, express.static(STATIC_DIR_PATH));
tokenValidateAndResetMiddleware(app);

//initialize apollo server
const server = new ApolloServer({
	typeDefs,
	resolvers,
	subscriptions: {
		onConnect: ({ accessToken }) => {
			let tokenUser;
			tokenUser = validateAccessToken(accessToken);
			if (tokenUser) {
				return { user: tokenUser };
			}
			throw new Error("Invalid token");
		},
	},
	context: ({ req, res, connection }) => {
		return {
			// res is needed in context to set cookie in response of login
			res,
			models,
			sequelize,
			user: connection ? connection.context.user : req.user,
		};
	},
});

//enable cors for cookies
server.applyMiddleware({
	app,
	path: GRAPHQL_PATH,
	cors: { origin: CLIENT_ORIGIN, credentials: true },
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
sequelize.sync().then(async () => {
	//create random and general groups if they do not already exist
	makeGroups(models);
	httpServer.listen({ port: GRAPHQL_PORT }, () => {
		console.log(`🚀  Server ready at 127.0.0.1/${server.graphqlPath}`);
	});
});
