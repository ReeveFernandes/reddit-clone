import { Ctx, Query, Resolver, Mutation, Arg, Int } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
/**
 * @description Provides resolution for posts within a GraphQL schema, handling queries
 * and mutations to retrieve or modify post data in a database.
 */
@Resolver()
export class PostResolver {
	@Query(() => [Post])
	/**
	 * @description Retrieves an array of `Post` objects from the database using the
	 * `find()` method of the entity manager (`em`).
	 * 
	 * @param {object} obj - Represented as `MyContext`.
	 * 
	 * @param {MyContext} obj.em - Used to represent the entity manager, which is responsible
	 * for managing data operations related to the Post entity.
	 * 
	 * @returns {Promise<Post[]>} An array of post objects.
	 */
	posts(@Ctx() { em }: MyContext): Promise<Post[]> {
		return em.find(Post, {});
	}

	@Query(() => Post, { nullable: true })
	/**
	 * @description Resolves a single post by ID from the `MyContext` object, using the
	 * `findOne()` method.
	 * 
	 * @param {number} id - Used to identify a specific post in the database to be retrieved.
	 * 
	 * @param {object} obj - Called 'em'.
	 * 
	 * @param {MyContext} obj.em - Used to access the context of the repository for
	 * querying data.
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
	 * @description Creates a new post and persists it to the database, returning the
	 * created post object.
	 * 
	 * @param {string} title - Used to assign a title to the newly created post.
	 * 
	 * @param {object} obj - Passed as an instance of the class `MyContext`. The `MyContext`
	 * class has not been provided, so its
	 * features are unknown.
	 * 
	 * @param {MyContext} obj.em - Used to represent the entity manager, which is an
	 * object that manages the persistence of data in the application.
	 * 
	 * @returns {Promise<Post>} A resolved promise containing a Post object.
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
	 * @description Updates an existing post in a database, retrieving it first using the
	 * `em.findOne()` method, then updating its title (if provided) and persistently
	 * saving it to the database using `em.persistAndFlush()`.
	 * 
	 * @param {number} id - Used to identify the post to be updated.
	 * 
	 * @param {string} title - Used to update the title of a post if it is present,
	 * otherwise it will be `null`.
	 * 
	 * @param {object} obj - Called `MyContext`. This context contains an EntityManager
	 * (EM) that allows for the persistence and flushing of data to the database when
	 * updates are made.
	 * 
	 * @param {MyContext} obj.em - Used to access the entity manager for performing CRUD
	 * operations on the `Post` entity.
	 * 
	 * @returns {Promise<Post | null>} Either a Post object or null.
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
	 * @description Deletes a post with the specified ID using the `nativeDelete` method
	 * of the context's repository.
	 * 
	 * @param {number} id - Used to identify the post to be deleted.
	 * 
	 * @param {object} obj - From the context, which means it is a dependency injection
	 * container used to resolve dependencies for the function.
	 * 
	 * @param {MyContext} obj.em - Used to access the database context for executing the
	 * native delete operation.
	 * 
	 * @returns {Promise<boolean>} True if the post was successfully deleted and false otherwise.
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
