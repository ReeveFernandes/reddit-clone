import { Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface WrapperProps {
	children: ReactNode;
	varient?: "small" | "regular";
}

export const Wrapper: React.FC<WrapperProps> = ({
	children,
	varient = "regular"
}: any) => {
	return (
		<Box
			maxW={varient === "regular" ? "800px" : "400px"}
			mt={8}
			mx="auto"
			w="100%"
		>
			{children}
		</Box>
	);
};

export default Wrapper;
