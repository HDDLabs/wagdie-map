import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import _ from "lodash";

const httpLink = createHttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/wagdie/wagdieworld-mainnet',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const locationQuery = gql`
  query Locations{
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

export const getLocations = async () => await getLocationsData(locationQuery);

export async function getLocationsData(query) {
  const { data } = await client.query({
    query: query,
  });

  const locations = [];

  for (const location of data.locations) {
    if (location.characters.length) {
      const nfts = await Promise.all(location.characters.map(async character => {
        const response = await fetch(`https://fateofwagdie.com/api/characters/${character.id}`);
        const data = await response.json();

        const traitTypes = data.rawMetadata.attributes.map((attribute) => attribute.trait_type);
        const equipmentValues = _.map(data.sheet.equipment, (value, key) => value);

        const name = data.sheet.name === 'New Character' ? character.id : data.sheet.name;

        return {
          image: data.media[0].gateway,
          id: character.id,
          name,
          shortName: name.length > 24 ? name.substring(0, 24) + '...' : name,
          equipment: data.sheet.equipment,
          attributes: data.rawMetadata.attributes,
          is17: _.includes(traitTypes, 'The 17'),
          isDecrepit: _.includes(traitTypes, 'Decrepit'),
          isRoyal: _.includes(equipmentValues, "Fool's Crown"),
          isSilence: _.includes(equipmentValues, "Her Silence") || _.includes(equipmentValues, "Her Glory"),
          isForgotten: _.includes(equipmentValues, "The Forgotten"),
          isWormlord: _.includes(equipmentValues, "Wormlord Guard", "Spines of The Worm") || _.includes(equipmentValues, "Spines of The Worm"),
          hasName: data.sheet.name !== 'New Character',
          isBurned: character.burned,
          timestamp: character.timestamp,
          owner: character.owner.id,
        };
      }));

      const known = nfts.filter(nft => nft.hasName && !nft.isBurned);
      const unknown = nfts.filter(nft => !nft.hasName && !nft.isBurned);
      const burned = nfts.filter(nft => nft.isBurned);
      const owners = _.uniq(nfts.map(nft => nft.owner));

      locations.push({
        name: location.name,
        known: _.orderBy(known, ['is17', 'isDecrepit', 'isWormlord', 'isForgotten', 'isRoyal', 'isSilence', 'timestamp'], ['desc', 'desc', 'desc', 'desc', 'desc', 'desc', 'asc']),
        unknown: _.orderBy(unknown, ['timestamp'], ['asc']),
        burned: _.orderBy(burned, ['timestamp'], ['asc']),
        owners,
      });
    }
  }

  return locations;
}
