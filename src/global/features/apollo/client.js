
import { makeExecutableSchema } from '@graphql-tools/schema';
// Setup Apollo client as usual, but use SchemaLink
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import requester from './requester';

const link = createHttpLink({
    fetch: requester,
    uri: 'http://10.242.197.159:8081/graphql',
    fetchOptions: {
        method: 'POST',
    },
});

// define our apolloclient
export const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache({
        addTypename: false, // 会破坏 get -> update，暂时先关闭
    }),
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only', // 获取最新的请求数据
            errorPolicy: 'all',
        },
    },
});
