import generate from '@babel/generator';
import { genInitData } from './tools';
import auth from '../router/auth';

export default {
    install(Vue, options = {}) {
        Vue.prototype.$global = {
            userInfo: {},
            requestFullscreen() {
                return document.body.requestFullscreen();
            },
            exitFullscreen() {
                return document.exitFullscreen();
            },
            hasAuth(authPath) {
                return auth.has(authPath);
            },
        };

        // read datatypes from template, then parse schema
        Vue.prototype.$genInitFromSchema = (schema) => {
            // read from file
            const dataTypesMap = options.dataTypesMap || {}; // TODO 统一为  dataTypesMap
            const expressDataTypeObject = genInitData(schema || {}, dataTypesMap);
            const expression = generate(expressDataTypeObject).code;
            console.info('expression', expression);
            // eslint-disable-next-line no-new-func
            return Function('return ' + expression)();
        };

        const enumsMap = options.enumsMap;
        Vue.prototype.$enums = (key, value) => {
            if (!key || !value)
                return '';
            if (enumsMap[key]) {
                return enumsMap[key](value);
            } else {
                return '';
            }
        };
    },
};
