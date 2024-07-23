import React from "react";
import { Field, Form, Formik } from "formik";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input
} from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
	function validateName(value) {
		let error;
		if (!value) {
			error = "Name is required";
		} else if (value.toLowerCase() !== "naruto") {
			error = "Jeez! You're not a fan 😱";
		}
		return error;
	}

	return (
		<Wrapper varient="small">
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={(values) => {
					console.log(values);
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="username"
							placeholder="username"
							label="Username"
						/>
						<Box mt={4}>
							<InputField
								name="password"
								placeholder="password"
								label="Password"
							/>
						</Box>
						<Button
							mt={4}
							type="submit"
							colorScheme="teal"
							isLoading={isSubmitting}
						>
							register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Register;