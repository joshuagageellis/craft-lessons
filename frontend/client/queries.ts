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