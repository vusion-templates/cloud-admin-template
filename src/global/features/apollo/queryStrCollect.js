
import { graph } from '@/global/apollo/graph';

/* eslint-disable no-underscore-dangle */
export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$graphql', {
            get() {
                return {
                    query: (serviceName, queryKey, variables) => {
                        const key = serviceName + '_' + queryKey;
                        return this.$apollo.query({
                            query: graph[key],
                            variables,
                        }).then((res) => res.data[key]);
                    },
                    mutation: (serviceName, queryKey, variables) => {
                        const key = serviceName + '_' + queryKey;
                        return this.$apollo.mutate({
                            mutation: graph[key],
                            variables: {
                                [`Mutation__${queryKey}__body`]: variables,
                            },
                        }).then((res) => res.data[key]);
                    },
                }
            },
        });
    },
};
