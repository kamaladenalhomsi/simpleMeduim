import { ApolloLink } from 'apollo-link';

import { HttpLink } from 'apollo-link-http';

import { InMemoryCache } from 'apollo-cache-inmemory';

 

export default ({  env }) => {

  const httpLink = new HttpLink({ uri: env.GRAPH_BASE_URL });


  return {

    link: httpLink,

    cache: new InMemoryCache()

  };

};
