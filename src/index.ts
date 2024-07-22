import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";
// import { Post } from "./entities/Post";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

/**
 * @description Initiates a MikroORM database connection, runs migrations, creates
 * an ApolloServer with schema and resolvers, starts the server, applies middleware,
 * and persists a new post to the database.
 */
const main = async () => {
	const orm = await MikroORM.init(mikroOrmConfig);
	await orm.getMigrator().up();

	const app = express();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false
		}),
		context: () => ({ em: orm.em })
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({ app } as { app: any });

	app.listen(4000, () => {
		// Runs when the server is started and logs the message "Server started on localhost:4000"
		// to the console.

		console.log("Server started on localhost:4000");
	});

	// const post = orm.em.create(Post, {
	// 	title: "Hello World",
	// 	createdAt: new Date(),
	// 	updatedAt: new Date()
	// });
	// await orm.em.persistAndFlush(post);

	// const posts = await orm.em.find(Post, {});
	// console.log(posts);
};

main().catch((err) => {
	// Catches and logs any errors occurred during execution to the console.

	console.error(err);
});
