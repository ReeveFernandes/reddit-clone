import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
// import { Post } from "./entities/Post";
import express from "express";
import { ApolloServer, ServerRegistration } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { __prod__ } from "./constants";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";

/**
 * @description Sets up an instance of MikroORM and uses it to migrate the database,
 * then creates an Apollo Server using the schema built with `buildSchema`. The server
 * is started and middleware is applied to the express app. Finally, a post is created
 * and persisted in the database using MikroORM.
 */
const main = async () => {
	const orm = await MikroORM.init(mikroOrmConfig);
	await orm.getMigrator().up();

	const app = express();

	// Initialize client.
	const redisClient = createClient();
	redisClient.connect().catch(console.error);

	// Initialize store.
	const redisStore = new RedisStore({
		client: redisClient,
		prefix: "myapp:",
		disableTouch: true
	});

	app.use(cors({ origin: "http://localhost:3000", credentials: true }));

	// Initialize session storage.
	app.use(
		session({
			name: "qid",
			store: redisStore,
			resave: false, // required: force lightweight session keep alive (touch)
			saveUninitialized: false, // recommended: only save session when data exists
			secret: "keyboard cat",
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: "lax",
				secure: __prod__
			}
		})
	);

	const apolloServer = new ApolloServer({
		plugins: [
			ApolloServerPluginLandingPageGraphQLPlayground({
				// options
			})
		],
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false
		}),
		context: ({ req, res }) => ({ em: orm.em, req, res })
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app, cors: false } as ServerRegistration);

	app.listen(4000, () => {
		// Starts a server listening on port 4000 and logs a message to the console when it
		// starts.

		console.log("Server started on localhost:4000");
	});
};

main().catch((err: any) => {
	// Handles any type of error by logging it to console using `console.error()` method.

	console.error(err);
});
