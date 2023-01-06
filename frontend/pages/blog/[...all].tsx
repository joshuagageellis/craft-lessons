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
	const { all } = context.params;
	let staticProps: any = {};
	let client: any = null;

	if (context?.previewData && context.previewData?.canonicalId) {
		client = setupClient(true, context.previewData?.token);
	} else {
		client = setupClient();
	}

	// Kinda hacky but whatever for now.
		// We wanna handle both the slug and id.
		if ( all.length === 1 && !isNaN(parseInt(all[0], 10)) ) {
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