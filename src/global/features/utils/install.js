export const utils = {
    tryJSONParse(str) {
        let result;

        try {
            result = JSON.parse(str);
        } catch (e) {}

        return result;
    },
};

export default {
    install(Vue, options) {
        Vue.prototype.$utils = utils;
    },
};
