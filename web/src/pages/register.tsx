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
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUTATION = `
mutation Register($username:String!, $password:String!) {
  register(options:{username: $username, password:$password}){
    errors{
      field
      message
    }
    user{
      id
      username
    }
  }
}`;

/**
 * @description Uses the `useMutation` hook to perform a server-side registered
 * mutation with the `REGISTER_MUTATION` payload, passing the form values as arguments.
 * 
 * @param {object} obj - Passed as the second argument to the `useMutation` hook. It
 * contains the props for the register form.
 * 
 * @returns {React.FC<registerProps>} A functional component that renders a form for
 * registering a user.
 */
export const Register: React.FC<registerProps> = ({}) => {
	const [, register] = useMutation(REGISTER_MUTATION);

	return (
		<Wrapper varient="small">
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={(values) => {
					return register(values);
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
