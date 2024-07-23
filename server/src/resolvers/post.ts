import { Ctx, Query, Resolver, Mutation, Arg, Int } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
/**
 * @description Provides resolution functions for Post entities in a GraphQL schema,
 * allowing for querying, creating, updating, and deleting posts.
 */
@Resolver()
export class PostResolver {
	@Query(() => [Post])
	/**
	 * @description Retrieves an array of `Post` objects from the database using the `em`
	 * instance's `find()` method.
	 * 
	 * @param {object} obj - Used to represent an instance of the `MyContext` class, which
	 * provides access to data stored in a database or other data storage system.
	 * 
	 * @param {MyContext} obj.em - Used as the entity manager for querying posts.
	 * 
	 * @returns {Promise<Post[]>} An array of Post objects.
	 */
	posts(@Ctx() { em }: MyContext): Promise<Post[]> {
		return em.find(Post, {});
	}

	@Query(() => Post, { nullable: true })
	/**
	 * @description Retrieves a post from the database based on its ID using the
	 * `em.findOne()` method.
	 * 
	 * @param {number} id - Used to identify a specific post to be retrieved or created.
	 * 
	 * @param {object} obj - Referred to as `em`. This collection represents an instance
	 * of `MyContext`.
	 * 
	 * @param {MyContext} obj.em - Used to represent the context of the application,
	 * providing access to entities and their relationships within the application's
	 * domain model.
	 * 
	 * @returns {Promise<Post | null>} A promise that resolves to either a Post object
	 * or null.
	 */
	post(
		@Arg("id", () => Int) id: number,
		@Ctx() { em }: MyContext
	): Promise<Post | null> {
		return em.findOne(Post, { id });
	}

	@Mutation(() => Post)
	/**
	 * @description Creates a new post entity and persists it to the database, returning
	 * the newly created post object.
	 * 
	 * @param {string} title - Used to set the title of a new post.
	 * 
	 * @param {object} obj - Represented by the abbreviation `em`. It provides access to
	 * the entity manager, allowing for the creation and persistence of objects in the database.
	 * 
	 * @param {MyContext} obj.em - Used to represent the entity manager that handles
	 * creation and persistence of data objects, such as Posts, in this case.
	 * 
	 * @returns {Promise<Post>} A Post object containing the title, createdAt and updatedAt
	 * fields.
	 */
	async createPost(
		@Arg("title") title: string,
		@Ctx() { em }: MyContext
	): Promise<Post> {
		const post = em.create(Post, {
			title,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		await em.persistAndFlush(post);
		return post;
	}

	@Mutation(() => Post, { nullable: true })
	/**
	 * @description Updates an existing post in a database, setting its title if provided,
	 * and returning the updated post or null if the post does not exist.
	 * 
	 * @param {number} id - Used to identify the post to be updated.
	 * 
	 * @param {string} title - Nullable. It updates the title field of the post if provided,
	 * otherwise leaves it unchanged.
	 * 
	 * @param {object} obj - Referenced as `em`. It represents an instance of the `MyContext`
	 * class, which provides a repository for managing posts in the application's database.
	 * 
	 * @param {MyContext} obj.em - Used to manage the persistence and flushing of updated
	 * post data to the database.
	 * 
	 * @returns {Promise<Post | null>} A promise that resolves to a Post object or null.
	 */
	async updatePost(
		@Arg("id") id: number,
		@Arg("title", () => String, { nullable: true }) title: string,
		@Ctx() { em }: MyContext
	): Promise<Post | null> {
		const post = await em.findOne(Post, { id });
		if (!post) {
			return null;
		}
		if (typeof title !== "undefined") {
			post.title = title;
			await em.persistAndFlush(post);
		}
		return post;
	}

	@Mutation(() => Boolean)
	/**
	 * @description Deletes a post with the given ID from the database using the
	 * `nativeDelete()` method of the context object.
	 * 
	 * @param {number} id - Used to identify the post to be deleted.
	 * 
	 * @param {object} obj - Named 'em'. It is an instance of the MyContext class, which
	 * provides access to the data layer for the application's data model.
	 * 
	 * @param {MyContext} obj.em - Used to provide access to the underlying database
	 * context for deleting a post.
	 * 
	 * @returns {Promise<boolean>} 1 if the post was deleted successfully, and false otherwise.
	 */
	async deletePost(
		@Arg("id") id: number,
		@Ctx() { em }: MyContext
	): Promise<boolean> {
		try {
			await em.nativeDelete(Post, { id });
		} catch {
			return false;
		}
		return true;
	}
}
