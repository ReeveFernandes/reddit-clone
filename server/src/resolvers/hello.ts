import { Query, Resolver } from "type-graphql";

/**
 * @description Defines a resolver for generating a string message "Hello World!" in
 * response to an unknown query.
 */
@Resolver()
export class HelloResolver {
	@Query(() => String)
	/**
	 * @description Returns the string "Hello World!" when called, indicating successful
	 * resolution of the hello request.
	 * 
	 * @returns {string} "Hello World!"
	 */
	hello() {
		return "Hello World!";
	}
}
