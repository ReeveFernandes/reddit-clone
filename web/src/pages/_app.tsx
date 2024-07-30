import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";
import { __prod__ } from "../../../server/src/constants";

const client = new Client({
	url: __prod__ ? "https://myapp.com/graphql" : "http://localhost:4000/graphql",
	exchanges: [cacheExchange, fetchExchange],
	fetchOptions: {
		credentials: "include" // Include credentials in requests
	}
});

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
