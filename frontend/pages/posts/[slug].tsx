import { gql } from '@apollo/client'
import client from '../../client/apollo';

export default function Post({ post }) {
	return (
		<div>
			<h1>{post.title}</h1>
      <p>{post.summary}</p>
		</div>
	)
}

export async function getStaticProps(context) {
	const { data } = await client.query({
    query: gql`
      query Post {
        entry(slug: "${context.params.slug}") {
          title
          slug
          id
          ... on blog_blog_Entry {
            summary
            featureImage {
              id
              url
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      post: data.entry,
    }, // will be passed to the page component as props
  }
}

// This function gets called at build time
export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query Posts {
        entries(section: "blog") {
					slug
				}
      }
    `,
  });

  // Get the paths we want to pre-render based on posts
  const paths = data.entries.map((post) => ({
    params: { slug: post.slug },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}