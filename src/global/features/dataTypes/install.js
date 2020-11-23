import enums from '../../enums';
import dataTypesForSchema from '../../dataTypes';
import generate from '@babel/generator';
import { genInitData } from './tools';

export default {
    install(Vue, options = {}) {
        Vue.prototype.$global = {
            userInfo: {},
        };

        // read datatypes from template, then parse schema
        Vue.prototype.$transforSchemaWithDataTypes = (schema) => {
            // read from file
            const dataTypesMap = dataTypesForSchema || {}; // TODO 统一为  dataTypesMap
            const expressDataTypeObject = genInitData(schema || {}, dataTypesMap);
            const expression = generate(expressDataTypeObject).code;
            console.info('expression', expression);
            return expression;
        };

        Vue.prototype.$enums = (key, value) => {
            if (!key || !value)
                return '';
            if (enums[key]) {
                return enums[key](value);
            } else {
                return '';
            }
        };
    },
};
