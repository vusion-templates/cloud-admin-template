/**
 * 原来的 enums, dataTypes 目录之后废弃，统一集中到 metaData
 * 目前为了兼容老版，等之后升级图数据库统一迁移
 */
let dataTypesMap = {};
{
    function importAll(r) {
        r.keys().forEach((key) => dataTypesMap = r(key));
    }
    importAll(require.context('../dataTypes', true, /\/dataTypes.json$/));
}

const enums = {};
const enumsMap = {};
{
    function importAll(r) {
        r.keys().forEach((key) => enums[key.split('/')[1]] = r(key));
    }
    importAll(require.context('./', true, /\/(.*?)\/enums\.json$/));
    function createEnum(items) {
        const Enum = (key) => items[key];
        Object.assign(Enum, items);
        return Enum;
    }
    Object.keys(enums).forEach((serviceName) => {
        Object.keys(enums[serviceName]).forEach((enumKey) => {
            enumsMap[enumKey] = enumsMap[enumKey] || {};
            enumsMap[enumKey] = createEnum(enums[serviceName][enumKey]);
        });
    });
}

export default { dataTypesMap, enumsMap };
