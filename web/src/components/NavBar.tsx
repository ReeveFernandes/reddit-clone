import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	return (
		<Flex
			bg="tomato"
			p={4}
		>
			<Box
				bg="tomato"
				w="100%"
				p={4}
				color="white"
				ml={"auto"}
			>
				<Button
					colorScheme="teal"
					mr={4}
				>
					<Link href="/">Home</Link>
				</Button>
				<Button
					colorScheme="teal"
					mr={4}
				>
					<Link href="/login">Login</Link>
				</Button>
				<Button colorScheme="teal">
					<Link href="/register">Register</Link>
				</Button>
			</Box>
		</Flex>
	);
};
