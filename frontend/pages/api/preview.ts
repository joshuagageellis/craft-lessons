/**
 * See Next docs for more info on preview mode:
 * https://nextjs.org/docs/advanced-features/preview-mode
 */
import { gql } from '@apollo/client';
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
    return res.status(401).json({ message: 'Invalid post id' });
  }

  if (!req.query.token && typeof req.query.token !== 'string') {
    return res.status(401).json({ message: 'Unaccessible' });
  }

  if (!req.query.type) {
    return res.status(401).json({ message: 'Unaccessible' });
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
    return res.status(401).json({ message: 'Unaccessible' });
  }

  console.log(data.entry);

  // Enable Preview Mode by setting the cookies
  res.setPreviewData(
    {
      canonicalId: data.entry.canonicalId,
      token: req.query.token,
    },
    {
      maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
    }
  );

  // Redirect to the id from the fetched post
  // We don't redirect to req.query.id as that might lead to open redirect vulnerabilities
  res.redirect(`/${req.query.type}/${data.entry.slug}`);
}

export default api;
