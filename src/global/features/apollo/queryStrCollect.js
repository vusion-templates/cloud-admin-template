
import { graph } from '@/global/apollo/graph';

/* eslint-disable no-underscore-dangle */
export default {
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$graphql', {
            get() {
                return {
                    query: (key, variables) => {
                        return this.$apollo.query({
                            query: graph[key],
                            variables,
                        }).then((res) => res.data[key]);
                    }
                }
            },
        });
    },
};
