

/**
 * 根据实体解析动态的 endpoint
 */
function getUriValue(schemaRef = '') {
    const arr = schemaRef.split('/');
    return `/gw/${arr[1]}/graphql`;
}

/* eslint-disable no-underscore-dangle */
export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$graphql', {
            get() {
                return {
                    query: (schemaRef, resolverName, graphqlClient, variables) => {
                        const arr = schemaRef.split('/');
                        arr.shift();
                        arr.pop();
                        const longKey = arr.join('_') + '_' + resolverName;
                        const newVariables = {};
                        Object.keys(variables || {}).forEach((key) => {
                            newVariables[`Query__${longKey}__${key}`] = variables[key];
                        });
                        return this.$apollo.query({
                            query: this.$utils.gql `${graphqlClient}`,
                            variables: newVariables,
                            context: {
                                uri: getUriValue(schemaRef),
                            },
                        }).then((res) => {
                            console.log(res);
                            return res.data && res.data[longKey];
                        });
                    },
                    mutation: (schemaRef, resolverName, graphqlClient, variables) => {
                        const arr = schemaRef.split('/');
                        arr.shift();
                        arr.pop();
                        const longKey = arr.join('_') + '_' + resolverName;
                        const newVariables = {};
                        Object.keys(variables || {}).forEach((key) => {
                            newVariables[`Mutation__${longKey}__${key}`] = variables[key];
                        });

                        return this.$apollo.mutate({
                            mutation: this.$utils.gql `${graphqlClient}`,
                            variables: newVariables,
                            context: {
                                uri: getUriValue(schemaRef),
                            },
                        }).then((res) => res.data[longKey]);
                    },
                };
            },
        });
    },
};
