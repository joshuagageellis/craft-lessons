import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client';
import setUpClient from '../client/apollo';

export default function App({ Component, pageProps }: AppProps) {
  const client = setUpClient();

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
