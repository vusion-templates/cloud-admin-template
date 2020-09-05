// Create a GraphQL schema and resolvers
// 生成方式需要使用这里导出的方法
import { makeExecutableSchema } from '@graphql-tools/schema';
// Setup Apollo client as usual, but use SchemaLink
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
// TODO import Query  and resolvers file for projects
import typeDefs from '../../apollo/index.gql';
import { resolvers } from '../../apollo/resolver';

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// define our apolloclient
export const apolloClient = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
});
