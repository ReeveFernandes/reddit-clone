import { __prod__ } from "./constants";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
	migrations: {
		path: path.join(__dirname, "./migrations")
	},
	driver: PostgreSqlDriver,
	dbName: "reddit",
	user: "postgres",
	password: "postgres",
	port: 5000,
	debug: !__prod__,
	entities: [Post, User],
	allowGlobalContext: true
} as Parameters<typeof MikroORM.init>[0];
