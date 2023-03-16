import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  gql,
} from "@apollo/client";

import _ from "lodash";
import { getWikiLocationsData } from "../lib/wiki";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/wagdie/wagdieworld-mainnet",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
  connectToDevTools: true,
});

const locationQuery = gql`
  query Locations {
    locations {
      id
      name
      xCoordinate
      yCoordinate
      isLocationActive
      areNftsLocked
      characters(first: 1000) {
        id
        burned
        timestamp
        owner {
          id
        }
      }
    }
  }
`;

export const getLocations = async () => await getLocationsData(locationQuery);
export const invalidateCache = async () =>
  await invalidateCacheAndGetLocationsData();

export async function invalidateCacheAndGetLocationsData() {
  try {
    // Manually invalidate the cache and fetch new data from the network
    console.log(
      "Cache contents before reset:",
      client.readQuery({ query: locationQuery })
    );

    await client.resetStore();
    console.log(
      "Cache contents after reset:",
      client.readQuery({ query: locationQuery })
    );
  } catch (error) {
    console.log(error);
    throw new Error("Unable to invalidate the cache");
  }
}

export async function getLocationsData(query) {
  try {
    const { data } = await client.query({
      query,
    });

    if (!data || !data.locations) {
      throw new Error("Invalid location data");
    }

    const wikiLocations = await getWikiLocationsData();

    const locations = [];
    for (const location of data.locations) {
      if (!location.isLocationActive) continue;

      const characterPromises = location.characters.map(async (character) => {
        try {
          const response = await fetch(
            `https://fateofwagdie.com/api/characters/${character.id}`
          );

          const data = await response.json();

          const traitTypes = data.rawMetadata.attributes
            ? data.rawMetadata.attributes.map(
                (attribute) => attribute.trait_type
              )
            : [];

          const name =
            data.sheet.name === "New Character"
              ? character.id
              : data.sheet.name;

          return {
            image: _.get(data, "media[0].gateway", null),
            id: character.id,
            name,
            shortName: name.length > 24 ? name.substring(0, 24) + "..." : name,
            is17: _.includes(traitTypes, "The 17"),
            isDecrepit: _.includes(traitTypes, "Decrepit"),
            isBurned: character.burned,
            timestamp: character.timestamp,
            owner: character.owner.id,
            characterSheetURL: `https://fateofwagdie.com/characters/${character.id}`,
          };
        } catch (error) {
          const message = error.message.toLowerCase();
          if (message.includes("timeout")) {
            console.error(
              `Timeout error fetching data for character ${character.id}`
            );
          } else {
            console.error(
              `Error fetching data for character ${character.id}: ${error}`
            );
          }
          return { id: character.id, error };
        }
      });

      const characterResults = await Promise.allSettled(characterPromises);

      const nfts = characterResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const errors = characterResults
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason);

      if (errors.length > 0) {
        console.error(
          `Errors occurred while fetching character data for location ${location.id}:`,
          errors
        );
      }

      const alive = nfts.filter((nft) => !nft.isBurned);
      const dead = nfts.filter((nft) => nft.isBurned);

      locations.push({
        name: location.name,
        locationID: location.id,
        htmlcoordinates: [location.xCoordinate, location.yCoordinate],
        areNftsLocked: location.areNftsLocked,
        isLocationActive: location.isLocationActive,
        characters: {
          alive: _.orderBy(
            alive,
            ["is17", "isDecrepit", "timestamp"],
            ["desc", "desc", "asc"]
          ),
          dead: _.orderBy(dead, ["timestamp"], ["asc"]),
        },
      });
    }

    const filteredWikiLocations = _.filter(
      wikiLocations.locations,
      (wikiLocation) => _.has(wikiLocation, "locationID")
    );

    wikiLocations.locations = _.chain(filteredWikiLocations)
      .map((wikiLocation) => {
        return _.merge(
          wikiLocation,
          _.find(locations, { locationID: wikiLocation.locationID })
        );
      })
      .unionBy(filteredWikiLocations, locations, "locationID")
      .value();

    return wikiLocations;
  } catch (error) {
    console.log(error);
    throw new Error("Unable to fetch location data");
  }
}
