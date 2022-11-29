import { gql } from '@apollo/client'
import setUpClient from '../../client/apollo';
import { NextRequest } from 'next/server';
import { NextPageContext } from 'next';
// import setUpClient from '../../client/apollo';

export default function Post(post) {
  console.log(post);
	return (
		<div>
      <h1>{post.title}</h1>
			{post?.summary ? (
        <p>
          {post.summary}
        </p>
      ): null}
		</div>
	)
}

// This function gets called at build time
export async function getStaticPaths(req: NextRequest) {
  const client = setUpClient();
  const { data } = await client.query({
    query: gql`
      query Posts {
        entries(section: "blog") {
					slug,
          id
				}
      }
    `,
  });

  // Get the paths we want to pre-render based on posts
  const paths = data.entries.map((post: any) => ({
    params: { slug: post.id, },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true }
}

const GET_POST = gql`
  query Post($id: [QueryArgument]) {
    entry(id: $id) {
      title
      ... on blog_blog_Entry {
        summary
      }
    }
  }`;

/**
 * 
 * Preview safe props query.
 */
export async function getStaticProps(context: any) {
  console.log('context', context);
  const client = context?.preview && context?.previewData ? setUpClient(true, context.previewData.token) : setUpClient();

  const { data } = await client.query({
    query: GET_POST,
    variables: {
      id: context.params.slug,
    }
  });

  return {
    props: data.entry
  };
}