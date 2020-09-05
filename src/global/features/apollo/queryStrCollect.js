
import { graph } from '@/global/apollo/graph';

/* eslint-disable no-underscore-dangle */
export default {
    install(Vue) {
        Vue.mixin({
            created() {
                if (!Vue.prototype.$graph) {
                    this._graph = graph;
                }
            },
        });
        Object.defineProperty(Vue.prototype, '$graph', {
            get() {
                return this._graph;
            },
        });
    },
};
