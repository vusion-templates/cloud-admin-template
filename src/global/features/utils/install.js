import gql from 'graphql-tag';
import cloneDeep from 'lodash/cloneDeep';

export const utils = {
    gql,
    Split(str, seperator) {
        return str.split(seperator);
    },
    Join(arr, seperator) {
        return arr.join(seperator);
    },
    Clone(obj) {
        return cloneDeep(obj);
    },
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
