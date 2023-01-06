# NextJS w/ Apollo Client
Now that Craft has some data and is ready for us to query, we can start building our NextJS app. We are going to do the following:
- Setup Apollo Client
- Query our basic global data
- Handle page routing for the Blog entry type
- Handle preview mode from Craft

## [Setup Apollo Client](https://www.apollographql.com/docs/react/get-started/)
We should already have Apollo and GQL installed in NextJS. If not, run the following:
```bash
npm install @apollo/client graphql
```

## Step 1. Initialize our client
Create a new directory in the FE directory called 'client' and add a file called `apollo.ts`

```bash
mkdir client; cd client; touch apollo.ts
```

Open `apollo.ts` and we are going to create our client init function.

```ts
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const GQL_URL = 'https://craftstarter.lndo.site/api';

/**
 * Set Up Client.
 */
const setupClient = () => {
	return new ApolloClient({
		uri: GQL_URL,
		cache: new InMemoryCache(),
	});
}

/**
 * Test Query.
 */
const client = setupClient();
client.query({
	query: gql`
		query MyQuery {
			globalSet {
				... on global_GlobalSet {
					name
					siteDescription
					siteTitle
				}
			}
		}
	`,
}).then((result) => {
	console.log(result);
});
```

In [`_app.tsx`](../frontend/pages/_app.tsx) we can import our client script and test our query. Add the following snippet and open the dev tools console to see the result.

```ts
// _app.tsx
import 'client/apollo';
```

One quick change, we are going to move our GQL url to an ENV variable. Create a new file called `.env.local` in the root of the FE directory and add the following:

```bash
touch .env.local
```

```
NEXT_PUBLIC_GRAPHQL_URL=https://craftstarter.lndo.site/api
```
Notice this is prefixed with `NEXT_PUBLIC` this tells Next that this is availble to the FE. We can now update our `apollo.ts` file to use this variable.

```ts
// ...
const setupClient = () => {
	return new ApolloClient({
		uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, // Here.
		cache: new InMemoryCache(),
	});
}
// ...
```

Then, re-run `npm run dev-https` to reinit the env variables.

## Step 2. Add Apollo Provider
"You connect Apollo Client to React with the ApolloProvider component. Similar to React's Context.Provider, ApolloProvider wraps your React app and places Apollo Client on the context, enabling you to access it from anywhere in your component tree." - [Apollo Docs](https://www.apollographql.com/docs/react/get-started/#step-4-connect-your-client-to-react)

First we need to export our client setup function from `apollo.ts`. Update the file to export the `setupClient` function. Go ahead and delete our test query as well.

```ts
// ...

export default setupClient;
```

Now from within `_app.tsx` we will import our client function and wrap our app with the ApolloProvider.

```ts
// ...
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
```

We can now test querying data from within our app. Open `index.tsx` and we are going to update this page to query and display our global data.

```ts
import Head from 'next/head'
import { useQuery, gql } from '@apollo/client';

const GET_GLOBAL_DATA = gql`
  query MyQuery {
    globalSet {
      ... on global_GlobalSet {
        name
        siteDescription
        siteTitle
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_GLOBAL_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const {
    globalSet: { siteDescription, siteTitle },
  } = data;

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <main>
        <h1>{siteTitle}</h1>
        <p>{siteDescription}</p>
      </main>
    </>
  );
}
```

A common pattern when working with GQL is to extract our queries into a separate file. We can go ahead and do this. Create a new file called `queries.ts` in the `client` directory and add the following:

```ts
import { gql } from '@apollo/client';

export const GET_GLOBAL_DATA = gql`
  query MyQuery {
    globalSet {
      ... on global_GlobalSet {
        name
        siteDescription
        siteTitle
      }
    }
  }
`;
```

Then update our index.tsx file to import the query from the new file. We will start saving all of ou queries in this file from now on.

```ts
// ...
import { GET_GLOBAL_DATA } from '../client/queries';
// ...
```

## Step 3. Blog Page Routing
"Next.js has a file-system based router built on the concept of pages. When a file is added to the pages directory, it's automatically available as a route. The files inside the pages directory can be used to define most common patterns." - [Next Docs](https://nextjs.org/docs/routing/introduction)

We are going to create a dynamic route for our blog entries.

Create a new directory under pages, `blog`, within the directory create a new file called `[...all].tsx`. This is a dynamic route in next that will catch all urls that start with `/blog/`.

We can now create a simple blog post. We need to add two primary functions to get our routing and basic props working.

- [`getStaticPaths`](https://nextjs.org/docs/basic-features/data-fetching/get-static-paths) - This function tells NextJS which paths to pre-render.

- [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) - This function tells NextJS which props to pass to the page component.

Note: You'll notice I've added another ENV var as the asset base url. This could be a CDN or another url per environment. We need to add this to our `.env.local` file.

```
NEXT_PUBLIC_ASSET_BASE=http://craftstarter.lndo.site/
```


```ts
import setupClient from "../../client/apollo";
import { GET_POST_BY_ID, GET_POST_BY_SLUG, GET_BLOG_ENTRIES } from "../../client/queries";

export default function Blog(props) {
	console.log(props);

	const { entry } = props;
	const { title, subtitle, featuredImage } = entry;

	return (
		<div>
			<h1>{title}</h1>
			<p>{subtitle}</p>
			<img width="200" src={`${process.env.NEXT_PUBLIC_ASSET_BASE}${featuredImage[0].url}`} alt={title} />
		</div>
	);
}

export async function getStaticPaths() {
	const client = setupClient();

	const { data } = await client.query({
		query: GET_BLOG_ENTRIES,
	});

	const paths: any[] = [];
	data.entries.forEach((e: any) => {
		paths.push({ params: { all: [e.slug] } });
		paths.push({ params: { all: [e.id] } });
	});


  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  }
}

export async function getStaticProps(context) {
	const client = setupClient();

	let staticProps: any = {};
	const { all } = context.params;

	// Kinda hacky but whatever for now.
	// We wanna handle both the slug and id.
	if ( all.length === 1 && !isNaN(parseInt(all[0], 10))) {
		const { data } = await client.query({
			query: GET_POST_BY_ID,
			variables: {
				id: all[0],
			},
		});
		staticProps = data;
	} else {
		const { data } = await client.query({
			query: GET_POST_BY_SLUG,
			variables: {
				slug: all[0],
			},
		});
		staticProps = data;
	}
	
	return {
		props: staticProps
	};
}
```

Our `./client/queries.ts` will look something like this:

```ts
import { gql } from '@apollo/client';

export const GET_BLOG_ENTRIES = gql`
	query BlogEntries {
		entries(section: "blog") {
			id
			slug
		}
	}
`;

export const BLOG_ON_FRAGMENT = gql`
	fragment BlogOnFragment on blog_default_Entry {
		subtitle
		featuredImage {
			url
		}
	}
`;

export const GET_POST_BY_ID = gql`
	${BLOG_ON_FRAGMENT}
  query Post($id: [QueryArgument]) {
    entry(id: $id) {
			title
			... on blog_default_Entry {
				...BlogOnFragment
			}
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
	${BLOG_ON_FRAGMENT}
  query Post($slug: [String]) {
    entry(slug: $slug) {
			title
			... on blog_default_Entry {
				...BlogOnFragment
			}
    }
  }
`;

export const GET_GLOBAL_DATA = gql`
  query MyQuery {
    globalSet {
      ... on global_GlobalSet {
        name
        siteDescription
        siteTitle
      }
    }
  }
`;
```

We can now access a blog post with data.

