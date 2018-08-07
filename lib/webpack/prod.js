const path = require('path');
const staticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const createBaseConfig = require('./base');

module.exports = function createProdConfig(props) {
  const config = createBaseConfig(props);

  config.entry('main').add(path.resolve(__dirname, '../core/prodEntry.js'));
  config.output.libraryTarget('umd');

  // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
  config.output.globalObject('this');

  const {siteConfig, docsData, pagesData} = props;

  // Find all available paths
  const paths = [...docsData, ...pagesData].map(data => data.path);

  config.plugin('StaticSiteGenerator').use(staticSiteGeneratorPlugin, [
    {
      entry: 'main',
      locals: {
        bundlejs: 'bundle.js',
        title: siteConfig.title || 'Munseo',
        lang: 'en'
      },
      paths
    }
  ]);

  return config;
};
