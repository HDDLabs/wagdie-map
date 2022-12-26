const _ = require('lodash');
const {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
} = require('@apollo/client');
const fetch = require('cross-fetch');

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'https://api.thegraph.com/subgraphs/name/wagdie/wagdieworld-mainnet', fetch }),
});

const locationQuery = gql`
  query Locations{
    locations {
      id
      name
      characters(first: 1000, where: { burned: false }) {
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

const init = async () => {
  const { data } = await client.query({
    query: locationQuery,
  });

  let owners = [];

  for (const location of data.locations) {
    console.log(location);
    for (const character of location.characters) {
      owners.push(character.owner.id);
    }
  }

  const uniqueOwners = _.uniq(owners);

  console.log(JSON.stringify(uniqueOwners))
}

init();
