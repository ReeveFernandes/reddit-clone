import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, Int } from "type-graphql";

/**
 * @description Defines a data structure for storing information about posts, including
 * their ID, creation and update dates, and title.
 */
@ObjectType()
@Entity()
export class Post {
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
	@Property({ type: "text" })
	title!: string;
}
