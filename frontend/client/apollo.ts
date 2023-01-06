import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

/**
 * Set up Apollo client.
 * Pass configs if needed.
 *
 * @param preview If preview.
 * @param token Preview token.
 */
 const setUpClient = (preview: boolean = false, token: string|null|undefined = null) => {
	let uri = `${process.env.NEXT_PUBLIC_GRAPHQL_URL}`;

	if (preview && token) {
			uri = `${uri}?token=${token}`;
	}
	
	return new ApolloClient({
			uri,
			cache: new InMemoryCache(),
	});
};

export default setUpClient;
