const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const staticSiteGenerator = require('static-site-generator-webpack-plugin');
const webpackNiceLog = require('webpack-nicelog');
const createBaseConfig = require('./base');

module.exports = function createProdConfig(props) {
  const config = createBaseConfig(props);

  config.entry('main').add(path.resolve(__dirname, '../core/prodEntry.js'));
  config.output.libraryTarget('umd');

  // Workaround for Webpack 4 Bug (https://github.com/webpack/webpack/issues/6522)
  config.output.globalObject('this');

  const {siteConfig, docsData, pagesData} = props;

  // static site generator webpack plugin
  const paths = [...docsData, ...pagesData].map(data => data.path);
  const template = ejs.compile(
    fs.readFileSync(
      path.resolve(__dirname, '../core/prodTemplate.ejs'),
      'utf-8'
    )
  );
  config.plugin('siteGenerator').use(staticSiteGenerator, [
    {
      entry: 'main',
      locals: {
        title: siteConfig.title || 'Munseo',
        baseUrl: siteConfig.baseUrl,
        template
      },
      paths
    }
  ]);
  // show compilation progress bar and build time
  config.plugin('niceLog').use(webpackNiceLog, [{name: 'Production'}]);

  return config;
};
