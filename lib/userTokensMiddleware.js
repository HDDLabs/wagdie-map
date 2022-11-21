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

export const getAccount = async (accountId) =>
  await getAccountData(accountId, accountQuery);

export async function getAccountData(accountId, query) {
  const { data } = await client.query({
    query,
    variables: {
      accountId: accountId.toLowerCase(),
    },
  });

  if (!data.account) {
    return {};
  }

  const nfts = await Promise.all(
    data.account.characters.map(async (character) => {
      const response = await fetch(
        `https://fateofwagdie.com/api/characters/${character.id}`
      );
      const data = await response.json();

      const traitTypes = data.rawMetadata.attributes.map(
        (attribute) => attribute.trait_type
      );
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
        isBurned: character.burned,
        timestamp: character.timestamp,
        owner: accountId,
        location: character.location,
      };
    })
  );

  const unstaked = nfts.filter((nft) => !nft.location);
  const staked = nfts.filter(
    (nft) => nft.location != null && nft.isBurned == false
  );
  const alive = staked.concat(unstaked);
  const dead = nfts.filter((nft) => nft.isBurned);

  const userTokens = {
    alive: alive,
    dead: dead,
  };

  return userTokens;
}
