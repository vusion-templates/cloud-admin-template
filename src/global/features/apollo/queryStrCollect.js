
/**
 * 参数是数组的情况需要处理
 * 支持 val 结果包含变量，并且传递给 query 里面的 query 参数
 */
function objectToQuerystring(obj = {}) {
    return Object.keys(obj).reduce((str, key, i) => {
        const delimiter = (i === 0) ? '' : '&';
        key = encodeURIComponent(key);
        const val = obj[key] ? encodeURIComponent(obj[key]) : '';
        return [str, delimiter, key, '=', val].join('');
    }, '');
}
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
                    query: (schemaRef, operationName, graphqlClient, variables) => {
                        const arr = schemaRef.split('/');
                        arr.shift();
                        arr.pop();
                        const newVariables = {};
                        Object.keys(variables || {}).forEach((key) => {
                            // key 如果是保留的关键字， query，需要转化成 string 提供给后端
                            let value = variables[key];
                            if (key === 'query') {
                                value = objectToQuerystring(value);
                            }
                            newVariables[`Query__${operationName}__${key}`] = value;
                        });

                        return this.$apollo.query({
                            query: this.$utils.gql`${graphqlClient}`,
                            variables: newVariables,
                            context: {
                                uri: getUriValue(schemaRef),
                            },
                        }).then((res) => {
                            console.log(res);
                            return res.data && res.data[operationName];
                        });
                    },
                    mutation: (schemaRef, operationName, graphqlClient, variables) => {
                        const arr = schemaRef.split('/');
                        arr.shift();
                        arr.pop();
                        const newVariables = {};
                        Object.keys(variables || {}).forEach((key) => {
                            newVariables[`Mutation__${operationName}__${key}`] = variables[key];
                        });

                        return this.$apollo.mutate({
                            mutation: this.$utils.gql`${graphqlClient}`,
                            variables: newVariables,
                            context: {
                                uri: getUriValue(schemaRef),
                            },
                        }).then((res) => res.data[operationName]);
                    }
                };
            },
        });
    },
};
