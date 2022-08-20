import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client';

const baseURL = "https://wagdie.wiki/"
const graphqlPath = "graphql"

const httpLink = createHttpLink({
    uri: baseURL + graphqlPath,
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true
});

const pageContentQuery = gql`
query getPageContent($id: Int!) {
  pages {
    single(id: $id) {
      render
    }
  }
}
`

const locationsQuery = gql`
query getPageTags {
    pages {
      list(tags: "locations") {
        id
        title
        path
        description
        contentType
      }
    }
  }    
  `

export async function getWikiLocationsData() {
  const { data } = await client.query({
    query: locationsQuery
  });

  return data
}

export async function getPageContent(id) {
  const { data } = await client.query({
    query: pageContentQuery,
    variables: {
      id: id
    }
  });

  return data
}