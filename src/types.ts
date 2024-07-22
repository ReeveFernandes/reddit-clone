import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

/**
 * @description Declares a type that has an entity manager with an
 * EntityManager<IDatabaseDriver<Connection>>. An Entity Manager is a fundamental
 * part of any Object-Relational Mapping (ORM) tool, which allows developers to
 * interact with databases using objects rather than writing SQL queries directly.
 * The EntityManager manages the underlying database connection and provides methods
 * for performing CRUD (Create, Read, Update, Delete) operations on data.
 * 
 * The `IDatabaseDriver<Connection>` type parameter is a generic type that represents
 * the driver used to connect to the database. This allows the Entity Manager to work
 * with different database drivers, such as MySQL, PostgreSQL, or Oracle. The
 * `<Connection>` type parameter represents the connection to the database, which is
 * passed to the EntityManager constructor.
 * 
 * The `MyContext` interface provides a way to access the Entity Manager and perform
 * database operations in a more object-oriented and modular manner than using direct
 * database queries.
 */
export interface MyContext {
	em: EntityManager<IDatabaseDriver<Connection>>;
}
