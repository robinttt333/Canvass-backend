import { models, sequelize } from "./models";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import express from "express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { getTokens } from "./auth";
import path from "path";

const SECRET = "12gghjut%^&%gjhJHJ";
const app = express();

app.use(cookieParser());
//eslint-disable-next-line
app.use("/files", express.static(path.join(__dirname, "files")));
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res, models, sequelize }),
});
//middleware to automatically verify and set token if it expires
app.use(async (req, res, next) => {
	let data;
	let accessToken = req.cookies && req.cookies["access-token"];
	const refreshToken = req.cookies && req.cookies["refresh-token"];

	if (!refreshToken && !accessToken) return next();

	try {
		const user = verify(accessToken, SECRET);
		req.user = user;
		return next();
		//eslint-disable-next-line
	} catch (err) {}

	try {
		data = verify(refreshToken, SECRET);
	} catch (err) {
		return next();
	}

	const user = await models.User.findOne({
		where: { id: data.userId },
		raw: true,
	});

	if (!user || user.count != data.count) return next();
	const { accessTokenNew, refreshTokenNew } = getTokens(user);
	res.cookie("access-token", accessTokenNew);
	res.cookie("refresh-token", refreshTokenNew);
	req.user = { username: user.username, userId: user.id };
	return next();
});

server.applyMiddleware({
	app,
	path: "/graphql",
	cors: { origin: "http://127.0.0.1:3000", credentials: true },
});

const PORT = 4000;
sequelize.sync().then(() => {
	app.listen({ port: PORT }, () => {
		console.log(`🚀  Server ready at 127.0.0.1/${server.graphqlPath}`);
	});
});
