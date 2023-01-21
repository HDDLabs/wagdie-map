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
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
  },
});

const pageContentQuery = gql`
  query getPageContent($id: Int!) {
    pages {
      single(id: $id) {
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
      }
    }
  }
`;

const burnQuery = gql`
  query getPageTags {
    pages {
      list(tags: "burning") {
        id
        title
        path
      }
    }
  }
`;

const battlesQuery = gql`
  query getPageTags {
    pages {
      list(tags: "battles") {
        id
        title
        path
      }
    }
  }
`;

const deathsQuery = gql`
  query getPageTags {
    pages {
      list(tags: "deaths") {
        id
        title
        path
      }
    }
  }
`;

export async function getWikiDeathsData() {
  const deaths = await getWikiData(deathsQuery);
  return deaths;
}

export async function getWikiBattlesData() {
  const battles = await getWikiData(battlesQuery);
  return battles;
}

export async function getWikiBurnsData() {
  const burns = await getWikiData(burnQuery);
  return burns;
}

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

  for (const page of updatedArray) {
    const pageContent = await getPageContent(page.id);

    var updatedPageContent = pageContent.details;
    updatedPageContent =
      updatedPageContent +
      "<a href=" +
      page.path +
      " target='_blank' rel='noopener'>Read More...</a>";

    pageContent.details = updatedPageContent;

    newMapArray.push({
      wikiPageID: page.id,
      name: page.title,
      path: page.path,
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
  const lat = Number(dom.getElementById("lat")?.innerHTML);
  const lon = Number(dom.getElementById("lon")?.innerHTML);
  const locationID = dom.getElementById("locationID")?.innerHTML;
  const coordinates = dom.getElementById("coordinates")?.innerHTML;

  const updatedDetails = details.replace(
    /href/g,
    'target="_blank" rel="noreferrer" href'
  );

  const pageDetails = {
    details: updatedDetails,
    ...(coordinates && { htmlcoordinates: [lat, lon] }),
    ...(locationID && { locationID }),
  };

  return pageDetails;
}
