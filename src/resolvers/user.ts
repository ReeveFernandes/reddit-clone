import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Resolver
} from "type-graphql";
import argon2 from "argon2";

/**
 * @description Provides a form for users to enter their username and password securely.
 */
@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

/**
 * @description Holds information about a field-related error, including the field
 * name and error message.
 */
@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	message: string;
}

/**
 * @description Represents a response to a user's input, containing information about
 * any errors that occurred during processing and the user object itself.
 */
@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

/**
 * @description Resolves user-related mutations by creating, updating, and authenticating
 * users through their username and password.
 */
@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	/**
	 * @description Validates user input and creates a new user object in the database,
	 * persisting it and returning the created user object.
	 * 
	 * @param {UsernamePasswordInput} options - Used to validate user input for creating
	 * a new user account, specifically checking the length of the username and password
	 * fields.
	 * 
	 * @param {object} obj - Represented as an instance of `MyContext`. The context
	 * provides access to the entity manager for performing CRUD operations on the User
	 * entity.
	 * 
	 * @param {MyContext} obj.em - Used to persist and flush the newly created user to
	 * the database after creation.
	 * 
	 * @returns {Promise<UserResponse>} An object containing a single field called "user"
	 * that represents the registered user.
	 */
	async register(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { em }: MyContext
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
		return {
			user
		};
	}

	@Mutation(() => UserResponse)
	/**
	 * @description Verifies the username and password provided by the client through the
	 * `options` argument, and returns the authenticated user if valid, or an error message
	 * otherwise.
	 * 
	 * @param {UsernamePasswordInput} options - Used to store user credentials for
	 * authentication purposes.
	 * 
	 * @param {object} obj - Represented by the variable `em`. It contains the MyContext
	 * object, which likely holds data related to authentication and user management.
	 * 
	 * @param {MyContext} obj.em - Used to access the database for querying user information.
	 * 
	 * @returns {Promise<UserResponse>} An object containing the user details if the login
	 * was successful or an error message if there was any issue with the login credentials.
	 */
	async login(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { em }: MyContext
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
		return {
			user
		};
	}
}
