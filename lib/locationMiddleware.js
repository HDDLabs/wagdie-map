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
  queryDeduplication: false,
  connectToDevTools: true,
  defaultOptions: {
    query: {
      fetchPolicy: "network-only",
    },
  },
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

export async function getLocationsData(query) {
  const { data } = await client.query({
    query,
  });

  const wikiLocations = await getWikiLocationsData();

  const locations = [];
  for (const location of data.locations) {
    const nfts = await Promise.all(
      location.characters.map(async (character) => {
        const response = await fetch(
          `https://fateofwagdie.com/api/characters/${character.id}`
        );
        const data = await response.json();

        const traitTypes = data.rawMetadata.attributes.map(
          (attribute) => attribute.trait_type
        );

        const name =
          data.sheet.name === "New Character" ? character.id : data.sheet.name;

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
      })
    );

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
