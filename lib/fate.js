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
      characters {
        id
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

        return {
          image: data.media[0].gateway,
          id: character.id,
          name: data.sheet.name === 'New Character' ? character.id : data.sheet.name,
          equipment: data.sheet.equipment,
          attributes: data.rawMetadata.attributes,
          is17: _.includes(traitTypes, 'The 17'),
          isDecrepit: _.includes(traitTypes, 'Decrepit'),
          isRoyal: _.includes(equipmentValues, "Fool's Crown"),
          isSilence: _.includes(equipmentValues, "Her Silence"),
        };
      }));

      locations.push({
        name: location.name,
        nfts: _.orderBy(nfts, ['is17', 'isDecrepit', 'isRoyal', 'isSilence'], ['desc', 'desc', 'desc', 'desc'])
      });
    }
  }

  return locations;
}
