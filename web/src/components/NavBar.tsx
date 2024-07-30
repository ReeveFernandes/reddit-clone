import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

/**
 * @description Renders a navigation bar with login/register buttons when not logged
 * in and displays the user's username and a logout button when logged in. It fetches
 * user data using the `useMeQuery` hook and updates the UI accordingly.
 * 
 * @param {object} obj - Destructured into two properties, `data` and `fetching`,
 * from the result of the `useMeQuery` hook. The hook returns an array with these two
 * properties.
 * 
 * @returns {React.ReactElement} A JSX element consisting of a Flex container that
 * contains either login/registration buttons if the user is not logged in, or the
 * username and a logout button if the user is logged in.
 */
export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery();
	console.log(data);

	let body = null;

	if (fetching) {
		// data is loading
	} else if (!data?.me) {
		// user not logged in
		body = (
			<>
				<Button
					colorScheme="teal"
					mr={4}
				>
					<Link href="/login">Login</Link>
				</Button>
				<Button colorScheme="teal">
					<Link href="/register">Register</Link>
				</Button>
			</>
		);
	} else {
		// user is logged in
		body = (
			<Flex>
				<Box mr={4}>{data.me.username}</Box>
				<Button variant="link">Logout</Button>
			</Flex>
		);
		console.log("====================================");
		console.log(data);
		console.log("====================================");
	}

	return (
		<Flex
			w="100%"
			p={4}
			color="white"
			bg="tomato"
			ml={"auto"}
		>
			{body}
		</Flex>
	);
};
