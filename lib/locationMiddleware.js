import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";

import _ from "lodash";
import { getWikiLocationsData } from "../lib/wiki";

const httpLink = createHttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/wagdie/wagdieworld-mainnet",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const locationQuery = gql`
  query Locations {
    locations {
      id
      name
      xCoordinate
      yCoordinate
    }
  }
`;

export const getLocations = async () => await getLocationsData(locationQuery);

export async function getLocationsData(query) {
  const { data } = await client.query({
    query,
  });

  const wikiLocations = await getWikiLocationsData();

  const locations = [];
  for (const location of data.locations) {
    locations.push({
      name: location.name,
      locationID: location.id,
      htmlcoordinates: [location.xCoordinate, location.yCoordinate],
    });
  }

  wikiLocations.locations = _.chain(wikiLocations.locations)
    .map((wikiLocation) => {
      return _.merge(
        wikiLocation,
        _.find(locations, { locationID: wikiLocation.locationID })
      );
    })
    .unionBy(wikiLocations.locations, locations, "locationID")
    .value();

  return wikiLocations;
}
