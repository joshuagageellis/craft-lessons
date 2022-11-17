import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://craft.lndo.site/gql",
    cache: new InMemoryCache(),
});

export default client;
