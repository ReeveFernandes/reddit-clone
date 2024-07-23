import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";

const client = new Client({
	url: "http://localhost:4000/graphql",
	exchanges: [cacheExchange, fetchExchange]
});

/**
 * @description Defines an React component that wraps another component with two
 * providers: `ChakraProvider` and `Provider`. The `ChakraProvider` sets the theme
 * for the component, while the `Provider` sets the client object for the component
 * to use.
 * 
 * @param {object} obj - Passed as an argument to the `ChakraProvider`. The `Component`
 * is the component that will be rendered, while the `pageProps` is an object that
 * contains properties specific to the current page.
 * 
 * @param {AppProps} obj.Component - Passed as the first argument to the function,
 * allowing for the wrapping of a React component with other props.
 * 
 * @param {AppProps} obj.pageProps - Passed to the `Component` component as an argument,
 * providing additional props for the component to use.
 * 
 * @returns {JSXElement} A component that renders the specified `Component` with the
 * provided `pageProps`.
 */
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider value={client}>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</Provider>
	);
}

export default MyApp;
