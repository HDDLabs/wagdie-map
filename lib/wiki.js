import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client';
const DomParser = require('dom-parser');

const baseURL = "https://wagdie.wiki/"
const graphqlPath = "graphql"

const httpLink = createHttpLink({
  uri: baseURL + graphqlPath,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_WIKI_API_KEY}`
  }
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
      content
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

export async function getWikiLocationsData() {
  const { data } = await client.query({
    query: locationsQuery
  });


  const updatedArray = data.pages.list
    .map(item => {
      var temp = Object.assign({}, item);
      temp.path = baseURL + temp.path
      return temp;
    })

  const newMapArray = [];

  for (const location of updatedArray) {
    const pageContent = await getPageContent(location.id);
    newMapArray.push({
      ...location,
      ...pageContent,
    });
  }

  return newMapArray
}

export async function getPageContent(id) {
  const { data } = await client.query({
    query: pageContentQuery,
    variables: {
      id: id
    }
  });

  const pageContent = data.pages.single.content

  const parser = new DomParser();
  const dom = parser.parseFromString(pageContent);

  const details = dom.getElementById('details').innerHTML
  const lat = Number(dom.getElementById('lat').innerHTML)
  const lon = Number(dom.getElementById('lon').innerHTML)

  const pageDetails =
  {
    details: details,
    htmlcoordinates: [lat, lon]
  }

  return pageDetails
}