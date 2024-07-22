import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";

const main = async () => {
	const orm = await MikroORM.init({
		dbName: "reddit",
		user: "postgres",
		password: "postgres",
		debug: !__prod__
	});
	console.log("Hello World!");
};

main();
