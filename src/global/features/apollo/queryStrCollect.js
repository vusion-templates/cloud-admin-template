
import { graph } from '@/global/apollo/graph';

/* eslint-disable no-underscore-dangle */
export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$graphql', {
            get() {
                return {
                    query: (schemaRef, resolverName, variables) => {
                        const arr = schemaRef.split('/');
                        arr.shift();
                        arr.pop();
                        const key = arr.join('_') + '_' + resolverName;
                        const newVariables = {};
                        Object.keys(variables || {}).forEach((key) => {
                            newVariables[`Query__${resolverName}__${key}`] = variables[key];
                        });

                        return this.$apollo.query({
                            query: graph[key],
                            variables: newVariables,
                        }).then((res) => {
                            console.log(res);
                            return res.data[key];
                        });
                    },
                    mutation: (schemaRef, resolverName, variables) => {
                        const arr = schemaRef.split('/');
                        arr.shift();
                        arr.pop();
                        const key = arr.join('_') + '_' + resolverName;
                        const newVariables = {};
                        Object.keys(variables || {}).forEach((key) => {
                            newVariables[`Mutation__${resolverName}__${key}`] = variables[key];
                        });

                        return this.$apollo.mutate({
                            mutation: graph[key],
                            variables: newVariables,
                        }).then((res) => res.data[key]);
                    },
                }
            },
        });
    },
};
