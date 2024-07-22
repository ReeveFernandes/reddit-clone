import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

/**
 * @description Declares a type that represents an object with an `em` property, which
 * is of type `EntityManager`. An `EntityManager` is an abstraction that manages
 * interactions with a database, and `IDatabaseDriver<Connection>` is a type parameter
 * that represents the specific driver or adapter used to interact with the database.
 * The `<Connection>` type parameter represents the connection to the database.
 */
export interface MyContext {
	em: EntityManager<IDatabaseDriver<Connection>>;
}
