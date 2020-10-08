const path = require('path');
const pkg = require('../package.json');
module.exports = {
    config(baseConfig, pages) {
        baseConfig.outputDir = (baseConfig.outputDir || 'pkg') + '/' + pkg.version;
        Object.keys(pages).forEach((pageName) => {
            delete pages[pageName];
        });
    },
    chain(config) {
        config.externals({
            ...config.get('externals'),
            'cloud-ui.vusion': 'CloudUI',
        });
        config.resolve.alias.set('cloud-ui.vusion.css$', path.resolve(__dirname, './index.css'));
    },
};
