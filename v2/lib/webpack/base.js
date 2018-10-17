const Config = require('webpack-chain');
const CSSExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const mdLoader = require.resolve('./loader/markdown');

module.exports = function createBaseConfig(props, isServer) {
  const {
    siteConfig,
    outDir,
    themePath,
    docsDir,
    pagesDir,
    siteDir,
    sourceToMetadata,
    versionedDir,
    translatedDir,
    baseUrl,
  } = props;

  const config = new Config();
  const isProd = process.env.NODE_ENV === 'production';

  config
    .mode(isProd ? 'production' : 'development')
    .output.path(outDir)
    .filename(isProd ? '[name].[chunkhash].js' : '[name].js')
    .publicPath(isProd ? baseUrl : '/');

  if (!isProd) {
    config.devtool('cheap-module-eval-source-map');
  }

  config.resolve
    .set('symlinks', true)
    .alias.set('@theme', themePath)
    .set('@site', siteDir)
    .set('@versioned_docs', versionedDir)
    .set('@translated_docs', translatedDir)
    .set('@docs', docsDir)
    .set('@pages', pagesDir)
    .set('@build', outDir)
    .set('@generated', path.resolve(__dirname, '../core/generated'))
    .set('@core', path.resolve(__dirname, '../core'))
    .end();

  function applyBabel(rule) {
    rule
      .use('babel')
      .loader('babel-loader')
      .options({
        babelrc: false,
        presets: ['@babel/env', '@babel/react'],
        plugins: [
          isServer ? 'dynamic-import-node' : '@babel/syntax-dynamic-import',
        ],
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
    .options({
      siteConfig,
      versionedDir,
      translatedDir,
      docsDir,
      sourceToMetadata,
    });

  const cssRule = config.module.rule('css').test(/\.css$/);
  if (!isServer) {
    if (isProd) {
      cssRule.use('extract-css-loader').loader(CSSExtractPlugin.loader);
    } else {
      cssRule.use('style-loader').loader('style-loader');
    }
  }

  cssRule
    .use('css-loader')
    .loader(isServer ? 'css-loader/locals' : 'css-loader')
    .options({
      modules: true,
      importLoaders: 1,
      localIdentName: `[local]_[hash:base64:8]`,
      sourceMap: !isProd,
      minimize: true,
    });

  // mini-css-extract plugin
  config.plugin('extract-css').use(CSSExtractPlugin, [
    {
      filename: isProd ? '[name].[chunkhash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[chunkhash].css' : '[id].css',
    },
  ]);

  if (isProd) {
    config.optimization.minimizer([
      new UglifyJsPlugin({
        cache: true,
        uglifyOptions: {
          warnings: false,
          compress: false,
          ecma: 6,
          mangle: true,
        },
        sourceMap: true,
      }),
    ]);
  }

  return config;
};
