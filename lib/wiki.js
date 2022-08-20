import { ApolloClient, createHttpLink, InMemoryCache, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const baseURL = "https://wagdie.wiki/"
const graphqlPath = "graphql"
const locationsPath = "locations/"

const httpLink = createHttpLink({
    uri: baseURL + graphqlPath,
    headers: {
        Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjgsImdycCI6MSwiaWF0IjoxNjU3MDQ1NDczLCJleHAiOjE2ODg2MDMwNzMsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMifQ.Lm3cHolM39FEsWLLSy54DkAIJyEKVZctejdsCjGClnEt3dfXcjsIQdB608u_NNnI1shyid7B0gdvcVQpXrlWSW5WrAG18aVU81g10Uf9JmYPQZycSKQpc0Qit_MnBV5WNafg0cXNxdPlEvhJnrbeuJuhWfPJmYETeePKkXzm0SQ-E3nYYLE0NncTuCiZ7FRPHaWl4Tadm5TN-ntU3sD7h5XHXccpP9G3zfFgH73CwEjmrpCtgN1wfEu71tLWalYbGpnFVFGO-IHoPb6EORtoyRHr4CMFpxKw11KaFicOtrap4kA4ItJYB4duFrqwjLd0l5KtjaoVSJKsQBNHYvdHew'
    }
});

const pageContentQuery = gql`
query getPageContent($id: Int!) {
  pages {
    single(id: $id) {
      render
    }
  }
}
`

const locationsQuery = gql`
query getPageTags {
    pages {
      list(tags: "locations") {
        title
        path
        description
        contentType
      }
    }
  }    
  `
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true
});

export async function getWikiLocationsData() {
    const { data } = await client.query({
        query: locationsQuery
    });

    return data
}

export async function getPageContent(id) {
    const { data } = await client.query({
        query: pageContentQuery,
        variables: {
            id: id
        }
    });

    return data
}