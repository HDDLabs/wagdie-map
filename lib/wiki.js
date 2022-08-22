import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
const DomParser = require("dom-parser");

const baseURL = "https://wagdie.wiki/";
const graphqlPath = "graphql";
const mapDataPageID = 457;

const httpLink = createHttpLink({
  uri: baseURL + graphqlPath,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_WIKI_API_KEY}`,
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
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
`;

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
`;

export async function getWikiLocationsData() {
  const locations = await getWikiData(locationsQuery);

  const ourLocation = await getOurLocation();
  const locationData = {
    locations: locations,
    ourLocation: ourLocation,
  };

  return locationData;
}

export async function getWikiData(query) {
  const { data } = await client.query({
    query: query,
  });

  const updatedArray = data?.pages?.list.map((item) => {
    var temp = Object.assign({}, item);
    temp.path = baseURL + temp.path;
    return temp;
  });

  const newMapArray = [];

  for (const location of updatedArray) {
    const pageContent = await getPageContent(location.id);

    var updatedPageContent = pageContent.details;
    updatedPageContent =
      updatedPageContent +
      "<a href=" +
      location.path +
      " target='_blank' rel='noopener'>Read More...</a>";

    pageContent.details = updatedPageContent;

    newMapArray.push({
      ...location,
      ...pageContent,
    });
  }

  return newMapArray;
}

export async function getOurLocation() {
  const { data } = await client.query({
    query: pageContentQuery,
    variables: {
      id: mapDataPageID,
    },
  });

  const pageContent = data.pages.single.content;

  const parser = new DomParser();
  const dom = parser.parseFromString(pageContent);

  const lat = Number(dom.getElementById("lat").innerHTML);
  const lon = Number(dom.getElementById("lon").innerHTML);

  const pageDetails = {
    htmlcoordinates: [lat, lon],
  };

  return pageDetails;
}

export async function getPageContent(id) {
  const { data } = await client.query({
    query: pageContentQuery,
    variables: {
      id: id,
    },
  });

  const pageContent = data.pages.single.content;

  const parser = new DomParser();
  const dom = parser.parseFromString(pageContent);

  const details = dom.getElementById("details").innerHTML;
  const lat = Number(dom.getElementById("lat").innerHTML);
  const lon = Number(dom.getElementById("lon").innerHTML);

  const updatedDetails = details.replace(
    /href/g,
    'target="_blank" rel="noreferrer" href'
  );

  const pageDetails = {
    details: updatedDetails,
    htmlcoordinates: [lat, lon],
  };

  return pageDetails;
}
