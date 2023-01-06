import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const GQL_URL = 'https://craftstarter.lndo.site/api';

/**
 * Set Up Client.
 */
const setupClient = () => {
	return new ApolloClient({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
		cache: new InMemoryCache(),
	});
}

export default setupClient;
