/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Config = require('webpack-chain');
const CSSExtractPlugin = require('mini-css-extract-plugin');
const rehypePrism = require('@mapbox/rehype-prism');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const mdLoader = require.resolve('./loaders/markdown');

const CSS_REGEX = /\.css$/;
const CSS_MODULE_REGEX = /\.module\.css$/;

// Utility method to add styling-related rule to Webpack config.
function applyStyle(styleRule, {cssOptions, isServer, isProd}) {
  if (!isServer) {
    if (isProd) {
      styleRule.use('extract-css-loader').loader(CSSExtractPlugin.loader);
    } else {
      styleRule.use('style-loader').loader('style-loader');
    }
  }

  styleRule
    .use('css-loader')
    .loader(isServer ? 'css-loader/locals' : 'css-loader')
    .options(cssOptions);

  return styleRule;
}

module.exports = function createBaseConfig(props, isServer) {
  const {
    siteConfig,
    outDir,
    themePath,
    docsDir,
    siteDir,
    sourceToMetadata,
    versionedDir,
    translatedDir,
    baseUrl,
    generatedFilesDir,
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
    .set('@build', outDir)
    .set('@generated', generatedFilesDir)
    .set('@core', path.resolve(__dirname, '../core'))
    .set('@docusaurus', path.resolve(__dirname, '../docusaurus'))
    .end()
    .modules.add(path.resolve(__dirname, '../../node_modules')) // Prioritize our own node modules.
    .add(path.resolve(siteDir, 'node_modules')); // load user node_modules

  function applyBabel(rule) {
    rule
      .use('babel')
      .loader('babel-loader')
      .options({
        babelrc: false,
        presets: ['@babel/env', '@babel/react'],
        plugins: [
          isServer ? 'dynamic-import-node' : '@babel/syntax-dynamic-import',
          'react-loadable/babel',
        ],
      });
  }

  const jsRule = config.module
    .rule('js')
    .test(/\.jsx?$/)
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

  /*
    Equivalent to:
    // ...
    {
      test: /(\.mdx?)$/,
      use: [
        'babel-loader',
        {
          loader: '@mdx-js/loader',
          options: { hastPlugins: [[rehypePrism, { ignoreMissing: true }]] }
        },
        'docusaurus/md-loader,
      ]
    }
  */
  const mdRule = config.module.rule('markdown').test(/(\.mdx?)$/);
  applyBabel(mdRule);
  mdRule
    .use('mdx-js-loader')
    .loader('@mdx-js/loader')
    .options({
      hastPlugins: [[rehypePrism, {ignoreMissing: true}]],
    });
  mdRule
    .use('docusaurus/md-loader')
    .loader(mdLoader)
    .options({
      siteConfig,
      versionedDir,
      translatedDir,
      docsDir,
      sourceToMetadata,
    });

  applyStyle(config.module.rule('css'), {
    cssOptions: {
      importLoaders: 1,
      sourceMap: !isProd,
      minimize: true,
    },
    isProd,
    isServer,
  })
    .test(CSS_REGEX)
    .exclude.add(CSS_MODULE_REGEX)
    .end();

  // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
  // using the extension .module.css
  applyStyle(config.module.rule('css-module'), {
    cssOptions: {
      modules: true,
      importLoaders: 1,
      localIdentName: `[local]_[hash:base64:8]`,
      sourceMap: !isProd,
      minimize: true,
    },
    isProd,
    isServer,
  }).test(CSS_MODULE_REGEX);

  // mini-css-extract plugin
  config.plugin('extractCSS').use(CSSExtractPlugin, [
    {
      filename: isProd ? '[name].[chunkhash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[chunkhash].css' : '[id].css',
    },
  ]);

  if (isProd) {
    config.optimization.minimizer([
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: 6,
          mangle: true,
          output: {
            comments: false,
          },
        },
      }),
    ]);
  }

  return config;
};
