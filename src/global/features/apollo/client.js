// Setup Apollo client as usual, but use SchemaLink
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { buildAxiosFetch } from 'axios-fetch';
import { createHttpLink } from 'apollo-link-http';
import axios from 'axios';

const formatContentType = function (contentType, data) {
    const map = {
        'application/x-www-form-urlencoded'(data) {
            return JSON.stringify(data);
        },
    };
    return map[contentType] ? map[contentType](data) : data;
};

const requester = function (chosenURI, options) {
    const { headers = {}, params, baseURL = '', method = 'POST', body = {}} = options;
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    console.info('request', options);
    const req = axios({
        params,
        baseURL,
        method,
        url: chosenURI,
        data: formatContentType(headers['Content-Type'], body),
        headers,
        withCredentials: !baseURL,
        xsrfCookieName: 'csrfToken',
        xsrfHeaderName: 'x-csrf-token',
    });
    return buildAxiosFetch(req);
};

const link = createHttpLink({
    fetchOptions: {
        method: 'POST'
    },
    fetch: requester
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
