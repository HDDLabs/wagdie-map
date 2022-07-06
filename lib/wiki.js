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
      }
    }
  }    
  `
const mapLocations = [
  {
    id: 95,
    coordinates: [520, 467]
  },
  {
    id: 96,
    coordinates: [535, 390]
  },
  {
    id: 97,
    coordinates: [500, 395]
  },
  {
    id: 98,
    coordinates: [545, 540]
  },
  {
    id: 99,
    coordinates: [480, 320]
  },
  {
    id: 100,
    coordinates: [520, 280]
  },
  {
    id: 101,
    coordinates: [515, 200]
  },
  {
    id: 102,
    coordinates: [580, 320]
  },
  {
    id: 103,
    coordinates: [480, 517]
  },
];

export async function getWikiLocationsData() {
  const { data } = await client.query({
    query: locationsQuery
  });

  const mergedArrays = data.pages.list
    .map(item => {
      var temp = Object.assign({}, item);
      temp.path = baseURL + temp.path
      return temp;
    })
    .map((item, i) => Object.assign({}, item, mapLocations[i]));

  return mergedArrays
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