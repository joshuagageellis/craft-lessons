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

  console.log(data);
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
