import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, Int } from "type-graphql";

/**
 * @description Defines a representation of a user in a system, with fields for ID,
 * created and updated at timestamps, username, and password.
 */
@ObjectType()
@Entity()
export class User {
	@Field(() => Int)
	@PrimaryKey()
	id!: number;

	@Field(() => String)
	@Property({ default: "now()" })
	createdAt = new Date();

	@Field(() => String)
	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Field()
	@Property({ type: "text", unique: true })
	username!: string;

	@Property({ type: "text" })
	password!: string;
}
