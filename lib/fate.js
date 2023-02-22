import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";

import _ from "lodash";

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

const accountQuery = gql`
  query Account($accountId: String!) {
    account(id: $accountId) {
      characters {
        id
        burned
        timestamp
        location {
          id
          name
        }
      }
    }
  }
`;

export const getLocations = async () => await getLocationsData(locationQuery);
export const getAccount = async (accountId) =>
  await getAccountData(accountId, accountQuery);

export async function getLocationsData(query) {
  const { data } = await client.query({
    query,
  });

  const locations = [];

  for (const location of data.locations) {
    if (location.characters.length) {
      const nfts = await Promise.all(
        location.characters.map(async (character) => {
          const response = await fetch(
            `https://fateofwagdie.com/api/characters/${character.id}`
          );
          const data = await response.json();

          const traitTypes = data.rawMetadata.attributes
            ? data.rawMetadata.attributes.map(
                (attribute) => attribute.trait_type
              )
            : [];

          const equipmentValues = _.map(
            data.sheet.equipment,
            (value, key) => value
          );

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
            hasName: data.sheet.name !== "New Character",
            isBurned: character.burned,
            timestamp: character.timestamp,
            owner: character.owner.id,
          };
        })
      );

      const known = nfts.filter((nft) => nft.hasName && !nft.isBurned);
      const unknown = nfts.filter((nft) => !nft.hasName && !nft.isBurned);
      const burned = nfts.filter((nft) => nft.isBurned);
      const owners = _.uniq(nfts.map((nft) => nft.owner));

      locations.push({
        name: location.name,
        known: _.orderBy(
          known,
          ["is17", "isDecrepit", "timestamp"],
          ["desc", "desc", "asc"]
        ),
        unknown: _.orderBy(unknown, ["timestamp"], ["asc"]),
        burned: _.orderBy(burned, ["timestamp"], ["asc"]),
        owners,
        staked: known.length + unknown.length,
      });
    }
  }

  return _.orderBy(locations, ["staked"], ["desc"]);
}

export async function getAccountData(accountId, query) {
  const { data } = await client.query({
    query,
    variables: {
      accountId: accountId.toLowerCase(),
    },
  });

  if (!data.account) {
    return [];
  }

  const nfts = await Promise.all(
    data.account.characters.map(async (character) => {
      const response = await fetch(
        `https://fateofwagdie.com/api/characters/${character.id}`
      );
      const data = await response.json();

      const traitTypes = data.rawMetadata.attributes
        ? data.rawMetadata.attributes.map((attribute) => attribute.trait_type)
        : [];

      const equipmentValues = _.map(
        data.sheet.equipment,
        (value, key) => value
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
        hasName: data.sheet.name !== "New Character",
        isBurned: character.burned,
        timestamp: character.timestamp,
        owner: accountId,
        location: _.get(character.location, "name") || "Unstaked",
      };
    })
  );

  const locations = {};

  for (const nft of nfts) {
    if (!locations[nft.location]) {
      locations[nft.location] = {
        name: nft.location,
        known: [],
        unknown: [],
        burned: [],
      };
    }

    if (nft.hasName && !nft.isBurned) {
      locations[nft.location].known.push(nft);
    }

    if (!nft.hasName && !nft.isBurned) {
      locations[nft.location].unknown.push(nft);
    }

    if (nft.isBurned) {
      locations[nft.location].burned.push(nft);
    }
  }

  return _.chain(locations)
    .map((l) => {
      return {
        name: l.name,
        known: _.orderBy(
          l.known,
          ["is17", "isDecrepit", "timestamp"],
          ["desc", "desc", "asc"]
        ),
        unknown: _.orderBy(l.unknown, ["timestamp"], ["asc"]),
        burned: _.orderBy(l.burned, ["timestamp"], ["asc"]),
        staked: l.known.length + l.unknown.length,
      };
    })
    .orderBy(["staked"], ["desc"])
    .value();
}
