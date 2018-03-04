const fetch = require('node-fetch');
const { ApolloClient } = require('apollo-client');
const { HttpLink } = require('apollo-link-http');
const { ApolloLink} = require('apollo-link');
const { InMemoryCache } = require( 'apollo-cache-inmemory');

function initClient() {
    const httpLink = new HttpLink({ uri: 'http://localhost:8080/graphql', fetch});

    const client = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      ssrMode: true
    });

    return client;
}

module.exports = async function() {
    global.Client = initClient();
}