# Setting Up Live Previews
We are going to setup the preview functionalit between Craft and Next. Craft has suprisingly good preview UI and fairly easy to setup.

## Craft Steps
Craft allows for setting up preview targets fairly easy. We will need to tell Craft what our Next JS url is, preferably as an environment variable.

1. Add the following to the CMS [`.env`](../cms/.env) file.

```
NEXTJS_PREVIEW_URL=https://localhost:3000/api/preview
```
And the following to [`./config/general.php`](../cms/config/general.php) to expose a custom alias to the dashboard.

```php
    // Define aliases.
    'aliases' => [
        '@nextjspreview' => App::env('NEXTJS_PREVIEW_URL'),
    ],
```

2. Add the alias and required data to the Blog entry settings. The url will be the following:

```
{{alias('@nextjspreview')}}?id={canonicalId}&&type=blog
```

Proceed to open a preview for a Blog entry, then we can set up the Next JS side.

[Craft Preview Docs](https://craftcms.com/docs/4.x/entries.html#previewing-decoupled-front-ends)



## Next JS Steps

### Step 1. Create a Preview API Route
Next requires an API route to bypass the static generation. The docs layout the steps fairly well, we will tie this in with our Apollo setup.

[Next Preview Docs](https://nextjs.org/docs/advanced-features/preview-mode)

First, we will create a new api route called `preview` in ['/pages/api/preview.ts'](../frontend/pages/api/previews.ts)

```ts
import { gql } from '@apollo/client'
import setUpClient from '../../client/apollo';
import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Handle preview api requests.
 *
 * @param req The request.
 * @param res The response.
 */
async function api(req: NextApiRequest, res: NextApiResponse) {
	if (!req.query.id) {
		return res.status(401).json({ message: 'Invalid post id' })
	}

	if (!req.query.token && typeof req.query.token !== 'string') {
		return res.status(401).json({ message: 'Unaccessible' })
	}

	const client = setUpClient(true, req.query.token as string);

  const { data } = await client.query({
    query: gql`
      {
        entry(id: "${req.query.id}") {
          slug,
          typeHandle,
          canonicalId
        }
      }
    `,
  });

  if (!data?.entry || !data.entry?.typeHandle) {
    return res.status(404);
  }
  
  console.log(data.entry);

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    canonicalId: data.entry.canonicalId,
    token: req.query.token,
  }, {
    maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
  });

  // Redirect to the id from the fetched post
  // We don't redirect to req.query.id as that might lead to open redirect vulnerabilities
  res.redirect(`/${data.entry.typeHandle}/${data.entry.canonicalId}`);
}

export default api;
```

And finally update our `[...all].tsx` route to handle the preview mode.

```ts
// ...
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
```

Our previews should be working!