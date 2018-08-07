const Config = require('webpack-chain');
const path = require('path');

const mdLoader = require.resolve('./loader/markdown');

module.exports = function createBaseConfig(props) {
  const {siteConfig, outDir, themePath, siteDir, baseUrl} = props;

  const config = new Config();
  const isProd = process.env.NODE_ENV === 'production';

  config
    .mode(isProd ? 'production' : 'development')
    .output.path(outDir)
    .filename(isProd ? 'bundle.js' : '[name].js')
    .publicPath(isProd ? baseUrl : '/');

  config.resolve
    .set('symlinks', true)
    .alias.set('@theme', themePath)
    .set('@site', siteDir)
    .set('@generated', path.resolve(__dirname, '../core/generated'))
    .set('@core', path.resolve(__dirname, '../core'))
    .end();

  function applyBabel(rule) {
    rule
      .use('babel')
      .loader('babel-loader')
      .options({
        babelrc: false,
        presets: ['env', 'react']
      });
  }

  const jsRule = config.module
    .rule('js')
    .test(/\.js$/)
    .exclude.add(filepath => {
      // Always transpile lib directory
      if (filepath.startsWith(path.join(__dirname, '..'))) {
        return false;
      }
      // Don't transpile node_modules
      return /node_modules/.test(filepath);
    })
    .end();

  applyBabel(jsRule);

  const mdRule = config.module.rule('markdown').test(/\.md$/);

  applyBabel(mdRule);

  mdRule
    .use('markdown-loader')
    .loader(mdLoader)
    .options({siteConfig});

  return config;
};
