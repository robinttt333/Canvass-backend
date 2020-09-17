import { models, sequelize } from "./models";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import express from "express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { getTokens } from "./auth";
import path from "path";
import formatError from "./formatError";

const randomDescription = `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`;
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

//enable cors for cookies
server.applyMiddleware({
	app,
	path: "/graphql",
	cors: { origin: "http://127.0.0.1:3000", credentials: true },
});

const PORT = 4000;
sequelize.sync().then(async () => {
	//create random and general groups if they do not already exist
	try {
		await models.Group.create({
			name: "General",
			description: randomDescription,
		});
		await models.Group.create({
			name: "Random",
			description: randomDescription,
		});
	} catch (err) {
		console.log(
			"Something went wrong while creating general and random groups"
		);
		console.log(formatError(err));
	}
	app.listen({ port: PORT }, () => {
		console.log(`🚀  Server ready at 127.0.0.1/${server.graphqlPath}`);
	});
});
