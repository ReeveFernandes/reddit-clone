import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver
} from "type-graphql";
import argon2 from "argon2";

/**
 * @description Provides a form for users to input their username and password for
 * authentication purposes.
 */
@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

/**
 * @description Centralizes error information related to fields within an object,
 * providing a convenient means for storing and accessing field-specific error messages.
 */
@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}

/**
 * @description Represents a response to a user, containing information about any
 * errors that occurred during processing and the user itself.
 */
@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

/**
 * @description Resolves user-related GraphQL mutations by creating and updating user
 * objects in a database, verifying passwords, and returning the resolved user object.
 */
@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() { req, em }: MyContext) {
		if (!req.session.userId) {
			return null;
		}
		const user = await em.findOne(User, { id: req.session.userId });
		return user;
	}

	@Mutation(() => UserResponse)
	/**
	 * @description Validates user input, creates a new `User` entity, and persists it
	 * to the database upon successful validation.
	 *
	 * @param {UsernamePasswordInput} options - Used to validate and create a new user account.
	 *
	 * @param {object} obj - Referred to as `em`. It is an instance of `MyContext`, which
	 * is likely a custom context class for managing data in your application.
	 *
	 * @param {MyContext} obj.em - Used to manage the persistence of the created user
	 * instance through the `persistAndFlush()` method.
	 *
	 * @returns {Promise<UserResponse>} An object containing the registered user.
	 */
	async register(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserResponse> {
		if (options.username.length <= 2) {
			return {
				errors: [
					{
						field: "username",
						message: "Length must be greater than 2"
					}
				]
			};
		}
		if (options.password.length <= 2) {
			return {
				errors: [
					{
						field: "password",
						message: "Length must be greater than 2"
					}
				]
			};
		}
		const hashedPassword = await argon2.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		try {
			await em.persistAndFlush(user);
		} catch (err) {
			{
				if (err.code === "23505") {
					return {
						errors: [
							{
								field: "username",
								message: "Username already taken"
							}
						]
					};
				}
			}
		}

		req.session.userId = user.id;

		return {
			user
		};
	}

	@Mutation(() => UserResponse)
	/**
	 * @description Authenticates a user by checking if their username and password match
	 * an existing user record and verifying the password using the Argon2 library. If
	 * the credentials are valid, it returns the authenticated user object.
	 *
	 * @param {UsernamePasswordInput} options - Used to hold user input for authentication,
	 * including the username and password.
	 *
	 * @param {object} obj - Annotated with `@Ctx()`. This indicates that it represents
	 * an optional context object that can be used within the function to access data or
	 * services provided by the application's context.
	 *
	 * @param {MyContext} obj.em - Used to access and manipulate data from the database.
	 *
	 * @returns {Promise<UserResponse>} An object containing the authenticated user.
	 */
	async login(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { req, em }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, { username: options.username });
		if (!user) {
			return {
				errors: [
					{
						field: "username",
						message: "That username doesn't exist"
					}
				]
			};
		}
		const valid = await argon2.verify(user.password, options.password);
		if (!valid) {
			return {
				errors: [
					{
						field: "password",
						message: "Incorrect password"
					}
				]
			};
		}

		req.session.userId = user.id;

		return {
			user
		};
	}
}
