import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery();

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
