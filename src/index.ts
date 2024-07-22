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
 * @description Sets up an instance of MikroORM and uses it to migrate the database,
 * then creates an Apollo Server using the schema built with `buildSchema`. The server
 * is started and middleware is applied to the express app. Finally, a post is created
 * and persisted in the database using MikroORM.
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
		// Starts an HTTP server listening at port 4000 and logs "Server started on localhost:4000"
		// to the console when executed.

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
	// Logs any error parameters passed to it via console.error

	console.error(err);
});
