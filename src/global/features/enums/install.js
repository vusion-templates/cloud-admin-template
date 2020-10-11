import enums from '../../enums';

export default {
    install(Vue, options = {}) {
        Vue.prototype.$enums = enums;
    },
};
