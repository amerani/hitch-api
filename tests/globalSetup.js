const { API_HOST, API_PORT } = require('./config');
const fetch = require('node-fetch');
const { ApolloClient } = require('apollo-client');
const { HttpLink } = require('apollo-link-http');
const { ApolloLink} = require('apollo-link');
const { InMemoryCache } = require( 'apollo-cache-inmemory');

function initClient() {
    const httpLink = new HttpLink({ 
        uri: `http://${API_HOST}:${API_PORT}/graphql`,
        fetch
    });

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