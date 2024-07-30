import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
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

	// app.set("trust proxy", !__prod__);
	// app.set("Access-Control-Allow-Origin", "http://localhost:3000");
	// app.set("Access-Control-Allow-Credentials", true);

	// Initialize client.
	const redisClient = createClient();
	redisClient.connect().catch(console.error);

	// Initialize store.
	const redisStore = new RedisStore({
		client: redisClient,
		prefix: "myapp:",
		disableTouch: true,
		disableTTL: true
	});

	// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

	const corsOptions = {
		origin: "http://localhost:3000",
		credentials: true
	};

	app.use(cors(corsOptions));

	// const corsOptions = { credentials: true, origin: "http://localhost:3000" };

	// Initialize session storage.
	app.use(
		session({
			name: "qid",
			store: redisStore,
			resave: false, // required: force lightweight session keep alive (touch)
			saveUninitialized: true, // recommended: only save session when data exists
			secret: "keyboard cat",
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: false,
				sameSite: "lax", // csrf
				secure: __prod__, // cookie only works in https,
				priority: "high"
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
	apolloServer.applyMiddleware({
		app,
		cors: false
	} as ServerRegistration);

	app.listen(4000, () => {
		console.log("Server started on localhost:4000");
	});
};

main().catch((err: any) => {
	console.error(err);
});
